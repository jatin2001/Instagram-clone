const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const { SENDEREMAIL, PASSWORD } = require('./key');
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: SENDEREMAIL,
        pass: PASSWORD
    }
}));



module.exports = function sendEmail(from, to, subject, html) {

    var mailOptions = {
        from,
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.json({ Error: err });
        } else {
            console.log('Email sent');

        }
    });

}
