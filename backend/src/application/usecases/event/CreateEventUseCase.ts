import { z } from 'zod';
import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { Event } from '../../../domain/entities/Event';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';
import { TYPES } from '../../../constants/types';

const CreateEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.union([z.string().date(), z.string().datetime()]), 
  time: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  maxAttendees: z.preprocess((val) => Number(val), z.number().positive()),
  price: z.preprocess((val) => Number(val), z.number().nonnegative()),
  judges: z.array(z.string()).optional().default([]),
  food: z.string().optional().default(""),
  guests: z.array(z.string()).optional().default([]),
});

@injectable()
export class CreateEventUseCase {
    constructor(
      @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
    ) {}

  async execute(data: unknown): Promise<Event> {
    const validated = CreateEventSchema.parse(data);
    const event = new Event(
      new mongoose.Types.ObjectId(),      
      validated.title,                    
      validated.description,              
      new Date(validated.date),          
      validated.time,                     
      validated.location,                 
      validated.category,                 
      0,                                 
      validated.maxAttendees,             
      validated.price,                             
      'upcoming',                         
      validated.judges,                   
      validated.food,                     
      validated.guests,                   
      new Date(),                         
      new Date()                         
    );
    return this.eventRepository.create(event);
  }
}