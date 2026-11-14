// ============================================================================
// CVSense document text extraction — runs entirely in the browser.
//
//   .txt / .md   plain text
//   .docx        ZIP → word/document.xml (raw DEFLATE via DecompressionStream)
//   .pdf         object streams → FlateDecode → text operators
//
// No libraries and no uploads: the file never leaves the page. Scanned PDFs
// and PDFs with unembedded font maps can't be recovered this way, so we detect
// unreadable output and say so instead of scoring garbage.
// ============================================================================

const decoderLatin1 = new TextDecoder("latin1");

function bytesToLatin1(bytes) {
  let out = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
  }
  return out;
}

async function inflate(bytes, format) {
  if (typeof DecompressionStream === "undefined") return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
    const buf = await new Response(stream).arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

function printability(text) {
  if (!text.length) return 0;
  let good = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c < 0x0250) || (c >= 0x2000 && c <= 0x206f)) good++;
  }
  return good / text.length;
}

function tidy(text) {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ---------------------------------- PDF ---------------------------------- */

function decodePdfLiteral(input) {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch !== "\\") {
      out += ch;
      continue;
    }
    const next = input[++i];
    if (next === undefined) break;
    if (next === "n") out += "\n";
    else if (next === "r") out += "\r";
    else if (next === "t") out += "\t";
    else if (next === "b") out += "\b";
    else if (next === "f") out += "\f";
    else if (next === "\n") {
      /* line continuation */
    } else if (next >= "0" && next <= "7") {
      let oct = next;
      while (oct.length < 3 && input[i + 1] >= "0" && input[i + 1] <= "7") oct += input[++i];
      out += String.fromCharCode(parseInt(oct, 8));
    } else if (next === "\r") {
      if (input[i + 1] === "\n") i++;
    } else out += next;
  }
  return out;
}

function decodePdfHex(input) {
  const hex = input.replace(/[^0-9a-fA-F]/g, "");
  const padded = hex.length % 2 ? hex + "0" : hex;
  const bytes = new Uint8Array(padded.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(padded.substr(i * 2, 2), 16);
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    let out = "";
    for (let i = 2; i + 1 < bytes.length; i += 2) {
      out += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
    }
    return out;
  }
  return decoderLatin1.decode(bytes);
}

function appendText(out, chunk) {
  if (!chunk) return out;
  if (out && /[A-Za-z0-9]$/.test(out) && /^[A-Za-z0-9]/.test(chunk)) out += " ";
  return out + chunk;
}

/** Pull readable text out of one decoded content stream. */
function textFromContentStream(content) {
  let out = "";
  const re = /\((?:\\.|[^\\()])*\)|<[0-9A-Fa-f\s]+>|\bT[djJ]\b|\bT\*|\bET\b|\bTf\b/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const token = m[0];
    if (token.charCodeAt(0) === 40 /* ( */) {
      out = appendText(out, decodePdfLiteral(token.slice(1, -1)));
    } else if (token.charCodeAt(0) === 60 /* < */) {
      out = appendText(out, decodePdfHex(token.slice(1, -1)));
    } else if (token === "Td" || token === "TD" || token === "T*" || token === "ET") {
      if (out && !out.endsWith("\n")) out += "\n";
    }
  }
  return out;
}

