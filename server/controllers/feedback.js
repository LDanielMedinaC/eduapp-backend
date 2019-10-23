'use strict'

const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail-accounts.json');
const ErrorFactory = require('../resources/errorFactory');

let forward = async (req, res) => {
    let feedback = req.body;

    let transporter = nodeMailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.port == 465,
        auth: mailConfig.auth
    });

    let timestamp = new Date().toString();
    let mailText = `${timestamp}\n${feedback.name} <${feedback.email}> said:\n${feedback.comment}`;
    let mailHTML = `
    <h1>EduApp website feedback</h1>
    <p>On ${timestamp}</p>
    <p>${feedback.name} <a href="mailto:${feedback.email}">&lt;${feedback.email}&gt;</a> said:</p>
    <p>${feedback.comment}</p>
    `;
    
    let mailOptions = {
        from: process.env.NODE_ENV === 'production' ? mailConfig.auth.user : `EduApp <noreply@eduapp.com>`,
        to: mailConfig.recipient,
        subject: 'Feedback from EduApp website user',
        text: mailText,
        html: mailHTML
    };

    try {
        let mailInfo = await transporter.sendMail(mailOptions);

        if(process.env.NODE_ENV !== 'production') {
            console.log(`Message sent: ${mailInfo.messageId}`);
            console.log(`Preview URL: ${nodeMailer.getTestMessageUrl(mailInfo)}`);
        }
    } catch(err) {
        let error = ErrorFactory.buildError(err);
        return res.status(error.status).send({ error: error });
    }

    return res.status(200).send({ msg: "Sent" });
}

module.exports = {
    forward
};
