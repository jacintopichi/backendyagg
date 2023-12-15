const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    }   

});

// Sobreescribir el método toJSON

CarritoSchema.methods.toJSON = function() {
    const { __v, ...carrito } = this.toObject();
    return carrito;
}

module.exports = model( 'Carrito', CarritoSchema );