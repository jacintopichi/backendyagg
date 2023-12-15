const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getProductos,
     crearProducto,
      actualizarProducto,
       borrarProducto ,
        getProductosById,
        actualizarLinkProducto,
        getProductosByCategoria,
        actualizarEstadoProducto} = require('../controllers/productos');



const router = Router();


router.get('/', getProductos);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es incorrecta').isMongoId(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    check('talla', 'talla debe ser un número').isNumeric(),
    check('oferta', 'oferta debe ser un número').isNumeric(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('tags', 'tags es obligatorio').not().isEmpty(),
    check('linkdepago', 'El link de pago es obligatorio'),
    validarcampos
], crearProducto);


router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es incorrecta').isMongoId(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    check('talla', 'talla debe ser un número').isNumeric(),
    check('oferta', 'oferta debe ser un número').isNumeric(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('tags', 'tags es obligatorio').not().isEmpty(),
    check('linkdepago', 'El link de pago es obligatorio'),
    validarcampos
], actualizarProducto);

router.put('/link/:id', validarJWT, actualizarLinkProducto);
router.put('/estado/:id', validarJWT, actualizarEstadoProducto);




router.delete('/:id', validarJWT, borrarProducto);


router.get('/:id',  getProductosById);


router.get('/categoria/:categoria',  getProductosByCategoria);



module.exports = router;
