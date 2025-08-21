import mongoose, { Schema } from 'mongoose';
import { Event } from '../../../domain/entities/Event';

const eventSchema = new Schema<Event>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  attendees: { type: Number, default: 0 },
  maxAttendees: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  judges: { type: [String], default: [] },
  food: { type: String, default: '' },
  guests: { type: [String], default: [] }
}, {
  timestamps: true 
});

export const EventModel = mongoose.model<Event>('Event', eventSchema);