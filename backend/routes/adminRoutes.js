import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { listRestaurants, getRestaurantAdmin, approveRestaurant, rejectRestaurant, deleteRestaurant, deleteItemAdmin } from '../controllers/adminController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/admin/restaurants', auth, requireRole('ADMIN'), asyncHandler(listRestaurants));
router.get('/admin/restaurants/:restaurantId', auth, requireRole('ADMIN'), asyncHandler(getRestaurantAdmin));
router.put('/admin/restaurants/:restaurantId/approve', auth, requireRole('ADMIN'), asyncHandler(approveRestaurant));
router.put('/admin/restaurants/:restaurantId/reject', auth, requireRole('ADMIN'), asyncHandler(rejectRestaurant));
router.delete('/admin/restaurants/:restaurantId', auth, requireRole('ADMIN'), asyncHandler(deleteRestaurant));
router.delete('/admin/items/:itemId', auth, requireRole('ADMIN'), asyncHandler(deleteItemAdmin));
export default router;
