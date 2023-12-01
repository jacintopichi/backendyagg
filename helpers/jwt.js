const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = {
            uid,
        };    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, ( err, token ) => {
    
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
    
        });

    });

}


const generarJWTemail = ( email ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = {
            email,
        };    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '2h'
        }, ( err, token ) => {
    
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
    
        });
    });
}


const validarJWT = (token) => {
    try {        
        const { email } = jwt.verify( token, process.env.JWT_SECRET );        

        return [true, email];

    } catch (error) {
        return [false, null];
    } 
}


module.exports = {
    generarJWT,
    generarJWTemail,
    validarJWT
}
