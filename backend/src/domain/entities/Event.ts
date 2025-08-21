
import mongoose from 'mongoose';

export class Event {
  constructor(
    public _id: mongoose.Types.ObjectId,
    public title: string,
    public description: string,
    public date: Date,
    public time: string, 
    public location: string,
    public category: string, 
    public attendees: number, 
    public maxAttendees: number,
    public price: number,
      public status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled', 
    public judges: string[],
    public food: string, 
    public guests: string[], 
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
