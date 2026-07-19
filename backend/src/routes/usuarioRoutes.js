const express = require('express');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');
const controller = require('../controllers/usuarioController');

const router = express.Router();

router.post('/', controller.crearUsuario);
router.get('/', verificarToken, verificarAdmin, controller.listarUsuarios);
router.get('/:id', verificarToken, verificarAdmin, controller.obtenerUsuario);
router.put('/:id', verificarToken, verificarAdmin, controller.actualizarUsuario);
router.delete('/:id', verificarToken, verificarAdmin, controller.eliminarUsuario);

module.exports = router;
