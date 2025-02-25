// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Serve index.html when root is requested
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    // Add more routes for other files as needed
    else if (req.url.endsWith('.js')) {
        fs.readFile(path.join(__dirname, req.url), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }
    else if (req.url.endsWith('.css')) {
        fs.readFile(path.join(__dirname, req.url), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
