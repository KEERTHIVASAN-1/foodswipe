import { Router } from 'express';
import { registerUser, loginUser, registerOwner, loginOwner, loginAdmin } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.post('/user/register', asyncHandler(registerUser));
router.post('/user/login', asyncHandler(loginUser));
router.post('/owner/register', asyncHandler(registerOwner));
router.post('/owner/login', asyncHandler(loginOwner));
router.post('/admin/login', asyncHandler(loginAdmin));
export default router;
