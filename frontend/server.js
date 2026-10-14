const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Cloud-Native Blogging Platform</h1><p>Frontend is running!</p>');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Frontend running on port 3000');
});
