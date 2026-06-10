/* Custom server: Next.js + Socket.io on one port (3000), tunnel-friendly. */
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, { path: '/socket' });
  io.on('connection', (socket) => {
    socket.on('join', (eventId) => {
      if (typeof eventId === 'string') socket.join('event:' + eventId);
    });
  });

  // API route handlers run in this same process; they broadcast through this.
  global.__io = io;

  server.listen(port, () => {
    console.log(`KaraokeHero's ready on http://localhost:${port}`);
  });
});
