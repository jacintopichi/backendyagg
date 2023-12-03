// uploadFile  getImagen
require('dotenv').config();
const { response } = require('express');

const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

// const cloudinary = require('cloudinary').v2

// cloudinary.config(process.env.CLOUDINARY_URL);

const cloudinary = require('cloudinary');

// cloudinary.v2.config({
//   cloud_name: 'dsl9jlm1g',
//   api_key: '295136155185325',
//   api_secret: 'gCKmK3Xp-onwh44t9tNbQcMOy0c',
//   secure: true,
// });

cloudinary.v2.config({
    cloud_name: 'dt48zm2v5',
    api_key: '246122593166633',
    api_secret: 'xN_LMmYnB_crY5DTtRugveYQXlQ',
    secure: true,
  });




const uploadFileCloud = async(req, res = response) => {
    const { tipo, id } = req.params; 

    // Validar tipo
    const tiposValidos = ['productos', 'usuarios', 'categorias','articulos'];   

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            msg: 'No es un tipo valido'
        })
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No hay ningun archivo cargado'
        })
    }
 
   try {

        
   const {tempFilePath} = req.files.imagen
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath 
         , {folder: 'prueba'}
        );

    const nombreArchivo = secure_url;
    actualizarImagen(tipo, id,nombreArchivo);
    res.json({
        msg: 'Archivo subido correctamente',
        nombreArchivo
    })

    
   }    catch (error) {      
        console.log(error);
        res.status(500).json({
            msg: 'Error al subir la imagen',
            error
        })
    }
}


const mostrarImagen = async(req, res = response) => {

    const { tipo, foto } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

   // Imagen por defecto 
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);

    }

}




     


module.exports = {

    mostrarImagen,
    uploadFileCloud
 
}
