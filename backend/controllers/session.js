const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

exports.createSession = async (req, res) => {
    const sessionId = uuidv4().slice(0, 6);
    const session = new Session({ sessionId, offers: [] });
    await session.save();
    res.json({ sessionId });
};

exports.getSession = async (req, res) => {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
};
