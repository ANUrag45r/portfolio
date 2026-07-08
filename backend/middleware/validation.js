import { validateContactMessage } from '../validators/contact.validator.js';

export const validateContactBody = (req, res, next) => {
  const { isValid, errors } = validateContactMessage(req.body);
  if (!isValid) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};
