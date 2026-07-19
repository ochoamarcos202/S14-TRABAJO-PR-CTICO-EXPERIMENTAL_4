const express = require('express');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');
const controller = require('../controllers/libroController');

const router = express.Router();

router.use(verificarToken);

router.get('/', controller.listarLibros);
router.get('/:id', controller.obtenerLibro);
router.post('/', verificarAdmin, controller.crearLibro);
router.put('/:id', verificarAdmin, controller.actualizarLibro);
router.delete('/:id', verificarAdmin, controller.eliminarLibro);

module.exports = router;
