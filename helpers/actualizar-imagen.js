require('dotenv').config();
const fs = require('fs');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Article = require('../models/article');
// const cloudinary = require('cloudinary').v2;

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



const actualizarImagen = async (tipo, id, nombreArchivo) => {

    switch (tipo) {

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }         
            
       

           if (usuario.img) {
            const nombreArr = usuario.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [ public_id ] = nombre.split('.');
         
            await  cloudinary.uploader.destroy( public_id);
         }

        // actualizarImagen(nombreArchivo, path);
            usuario.img = nombreArchivo;

            await usuario.save();  
          return true;

        break;

        case 'productos':
        const productos = await Producto.findById(id);
        if (!productos) {
            console.log('No es un productos por id');
            return false;
        }

         if (productos.img) {
         const nombreArr = productos.img.split('/');
         const nombre = nombreArr[nombreArr.length - 1];
         const [ public_id ] = nombre.split('.');   
         await  cloudinary.uploader.destroy( public_id);
      
      }

        productos.img = nombreArchivo;

        await productos.save();  
      return true;

        break;

        case 'categorias':
        const categorias = await Categoria.findById(id);
        if (!categorias) {
            console.log('No es una categoria por id');
            return false;
        }
      
     if (categorias.img) {
        const nombreArr = categorias.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];      
        const [public_id] = nombre.split('.');        
        await  cloudinary.uploader.destroy(public_id);     
     }

        categorias.img = nombreArchivo;
        await categorias.save();
      return true;        

        break;

        case 'articulos':

        const articulos = await Article.findById(id);
        if (!articulos) {
            console.log('No es un articulos por id');
            return false;
        }

       
        if (articulos.img) {
            const nombreArr = articulos.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [ public_id ] = nombre.split('.');
            await  cloudinary.uploader.destroy( public_id);
         }

        articulos.img = nombreArchivo;
        await articulos.save();
      return true;

        break;


        default:

        break;    
}

}


module.exports = {
    actualizarImagen,
   
}