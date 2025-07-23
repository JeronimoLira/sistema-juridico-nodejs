// 📄 services/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

exports.sendResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"Suporte" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Redefinição de senha',
    html: `<p>Você solicitou a redefinição de senha. Clique no link abaixo:</p>
           <a href="${link}">Redefinir Senha</a>`,
  });
};
