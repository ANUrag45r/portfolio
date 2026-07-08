import { saveAndNotify } from '../services/contact.service.js';
import ContactMessage from '../models/ContactMessage.js';

export const createMessage = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await saveAndNotify(req.body, { ipAddress, userAgent });

    return res.status(201).json({
      success: true,
      message: 'Message saved successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    return res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const toggleRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await ContactMessage.findById(id);
    if (!msg) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    msg.isRead = !msg.isRead;
    await msg.save();
    return res.json({ success: true, message: `Message marked as ${msg.isRead ? 'read' : 'unread'}`, isRead: msg.isRead });
  } catch (err) {
    next(err);
  }
};

export const toggleReplied = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await ContactMessage.findById(id);
    if (!msg) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    msg.replySent = !msg.replySent;
    await msg.save();
    return res.json({ success: true, message: `Message marked as ${msg.replySent ? 'replied' : 'unreplied'}`, replySent: msg.replySent });
  } catch (err) {
    next(err);
  }
};
