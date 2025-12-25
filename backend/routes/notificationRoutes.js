import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getNotifications, markRead } from '../controllers/notificationController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/notifications', auth, asyncHandler(getNotifications));
router.put('/notifications/:id/read', auth, asyncHandler(markRead));
export default router;
