import express from 'express';
import { container } from '../../infrastructure/inversify.config';
import { TYPES } from '../../constants/types';
import { EventController } from '../controllers/EventController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
const eventController = container.get<EventController>(TYPES.EventController);

router.post('/', (req, res, next) => eventController.create(req as any, res, next));
router.get('/', (req, res, next) => eventController.getAll(req, res, next));
router.put('/:id', (req, res, next) => eventController.update(req, res, next));
router.delete('/:id', (req, res, next) => eventController.delete(req, res, next));
router.post("/create-checkout-session", authMiddleware(['attendee']), (req, res, next) => eventController.createCheckoutSession(req, res, next));
router.post("/webhook", (req, res, next) => eventController.stripeWebhook(req, res, next));

export default router;