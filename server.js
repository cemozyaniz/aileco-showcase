const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');

// Force use of local next to avoid cPanel's broken global version
const next = require(path.join(__dirname, 'node_modules', 'next'));

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log('> Ready on production port');
  });
});
