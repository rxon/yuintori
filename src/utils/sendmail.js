'use strict';
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = function(message) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'rxxxxon@gmail.com',
      pass: process.env.GMAIL_PASS,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN
    }
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
