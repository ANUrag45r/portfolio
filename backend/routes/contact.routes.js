import { Router } from 'express';
import { validateContactBody } from '../middleware/validation.js';
import {
  createMessage,
  getMessages,
  deleteMessage,
  toggleRead,
  toggleReplied
} from '../controllers/contact.controller.js';

const router = Router();

// Public submission route
router.post('/', validateContactBody, createMessage);

// Admin dashboard routes
router.get('/', getMessages);
router.delete('/:id', deleteMessage);
router.patch('/:id/read', toggleRead);
router.patch('/:id/replied', toggleReplied);

export default router;
