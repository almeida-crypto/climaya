// Servidor estático mínimo (sin dependencias) para correr la app en http://localhost:5173
// Uso: node server.js   (el puerto se puede cambiar con la variable de entorno PORT)

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  // Evita que se pidan archivos fuera de la carpeta del proyecto (ej. /../../secreto).
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Prohibido");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("No encontrado");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`ClimaYa corriendo en http://localhost:${PORT}`);
});
