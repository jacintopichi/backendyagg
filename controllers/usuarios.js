
const Usuario = require('../models/usuario');
const { response } = require('express');

const bcrypt = require('bcryptjs');
const { generarJWT,validarJWT  } = require('../helpers/jwt');
const { sendEmailLink,sendEmailLinkResetpassword  } = require('../helpers/send-email');



const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;  
    await Promise.all([
        Usuario.countDocuments(),
        Usuario.find({}, 'nombre email rol google img')
            .skip( desde )
            .limit( 6 )
    ])
    .then( respuestas => {    
        res.json({
            ok: true,
            usuarios: respuestas[1],
            total: respuestas[0]
        });
    });   
}



const getUsuario = async(req, res = response) => {  
    const id = req.params.id;
    try {
        const usuario = await Usuario.findById( id )                             
        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        res.json({
            ok: true,
            usuario: usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
     }
}
   

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;
    const usuario = new Usuario(req.body);
    
        try {
            const existeEmail = await Usuario.findOne({ email: email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
            msg: 'El correo ya está registrado'
                });
            }
            // Encriptar contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);            
            await usuario.save();

            // Enviar correo de bienvenida

            const sent = await sendEmailLink( email );
            if ( !sent ) {
                return res.status(500).json({
                    ok: false,
                    msg: 'No se pudo enviar el correo de verificación'
                });
            }
            // Generar el TOKEN - JWT
            const token = await generarJWT( usuario.id );
            res.json({
                ok: true,
                usuario: usuario,
                token: token
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado... revisar logs'
            });
        }
}

const actualizarUsuario = async (req, res = response) => {  
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        // Actualizaciones
        const {password,  google, email, ...campos } = req.body;        
        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }                                 
        campos.email = email;
        campos.new = true;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );  
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}


// reset password

const resetPassword = async (req, res = response) => {
    const { email } = req.body;
try {
  const usuarioDB = await Usuario.findOne({ email: email });
  if ( !usuarioDB ) {
      return res.status(404).json({
          ok: false,
          msg: 'No existe un usuario por ese email'
      });
  }

  const token = await generarJWT( usuarioDB.id );
  const sent = await sendEmailLinkResetpassword( email, token );
  const usuario = await Usuario.findByIdAndUpdate( usuarioDB.id, { resetPassword: true }, { new: true } );   

  if ( !sent ) {
      return res.status(500).json({
          ok: false,
          msg: 'No se pudo enviar el correo de verificación'
      });
  }

  res.json({
      ok: true,
      msg: 'Se ha enviado un correo electrónico para restablecer la contraseña',
      sent: sent,
      usuario: usuario,
  });

} catch (error) {

  console.log(error);
  res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
  });     

}
}


const resetPasswordConfirm = async (req = request, res = response) => {
    const uid = req.params.id;
    const { password } = req.body; 

    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        // Actualizaciones
        const {password} = req.body;
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, { password: passwordHash, resetPassword: false }, { new: true } );

        res.json({
            ok: true,
            msg: 'Password actualizado',
            usuario: usuarioActualizado
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error,
            error: error
        })
   }    
 
}


const borrarUsuario = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }          
        const usuarioDesactivado = await Usuario.findByIdAndUpdate( uid, { estado: false }, { new: true } );          
            // await Usuario.findByIdAndDelete( uid );        
        res.json({
            ok: true,
            msg: 'Usuario desactivado',
            usuario:usuarioDesactivado
        });
    } catch (error) {
         console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const activarUsuario = async(req, res = response ) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }          
        const usuarioActivado = await Usuario.findByIdAndUpdate( uid, { estado: true }, { new: true } );          
            // await Usuario.findByIdAndDelete( uid );        
        res.json({
            ok: true,
            msg: 'Usuario activado',
            usuario:usuarioActivado
        });
    } catch (error) {
         console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


    const validateEmail = async(req, res = response ) => { 
        const { token } = req.params;     

        const emailValidado = await validarJWT( token)
        if ( !emailValidado ) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido'
            });
        }

        const email = emailValidado[1];     

        try {
            const usuarioDB = await Usuario.findOne({ email: email });
            if ( !usuarioDB ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario por ese email'
                });
            }
            const usuarioActualizado = await Usuario.findByIdAndUpdate( usuarioDB.id, { emailVerified: true }, { new: true } );

           
            res.json({
                ok: true,
                msg: 'Usuario validado',
                usuario: usuarioActualizado,
                token: token
              
                
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }  
       
    }
   



module.exports = {
    getUsuarios,
    getUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    activarUsuario,
    validateEmail,
    resetPassword,
    resetPasswordConfirm
   
}
