import mongoose, { Schema } from 'mongoose';
import { Ticket } from '../../../domain/entities/Ticket';

const ticketSchema = new Schema<Ticket>({
  ticketId: { type: String, required: true, unique: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event" }, 
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ['booked', 'used'], default: 'booked' },
  purchaseDate: { type: Date, default: Date.now },
  qrCode: { type: String, required: true, unique: true },
});


ticketSchema.index({ ticketId: 1 });

export const TicketModel = mongoose.model<Ticket>('Ticket', ticketSchema);