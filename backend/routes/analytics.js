import express from 'express';
import { logVisit, logPage, logEvent, logSessionEnd } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/visit', logVisit);
router.post('/page', logPage);
router.post('/event', logEvent);
router.post('/session/end', logSessionEnd);

export default router;
