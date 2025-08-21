import mongoose from 'mongoose';
import { Ticket } from '../../../domain/entities/Ticket';
import { ITicketRepository } from '../../../domain/repositories/ITicketRepository';
import { TicketModel } from '../models/TicketModel';

export class TicketRepository implements ITicketRepository {
  async create(ticket: Ticket): Promise<Ticket> {
    const newTicket = await TicketModel.create(ticket);
    const savedTicket = await newTicket.save();
    return new Ticket(
      savedTicket._id,
      savedTicket.ticketId,
      savedTicket.eventId,
      savedTicket.userId,
      savedTicket.status,
      savedTicket.purchaseDate,
      savedTicket.qrCode
    );
  }

  async findByUserId(userId: mongoose.Types.ObjectId): Promise<Ticket[]> {
    const tickets = await TicketModel.find({ userId }).populate('eventId').exec();
    return tickets.map(
      (ticket) =>
        new Ticket(
          ticket._id,
          ticket.ticketId,
          ticket.eventId,
          ticket.userId,
          ticket.status,
          ticket.purchaseDate,
          ticket.qrCode
        )
    );
  }

  async findByEventId(eventId: mongoose.Types.ObjectId): Promise<Ticket[]> {
    const tickets = await TicketModel.find({ eventId }).populate('userId').exec();
    return tickets.map(
      (ticket) =>
        new Ticket(
          ticket._id,
          ticket.ticketId,
          ticket.eventId,
          ticket.userId,
          ticket.status,
          ticket.purchaseDate,
          ticket.qrCode
        )
    );
  }

  async findByTicketId(ticketId: string): Promise<Ticket | null> {
    const ticket = await TicketModel.findOne({ ticketId }).populate('eventId userId').exec();
    if (!ticket) return null;
    return new Ticket(
      ticket._id,
      ticket.ticketId,
      ticket.eventId,
      ticket.userId,
      ticket.status,
      ticket.purchaseDate,
      ticket.qrCode
    );
  }

  async getLatestTicketByUser(userId: mongoose.Types.ObjectId): Promise<Ticket | null> {
    return TicketModel.findOne({ userId }).sort({ purchaseDate: -1 }).exec();
  }

async findTicketsWithEvent(userId:  mongoose.Types.ObjectId): Promise<any[]> {
  return await TicketModel.find({ userId })
    .populate("eventId");
}


  async getAllTickets(): Promise<Ticket[]> {
    return await TicketModel.find()
      .populate("eventId")  
      .populate("userId"); 
  }
}