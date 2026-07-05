const nodemailer = require('nodemailer');
const { smtp } = require('../config/env');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!smtp.host || !smtp.user) {
    console.warn('⚠️  SMTP not configured — emails will be logged to console');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  const mailOptions = {
    from: smtp.from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  if (!transport) {
    console.log('📧 Email (dev):', { to, subject });
    return { messageId: 'dev-mode' };
  }

  return transport.sendMail(mailOptions);
};

const otpEmailTemplate = (otp, type) => ({
  subject: type === 'register' ? 'Verify your TurfBook account' : 'Reset your TurfBook password',
  html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:16px">
      <h2 style="color:#22c55e;margin:0 0 8px">TurfBook</h2>
      <p style="color:#94a3b8;margin:0 0 24px">Your verification code</p>
      <div style="font-size:36px;font-weight:700;letter-spacing:8px;text-align:center;padding:24px;background:#1e293b;border-radius:12px;color:#22c55e">${otp}</div>
      <p style="color:#64748b;font-size:13px;margin-top:24px;text-align:center">Valid for 10 minutes. Do not share this code.</p>
    </div>
  `,
});

const bookingConfirmationTemplate = (booking, turf) => ({
  subject: `Booking Confirmed — ${turf.name}`,
  html: `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:16px">
      <h2 style="color:#22c55e">Booking Confirmed ✓</h2>
      <p><strong>${turf.name}</strong></p>
      <p>Date: ${new Date(booking.bookingDate).toLocaleDateString('en-IN')}</p>
      <p>Time: ${booking.startTime} – ${booking.endTime}</p>
      <p>Amount: ₹${booking.totalAmount}</p>
      <p>Invoice: ${booking.invoiceNumber}</p>
    </div>
  `,
});

module.exports = { sendEmail, otpEmailTemplate, bookingConfirmationTemplate };
