import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { registerRestaurant, ownerDashboard, addItem, updateItem, deleteItem, ownerReviews } from '../controllers/ownerController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.post('/owner/restaurant/register', auth, requireRole('OWNER'), asyncHandler(registerRestaurant));
router.get('/owner/restaurant', auth, requireRole('OWNER'), asyncHandler(ownerDashboard));
router.post('/owner/items/add', auth, requireRole('OWNER'), asyncHandler(addItem));
router.put('/owner/items/:itemId', auth, requireRole('OWNER'), asyncHandler(updateItem));
router.delete('/owner/items/:itemId', auth, requireRole('OWNER'), asyncHandler(deleteItem));
router.get('/owner/reviews', auth, requireRole('OWNER'), asyncHandler(ownerReviews));
export default router;
