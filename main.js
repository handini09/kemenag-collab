const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readdir(path.join(__dirname, "core"), (err, files) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal server error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<ul>");
      files.forEach((file) => {
        res.write(`<li><a href="/core/${file}">${file}</a></li>`);
      });
      res.write("</ul>");
      res.end();
    });
  } else if (req.url.startsWith("/core/")) {
    // Serve HTML files from the core directory
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
