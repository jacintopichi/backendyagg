const { generarJWTemail } = require('./jwt');
require('dotenv').config();
const EmailService = require('../services/email-services');



const sendEmailLink = async (email) => {

    const sendEmail = new EmailService();
    const token = await generarJWTemail(email);
    if (!token) {
        return false;
    }

    //  const urlfront = `${process.env.URL_FRONTEND2}/user-actived/${token}`;


    const url = `${process.env.URL_FRONTEND}/validate-email/validate/${token}`;

    const urlfront = `https://www.cielitoazul.com.ar/user-actived/${token}`;

    const htmlBody = `
        <h1>Correo de verificación</h1>
        <h2>¡Hola!</h2> 
        <p>Gracias por registrarte en nuestra plataforma.</p>
        <p> somos cielito lindo, una plataforma donde puedes encontrar los mejores productos para niños y niñas.</p>
        <p>Para poder acceder a tu cuenta, por favor, confirma tu correo electrónico haciendo click en el siguiente enlace:</p>      
        <a href="${urlfront}">Confirmar correo</a>
    `;
    const subject = 'Correo de verificación';
    const to = email;

    const sent = await sendEmail.sendEmail(to, subject, htmlBody);
    if (!sent) {
        return false;
    }
    return sent;
}



const sendEmailLinkResetpassword = async (email) => {

    const sendEmail = new EmailService();
    const token = await generarJWTemail(email);
    if (!token) {
        return false;
    }

     const url = `${ process.env.URL_FRONTEND }/auth/reset-password/${ token }`;

   //   const urlfront = `${process.env.URL_FRONTEND2}/user-resetpassword/${token}`;

    const urlfront = `https://www.cielitoazul.com.ar/user-resetpassword/${token}`;

    const htmlBody = `
        <h1>Correo de reset password</h1>
        <h2>¡Hola!</h2> 
        <p>Has solicitado un cambio de contraseña.</p>
        <p> somos cielito lindo, una plataforma donde puedes encontrar los mejores productos para niños y niñas.</p>
        <p>Para poder acceder a tu cuenta, por favor, confirma tu correo electrónico haciendo click en el siguiente enlace:</p>      
        <a href="${urlfront}">Resetea Password</a>
    `;
    const subject = 'Correo de reseteo de password';
    const to = email;

    const sent = await sendEmail.sendEmail(to, subject, htmlBody);
    if (!sent) {
        return false;
    }
    return sent;
}



module.exports = {
    sendEmailLink,
    sendEmailLinkResetpassword
}


