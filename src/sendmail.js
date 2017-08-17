'use strict';
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = function(message) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'rxxxxon@gmail.com',
      pass: process.env.GMAIL_PASS
    },
    debug: true
  });

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error:sendMail');
      console.log(error.message);
      return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    transporter.close();
  });
};
