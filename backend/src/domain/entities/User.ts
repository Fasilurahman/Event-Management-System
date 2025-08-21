import mongoose from "mongoose";

export class User {
  constructor(
    public _id: mongoose.Types.ObjectId,
    public email: string,
    public name: string,
    public role: 'admin' | 'attendee' = 'attendee',
    public password: string | null = null,
    public googleId?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public isBlocked: boolean = false 
  ) {}
}
