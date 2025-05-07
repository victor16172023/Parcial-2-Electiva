/**
 * Simple Express server for receiving contact form submissions and sending emails using Nodemailer.
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Allow CORS for all origins - adjust for production environment!
app.use(express.json());

// Replace the following SMTP settings with valid credentials
// For example, Gmail SMTP (enable less secure app access or use OAuth2)
const transporter = nodemailer.createTransport({
  host: 'smtp.your-email-provider.com', // e.g. smtp.gmail.com
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // your email
    pass: 'your-email-password'     // your email password or app password
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    return;
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'your-email@example.com', // your receiving email
    subject: `Contacto desde web: ${subject}`,
    text: `Nombre: ${name}\nCorreo: ${email}\nAsunto: ${subject}\nMensaje:\n${message}`,
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ success: false, message: 'Error enviando correo.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

