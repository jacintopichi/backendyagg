const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true

    },

    cliente: {
      
       
    },

    shippingAddress: {
       
    },
    billingAddress : {
      
    },
    order: {
      
    },

    orderItems: [{
      
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
