import express from 'express';
import { container } from '../../infrastructure/inversify.config';
import { TYPES } from '../../constants/types';
import { UserController } from '../controllers/UserController';

const router = express.Router();
const userController = container.get<UserController>(TYPES.UserController);

router.patch("/:id/toggle-status", (req, res, next) => userController.toggleUserStatus(req, res, next));
router.post('/register', (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.post("/google", (req, res, next) => userController.googleLogin(req, res, next));
router.post('/verify-otp', (req, res, next) => userController.verifyOtp(req, res, next));
router.post('/resend-otp', (req, res, next) => userController.resendOtp(req, res, next));
router.post("/reset-password", (req, res, next) => userController.resetPassword(req, res, next));
router.post("/forgot-password", (req, res, next) => userController.forgotPassword(req, res, next));
router.get("/user-list", (req, res, next) => userController.getAllUsers(req, res, next));
router.post('/refresh', (req, res, next) => userController.refresh(req, res, next));
router.get('/:id', (req, res, next) => userController.getUserById(req, res, next));

export default router;