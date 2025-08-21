import express from 'express';
import { container } from '../../infrastructure/inversify.config';
import { TYPES } from '../../constants/types';
import { TicketController } from '../controllers/TicketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
const ticketController = container.get<TicketController>(TYPES.TicketController);

router.get('/user', authMiddleware(['attendee']), (req, res, next) => ticketController.getUserTickets(req as any, res, next));
router.get('/verify/:ticketId',  (req, res, next) => ticketController.verifyTicket(req as any, res, next));
router.get("/latest", authMiddleware(["attendee"]), (req, res, next) => ticketController.getLatestTicket(req as any, res, next));
router.get("/details", authMiddleware(["attendee"]), (req, res, next) => ticketController.getTicketsWithEvent(req, res, next));
router.get("/all", (req, res, next) => ticketController.getAllTickets(req, res, next));


export default router;