import mongoose, { Schema } from 'mongoose';
import { User } from '../../../domain/entities/User';

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false }, 
  role: { type: String, enum: ['admin', 'attendee'], required: true },
  isBlocked: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


userSchema.index({ email: 1 });

export const UserModel = mongoose.model<User>('User', userSchema);