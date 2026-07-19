const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authorization = req.headers.authorization;
  const [tipo, token] = authorization ? authorization.split(' ') : [];

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;
