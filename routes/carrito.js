const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const {   getCarritos, crearCarrito, actualizarCarrito, borrarCarrito } = require('../controllers/carrito');




const router = Router();

router.get('/', getCarritos);

router.post('/',  validarJWT,  crearCarrito);


router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarcampos
], actualizarCarrito);

router.delete('/:id', validarJWT, borrarCarrito);








module.exports = router;