async function pdfToText(buffer) {
  const bytes = new Uint8Array(buffer);
  const raw = bytesToLatin1(bytes);
  const streams = [];
  const marker = /<<([\s\S]{0,2000}?)>>\s*stream\r?\n/g;
  let match;
  while ((match = marker.exec(raw)) !== null) {
    const dict = match[1];
    const start = marker.lastIndex;
    const end = raw.indexOf("endstream", start);
    if (end === -1) break;
    let chunk = bytes.subarray(start, end);
    const lengthMatch = dict.match(/\/Length\s+(\d+)/);
    if (lengthMatch) {
      const declared = parseInt(lengthMatch[1], 10);
      if (declared > 0 && declared <= chunk.length) chunk = chunk.subarray(0, declared);
    }
    if (/FlateDecode/.test(dict)) {
      const inflated = await inflate(chunk, "deflate");
      if (!inflated) continue;
      chunk = inflated;
    }
    if (chunk.length > 8) streams.push(decoderLatin1.decode(chunk));
    marker.lastIndex = end + 9;
  }

  let text = "";
  for (const stream of streams) {
    if (!/\bTj\b|\bTJ\b/.test(stream)) continue;
    text += textFromContentStream(stream) + "\n";
  }
  text = tidy(text);

  if (text.length < 40) {
    throw new Error(
      "This PDF has no readable text layer — it's probably a scan. Paste the text or upload a DOCX instead."
    );
  }
  if (printability(text) < 0.72) {
    throw new Error(
      "This PDF uses embedded font encoding CVSense can't read. Paste the text or upload a DOCX instead."
    );
  }
  return text;
}

/* --------------------------------- DOCX ---------------------------------- */

async function docxToText(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  let eocd = -1;
  const floor = Math.max(0, bytes.length - 66000);
  for (let i = bytes.length - 22; i >= floor; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("That file isn't a valid DOCX (no ZIP directory found).");

  const entries = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  let target = null;

  for (let i = 0; i < entries; i++) {
    if (offset + 46 > bytes.length || view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLen = view.getUint16(offset + 28, true);
    const extraLen = view.getUint16(offset + 30, true);
    const commentLen = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoderLatin1.decode(bytes.subarray(offset + 46, offset + 46 + nameLen));

    if (name === "word/document.xml") {
      target = { method, compressedSize, localOffset };
      break;
    }
    offset += 46 + nameLen + extraLen + commentLen;
  }

  if (!target) throw new Error("That DOCX has no document body — try saving it again from Word.");

  const lo = target.localOffset;
  if (view.getUint32(lo, true) !== 0x04034b50) throw new Error("That DOCX is damaged (bad local header).");
  const nameLen = view.getUint16(lo + 26, true);
  const extraLen = view.getUint16(lo + 28, true);
  const start = lo + 30 + nameLen + extraLen;
  let data = bytes.subarray(start, start + target.compressedSize);

  if (target.method === 8) {
    const inflated = await inflate(data, "deflate-raw");
    if (!inflated) throw new Error("That DOCX couldn't be decompressed.");
    data = inflated;
  } else if (target.method !== 0) {
    throw new Error("That DOCX uses an unsupported compression method.");
  }

  const xml = new TextDecoder().decode(data);
  const text = tidy(
    xml
      .replace(/<w:del[\s\S]*?<\/w:del>/g, "")
      .replace(/<w:tab[^>]*\/>/g, "\t")
      .replace(/<w:br[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<\/w:tr>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&amp;/g, "&")
  );

  if (text.length < 40) {
    throw new Error("That DOCX looks empty — no readable text was found.");
  }
  return text;
}

/* -------------------------------- public -------------------------------- */

export const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];

export async function extractResume(file) {
  const name = String(file.name || "").toLowerCase();
  const type = String(file.type || "");

  if (/\.(txt|md|text)$/.test(name) || type === "text/plain" || type === "text/markdown") {
    return { text: await file.text(), kind: "text" };
  }
  if (/\.doc$/.test(name)) {
    throw new Error("Legacy .doc files aren't supported — save as DOCX or PDF.");
  }
  if (/\.pdf$/.test(name) || type === "application/pdf") {
    const text = await pdfToText(await file.arrayBuffer());
    return { text, kind: "pdf" };
  }
  if (/\.docx$/.test(name) || type.includes("wordprocessingml") || type.includes("officedocument")) {
    const text = await docxToText(await file.arrayBuffer());
    return { text, kind: "docx" };
  }
  throw new Error("Unsupported file — use PDF, DOCX, TXT or MD.");
}
