const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    oferta: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true

    },
    descripcion: {
        type: String
    },
    tags: [{
        type: String
    }],

    talla: {
        type: Number,
    },

    linkdepago: {
        type: String
    },

    disponible: {
        type: Boolean,
        default: true
    },

    img: {
        type: String
    },
    img1: {
        type: String
    },

});

// Sobreescribir el método toJSON

ProductoSchema.methods.toJSON = function() {
    const { __v,  ...producto } = this.toObject();
    return producto;
}

module.exports = model('Producto', ProductoSchema);

// Path: routes\productos.js