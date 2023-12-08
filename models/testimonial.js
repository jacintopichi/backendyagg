const { Schema, model } = require('mongoose');

const TestimonialSchema = Schema({

    mensaje: {
        type: String,
        required: [true, 'El contenido es obligatorio']
    },
    date: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }, 
 
});

TestimonialSchema.methods.toJSON = function() {
    const { __v, ...testimonial } = this.toObject();
    return testimonial;
}


module.exports = model('Testimonial', TestimonialSchema);


