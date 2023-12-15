const { response } = require('express');
const Carrito = require('../models/carrito');

const getCarritos = async(req, res) => {
    
        const desde = Number(req.query.desde) || 0;
    
        await Promise.all([
            Carrito.countDocuments(),
            Carrito.find({}, 'cliente shippingAddress  order orderItems billingAddress estado dateOrdered')
            .populate('usuario', 'nombre email img')
            // .populate('productos', 'nombre img precio')
            .skip(desde)
            .limit(10)
    
        ])
        .then(respuestas => {
    
            res.json({
                ok: true,
                carritos: respuestas[1],
                total: respuestas[0]
            });
    
        });
    
    }   

const crearCarrito = async(req, res = response) => {    
        const carrito = new Carrito({
            usuario: req.uid,
            ...req.body
        });
    
        try {
            const carritoDB = await carrito.save();    
    
                res.json({
                    ok: true,
                    carrito: carritoDB
                });  
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    
    }

const actualizarCarrito = async(req, res = response) => {
        const uid = req.params.id;
    
        try {
    
            const carritoDB = await Carrito.findById(uid);
    
            if (!carritoDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un carrito con ese id'
                });
            }
    
            // Actualizaciones
            const { usuario, ...campos } = req.body;
    
            if (carritoDB.usuario.toString() !== req.uid) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de editar este carrito'
                });
            }
    
            const carritoActualizado = await Carrito.findByIdAndUpdate(uid, campos, { new: true });
    
            res.json({
                ok: true,
                carrito: carritoActualizado
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
    
    }


const borrarCarrito = async(req, res = response) => {
        const uid = req.params.id;
    
        try {
    
            const carritoDB = await Carrito.findById(uid);
    
            if (!carritoDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un carrito con ese id'
                });
            }
    
            if (carritoDB.usuario.toString() !== req.uid) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de eliminar este carrito'
                });
            }
    
            await Carrito.findByIdAndDelete(uid);
    
            res.json({
                ok: true,
                msg: 'Carrito eliminado de la base de datos'
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
    
    }

module.exports = {
    getCarritos,
    crearCarrito,
    actualizarCarrito,
    borrarCarrito
}
