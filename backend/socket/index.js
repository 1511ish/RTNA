const Session = require('../models/Session');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-session', ({ sessionId, username }) => {
      socket.join(sessionId);
      socket.to(sessionId).emit('user-joined', { username });
    });

    socket.on('new-offer', async ({ sessionId, amount, from }) => {
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const offer = { amount, from, status: 'pending' };
      session.offers.push(offer);
      await session.save();
      io.to(sessionId).emit('offer-received', offer);
    });

    socket.on('accept-offer', async ({ sessionId, amount, from }) => {
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const offer = session.offers.find(o => o.amount === amount && o.status === 'pending');
      if (offer) {
        offer.status = 'accepted';
        session.ended = true;
        await session.save();
        io.to(sessionId).emit('offer-accepted', { amount, from });
        io.to(sessionId).emit('session-ended', { amount, from });
      }
    });

    socket.on('decline-offer', async ({ sessionId, amount, from }) => {
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const offer = session.offers.find(o => o.amount === amount && o.status === 'pending');
      if (offer) {
        offer.status = 'declined';
        await session.save();
        io.to(sessionId).emit('offer-declined', { amount, from });
      }
    });
  });
};
