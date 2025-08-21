import mongoose from "mongoose";

export class Ticket {
  constructor(
    public _id: mongoose.Types.ObjectId,
    public ticketId: string, 
    public eventId: mongoose.Types.ObjectId, 
    public userId: mongoose.Types.ObjectId, 
    public status: 'booked' | 'used' ,
    public purchaseDate: Date,
    public qrCode: string 
  ) {}
}