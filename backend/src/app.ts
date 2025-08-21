import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './presentation/routes/userRoutes';
import eventRoutes from './presentation/routes/eventRoutes';
import ticketRoutes from './presentation/routes/ticketRoutes';
import { authMiddleware } from './presentation/middlewares/authMiddleware';
import { connectDB } from './infrastructure/config/db';
import { errorMiddleware } from './presentation/middlewares/errorMiddleware';
import { EventController } from './presentation/controllers/EventController'; // adjust import
import { container } from './infrastructure/inversify.config';
import { TYPES } from './constants/types';

dotenv.config();
connectDB();

const app: Application = express();

app.use(cors({
  origin: "http://localhost:5173",   
  credentials: true,   
  allowedHeaders: ['Content-Type', 'Authorization']              
}));

app.use(morgan('dev'));

const eventController = container.get<EventController>(TYPES.EventController);
app.post(
  "/api/events/webhook",
  express.raw({ type: "application/json" }),
  eventController.stripeWebhook.bind(eventController)
);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(errorMiddleware);

export default app;
