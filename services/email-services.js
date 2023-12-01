const nodemailer = require('nodemailer');
const { Transporter } = require('nodemailer');
require('dotenv').config();





class EmailService {
    transporter = Transporter;

    constructor(
    ) {
        this.transporter = nodemailer.createTransport({
            service: process.env.MAILER_SERVICE,
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_SECRET_KEY,
            }
        });
    }


    async sendEmail(to, subject, htmlBody, attachements = []) {

        try {
            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements,
            });        

            return true;
        } catch (error) {
            return false;
        }

    }
}

module.exports = EmailService;