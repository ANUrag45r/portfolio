import { Router } from 'express';
import { pool } from '../config/db.js';
import nodemailer from 'nodemailer';

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/contact - visitor sends a message, stored in MySQL & emailed to admin
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message is too long.' });
  }

  let dbSaved = false;
  let emailSent = false;
  let dbError = null;
  let emailError = null;

  // Channel 1: Save to MySQL database
  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim(), message.trim()]
    );
    dbSaved = true;
  } catch (err) {
    dbError = err;
    console.error('MySQL database save error:', err);
  }

  // Channel 2: Send Email via Gmail SMTP or FormSubmit.co public fallback
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
        from: `"${name}" <${emailUser}>`, // Must be from authenticated user on Gmail
        replyTo: email.trim(), // Reply directly to the sender
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
            <p style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px;">
              Sent from your online developer portfolio system.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (err) {
      emailError = err;
      console.error('Nodemailer SMTP dispatch error:', err);
    }
  } else {
    // Fallback: Dispatch via FormSubmit.co ajax endpoint (zero-config public relay)
    try {
      console.log('SMTP credentials unconfigured. Dispatched via FormSubmit.co API...');
      const response = await fetch(`https://formsubmit.co/ajax/${emailTo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `[Portfolio Contact] New Message from ${name.trim()}`
        })
      });
      
      const formSubmitData = await response.json();
      if (response.ok && (formSubmitData.success === 'true' || formSubmitData.success === true)) {
        emailSent = true;
        console.log('FormSubmit.co dispatch successful.');
      } else {
        throw new Error(formSubmitData.message || 'FormSubmit API error');
      }
    } catch (err) {
      emailError = err;
      console.error('FormSubmit.co dispatch error:', err);
    }
  }

  // Success reporting
  if (dbSaved || emailSent) {
    let statusMsg = 'Thank you! Your message has been received.';
    if (dbSaved && !emailSent) {
      statusMsg = 'Message saved locally, but email dispatch failed.';
    } else if (!dbSaved && emailSent) {
      statusMsg = 'Message successfully dispatched to Gmail.';
    }
    return res.status(201).json({ success: true, message: statusMsg });
  } else {
    // Both failed
    return res.status(500).json({ 
      error: 'Message delivery failed. Please check backend config or MySQL status.',
      details: `Database: ${dbError?.message || 'offline'}. Email: ${emailError?.message || 'failed'}`
    });
  }
});

// GET /api/contact - list messages (for Anurag's own admin use)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

export default router;
