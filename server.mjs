// Minimal static file server for CVSense. No dependencies, Node 18+.
// Usage: npm start   (or: node server.mjs, PORT=4000 node server.mjs)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const rootPrefix = root.endsWith(sep) ? root : root + sep;

const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    let target = normalize(join(root, relative));

    if (target !== root && !target.startsWith(rootPrefix)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    const info = await stat(target).catch(() => null);
    if (info?.isDirectory()) target = join(target, "index.html");

    const body = await readFile(target);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(target).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try another one, e.g.  PORT=3001 npm start`);
  } else if (err.code === "EACCES") {
    console.error(`Not allowed to listen on port ${port}. Try a port above 1024, e.g.  PORT=3001 npm start`);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`CVSense is running:  http://localhost:${port}`);
  if (host === "0.0.0.0") console.log(`On this network:      http://<your-ip>:${port}`);
  console.log("Press Ctrl+C to stop.");
});
