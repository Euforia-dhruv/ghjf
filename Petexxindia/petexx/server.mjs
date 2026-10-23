import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp' };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
    let target = filePath;
    try {
      await stat(target);
    } catch {
      const publicTarget = join(root, 'public', pathname.slice(1));
      try {
        await stat(publicTarget);
        target = publicTarget;
      } catch {
        if (extname(pathname)) { res.writeHead(404); res.end('Not found'); return; }
        target = join(root, 'index.html');
      }
    }
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch (error) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Petexx preview listening on ${port}`));
