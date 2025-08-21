import mongoose from 'mongoose';
import { Ticket } from '../entities/Ticket';

export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findByUserId(userId: mongoose.Types.ObjectId): Promise<Ticket[]>;
  findByEventId(eventId: mongoose.Types.ObjectId): Promise<Ticket[]>;
  findByTicketId(ticketId: string): Promise<Ticket | null>;
  getLatestTicketByUser(userId: mongoose.Types.ObjectId): Promise<Ticket | null>;
  findTicketsWithEvent(userId: mongoose.Types.ObjectId): Promise<any[]>;
  getAllTickets(): Promise<Ticket[]>;
}