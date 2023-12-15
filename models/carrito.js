const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true

    },

    cliente: {
        nombre: { type: String, required: true },
        tel : { type: String, required: true },
        email: { type: String, required: true },       
    },

    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
       
    },
    billingAddress : {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
      
    },
    order: [{
        cantidad: { type: Number, required: true },
        total: { type: Number, required: true },    
      
    }],

    orderItems: [{
        _id:  { type: String, required: true },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        img : { type: String, required: true },
        oferta : { type: Number, required: true },
      
    }],

    estado: {
        type: Boolean,
        default: false,
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }

    

    

});

// Sobreescribir el método toJSON

CarritoSchema.methods.toJSON = function () {
    const { __v, ...carrito } = this.toObject();
    return carrito;
}

module.exports = model('Carrito', CarritoSchema);
