const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session');

router.post('/create-session', sessionController.createSession);
router.get('/session/:sessionId', sessionController.getSession);

module.exports = router;
