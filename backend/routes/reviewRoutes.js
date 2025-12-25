import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { addReview, getRestaurantReviews } from '../controllers/reviewController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.post('/reviews/add', auth, requireRole('USER'), asyncHandler(addReview));
router.get('/restaurants/:restaurantId/reviews', asyncHandler(getRestaurantReviews));
export default router;
