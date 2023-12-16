
const Producto = require('../models/producto');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');

const getProductos = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    await Promise.all([
        Producto.countDocuments(),
        Producto.find().populate('usuario', 'nombre img telefono')
            .populate('categoria', 'nombre img')
            .skip(desde)
            .limit(12)
    ])
        .then(respuestas => {
            res.json({
                ok: true,
                productos: respuestas[1],
                total: respuestas[0]
            });
        });
}



const getProductosById = async (req, res) => {
    const id = req.params.id;

    try {
        await Promise.all([
            Producto.countDocuments(),
            Producto.findById(id)
                .populate('usuario', 'nombre img telefono')
                .populate('categoria', 'nombre img')
        ])
            .then(respuestas => {
                res.json({
                    ok: true,
                    productos: respuestas[1],
                });
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error: error
        });
    }
}


const crearProducto = async (req, res = response) => {
    const producto = new Producto({
        usuario: req.uid,
        ...req.body
    });
    try {
        const existeProducto = await Producto.findOne({ nombre: producto.nombre });
        if (existeProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya está registrado, ingrese otro nombre'
            });
        }
        const productoDB = await producto.save();
        res.json({
            ok: true,
            producto: productoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}

const actualizarProducto = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const productoDB = await Producto.findById(uid);
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una producto con ese id'
            });
        }

        // Actualizaciones

        const { nombre, ...campos } = req.body;
        if (productoDB.nombre !== nombre) {
            const existeProducto = await Producto.findOne({ nombre });
            if (existeProducto) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe una producto con ese nombre'
                });
            }
        }

        campos.nombre = nombre;

        const productoActualizado = await Producto.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            producto: productoActualizado
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const actualizarLinkProducto = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const productoDB = await Producto.findById(uid);
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una producto con ese id'
            });
        }

        // Actualizaciones

        const { linkdepago, ...campos } = req.body;

        if (linkdepago == '') {
            campos.linkdepago = linkdepago;
            const productoActualizado = await Producto.findByIdAndUpdate(uid, campos, { new: true });
            return res.json({
                ok: true,
                producto: productoActualizado
            });

        }

        campos.linkdepago = linkdepago;

        const productoActualizado = await Producto.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            producto: productoActualizado
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const actualizarEstadoProducto = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const productoDB = await Producto.findById(uid);
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una producto con ese id'
            });
        }

        // Actualizaciones

        const { estado, ...campos } = req.body;

        campos.estado = estado;

        const productoActualizado = await Producto.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            producto: productoActualizado
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarProducto = async (req, res = response) => {

    const uid = req.params.id;
    try {
        const productoDB = await Producto.findById(uid);
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una producto con ese id'
            });
        }

        await Producto.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'producto eliminado de la base de datos'
        });

    }

    catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        });

    }

}

const getProductosByCategoria = async (req, res = response) => {
    const categoria = req.params.categoria;
    const desde = Number(req.query.desde) || 0;
    try {
        const [productos, total] = await Promise.all([
            Producto.find({ categoria }).populate('usuario', 'nombre img telefono')
                .populate('categoria', 'nombre img')
                .skip(desde)
                .limit(12),
            Producto.countDocuments({ categoria })
        ]);
        res.json({
            ok: true,
            productos,
            total
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }

}



module.exports = {
    getProductos,
    crearProducto,
    actualizarProducto,
    borrarProducto,
    getProductosById,
    actualizarLinkProducto,
    getProductosByCategoria,
    actualizarEstadoProducto
}
// Compare this snippet from routes\productos.js: