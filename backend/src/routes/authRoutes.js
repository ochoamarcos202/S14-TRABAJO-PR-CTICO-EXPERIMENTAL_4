const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middlewares/verificarToken');
const { login, me } = require('../controllers/authController');

const router = express.Router();
router.post('/login', login);
router.get('/me', verificarToken, me);

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ mensaje: 'OAuth de Google no está configurado' });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'], session: true })(req, res, next);
});

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth`
}), (req, res) => {
  const token = jwt.sign(
    { id: req.user._id.toString(), email: req.user.email, rol: req.user.rol, nombre: req.user.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  const destino = process.env.CLIENT_URL || 'http://localhost:5173';
  return res.redirect(`${destino}/oauth/callback?token=${encodeURIComponent(token)}`);
});

module.exports = router;
