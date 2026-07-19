const express = require('express');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');
const controller = require('../controllers/solicitudController');

const router = express.Router();

router.use(verificarToken);

router.get('/', controller.listarSolicitudes);
router.post('/', controller.crearSolicitud);
router.patch('/:id/revisar', verificarAdmin, controller.revisarSolicitud);
router.patch('/:id/devolver', controller.devolverLibro);

module.exports = router;
