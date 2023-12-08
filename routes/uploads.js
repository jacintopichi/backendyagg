// ruta:  api/uploads/


const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jws');
const { mostrarImagen,uploadFileCloud,uploadFileCloudImagen1 } = require('../controllers/uploads');

const expressFileUpload = require('express-fileupload');
const fileUpload = require('express-fileupload');

const router = Router();

router.use(expressFileUpload( 
    { useTempFiles: true }
));



//router.put('/:tipo/:id', validarJWT, uploadFile);

router.put('/:tipo/:id', validarJWT, uploadFileCloud);

router.put('/imagen1/:tipo/:id', validarJWT, uploadFileCloudImagen1);

router.get('/:tipo/:foto',  mostrarImagen);


module.exports = router;

// Compare this snippet from controllers\busquedas.js: