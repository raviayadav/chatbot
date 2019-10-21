const express = require('express');
const router = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

// const auth = {
//     type: 'oauth2',
//     user: process.env.GMAIL_ID,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//     accessToken: process.env.ACCESS_TOKEN,
//     expires: process.env.EXPIRES_IN
// };

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_AUTH
    }
});
const middleFunc = (req, res, next) => {
    console.log('middlewar called');
    const mailOptions = {
        from: 'Ravi Yadav <raviyadavwebdev@gmail.com>',
        to: req.body.email,
        subject: `Regarding your message on the Ravi's website`,
        text: 'Thanks for contacting me. I have received your message. I will revert as soon as possible.'
    };
    console.log('mail options in the middleware', mailOptions);
    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('successfully reached hereeee in the middelware end');
            next();
        }
    })
}
// router.get('/', , (req, res) => res.send('test succesful'));
router.post('/',middleFunc, (req, res) => {
    console.log(req.body);
    const mailOptions = {
        from: 'Ravi Yadav <raviyadavwebdev@gmail.com>',
        to: process.env.GMAIL_TO,
        subject: '',
        text: ''
    };
    // mailOptions.from = 'raviyadavwebdev@gmail.com';
    // mailOptions.to = process.env.GMAIL_TO;
    mailOptions.subject = 'From your portfolio website';
    mailOptions.text = `${req.body.subject} by ${req.body.email}`;
    // console.log('mailoptions', mailOptions);
    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            console.log(err);
            return res.status(400).send(err);
        } else {
            console.log(data);
            return res.status(200).send({message: 'mail went through succesfully'})
        }
    })
    // res.send({text: 'woohooo succesfull'});
});
module.exports = router;