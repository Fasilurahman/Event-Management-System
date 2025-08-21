import mongoose from 'mongoose';
import { Event } from '../entities/Event';

export interface IEventRepository {
  create(event: Event): Promise<Event>;
  findById(id: mongoose.Types.ObjectId): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  delete(id: string): Promise<boolean>;
  update(id: mongoose.Types.ObjectId, event: Partial<Event>): Promise<Event | null>;
  incrementAttendees(eventId: mongoose.Types.ObjectId): Promise<Event | null>;
  createCheckoutSession(eventId: string, userId: string): Promise<string>;
}