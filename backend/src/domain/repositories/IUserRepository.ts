import mongoose from 'mongoose';
import { User } from '../entities/User';


export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  findById(id: mongoose.Types.ObjectId): Promise<User | null>;
  verifyToken(idToken: string): Promise<any>;
  updatePassword(userId: mongoose.Types.ObjectId, hashedPassword: string): Promise<User | null>;
  updateBlockStatus(userId: mongoose.Types.ObjectId, isBlocked: boolean): Promise<User | null>;
}