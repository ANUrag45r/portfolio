import ContactMessage from '../models/ContactMessage.js';
import nodemailer from 'nodemailer';

export const saveAndNotify = async (messageData, clientInfo) => {
  const { name, email, message } = messageData;
  const { ipAddress, userAgent } = clientInfo;

  // 1. Save to MongoDB Atlas
  const contactMsg = new ContactMessage({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    ipAddress,
    userAgent
  });
  await contactMsg.save();

  // 2. Try sending email notification (Non-blocking: if email fails, message is still saved)
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailTo = process.env.EMAIL_TO || 'nitiananurag20@gmail.com';

  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: `"${name}" <${emailUser}>`,
        replyTo: email.trim(),
        to: emailTo,
        subject: `[Portfolio Contact] New Message from ${name.trim()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; padding: 20px; color: #333;">
            <h2 style="color: #2a5cdb; border-bottom: 2px solid #2a5cdb; padding-bottom: 8px; margin-top: 0;">Portfolio Message Received</h2>
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
            <p><strong>Message:</strong></p>
            <blockquote style="margin: 15px 0; padding: 12px; background-color: #f7f9fc; border-left: 4px solid #2a5cdb; font-style: italic; white-space: pre-wrap;">
              ${message.trim()}
            </blockquote>
            <p style="font-size: 11.5px; color: #777;"><strong>IP Address:</strong> ${ipAddress || 'unknown'}</p>
            <p style="font-size: 11.5px; color: #777;"><strong>User Agent:</strong> ${userAgent || 'unknown'}</p>
            <p style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
              Sent from your online developer portfolio system.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Nodemailer sent contact message from ${name} to ${emailTo}`);
    } catch (err) {
      console.error('Nodemailer SMTP dispatch error:', err.message);
    }
  } else {
    // Zero-config FormSubmit.co fallback if SMTP details are missing
    try {
      console.log('SMTP credentials unconfigured. Dispatched via FormSubmit.co API...');
      await fetch(`https://formsubmit.co/ajax/${emailTo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          ipAddress,
          userAgent,
          _subject: `[Portfolio Contact] New Message from ${name.trim()}`
        })
      });
      console.log('FormSubmit.co backup dispatch completed.');
    } catch (err) {
      console.error('FormSubmit.co fallback dispatch error:', err.message);
    }
  }

  return contactMsg;
};
