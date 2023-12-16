const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getTestimonials,createTestimonial, deleteTestimonial, updateTestimonial } = require('../controllers/testimonial');


const router = Router();

router.get('/', getTestimonials);

router.post('/', [
    validarJWT,
    check('mensaje', 'El contenido es obligatorio').not().isEmpty(),
    validarcampos
], createTestimonial );


router.delete('/:iduser', validarJWT, deleteTestimonial );

router.put('/:id', [
    validarJWT,
    check('mensaje', 'El contenido es obligatorio').not().isEmpty(),
    validarcampos
], updateTestimonial );



module.exports = router;