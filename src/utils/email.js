// File: src/utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const criarTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const enviarEmailResetSenha = async (emailDestino, token) => {
  const transporter = criarTransporter();
  const link = `http://localhost:3000/resetar-senha.html?token=${token}`;
  
  return transporter.sendMail({
    from: `"Sistema Jurídico" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: 'Redefinição de Senha',
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p><a href="${link}">Clique aqui para redefinir sua senha</a></p>
    `
  });
};

module.exports = { 
  enviarEmailResetSenha, 
  criarTransporter 
};
