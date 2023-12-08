const { response } = require('express');
const Testimonial = require('../models/testimonial');

const Usuario = require('../models/usuario');

const getTestimonials = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    
    await Promise.all([
        Testimonial.countDocuments(),
        Testimonial.find().populate('usuario', 'nombre email img')                  
                  
            .skip( desde )
            .limit( 10 )
    ])
    .then( respuestas => {

        res.json({
            ok: true,
            testimonials: respuestas[1],
            total: respuestas[0]
        });

    });
}

const createTestimonial = async(req, res = response) => {    
    const testimonial = new Testimonial({
        usuario: req.uid,      
        ...req.body
    });

    try {
        const testimonialDB = await testimonial.save();   
            
        res.json({
                ok: true,
                testimonial: testimonialDB
            });  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}






const deleteTestimonial = async(req, res = response) => {
    const id = req.params.id; 
    try {
        const testimonialdb = await Testimonial.findById( id );

        if ( !testimonialdb ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un testimonial con ese id'
            });
        }

        await Testimonial.findByIdAndDelete( id );
        res.json({
            ok: true,
            msg: 'Testimonial eliminado'
        });

    }   catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar testimonial'
        });
    }
}


      
    
  


const updateTestimonial = async(req, res = response) => {

    const id = req.params.id; 
    const uid = req.uid;

    try {
        const testimonialdb = await Testimonial.findById( id );

        if ( !testimonialdb ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un testimonial con ese id'
            });
        }

        const cambiosTestimonial = {
            ...req.body,
            usuario: uid
        }

        const testimonialActualizado = await Testimonial.findByIdAndUpdate( id, cambiosTestimonial, { new: true } );

        res.json({
            ok: true,
            testimonial: testimonialActualizado
        });
        
    }   catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar testimonial'
        });
    }
   

}


module.exports = {
    getTestimonials,
    createTestimonial,
    deleteTestimonial,
    updateTestimonial
}


