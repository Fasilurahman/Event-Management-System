import { inject, injectable } from "inversify";
import { TYPES } from "../../../constants/types";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { getUserDetailsByEmail, removeOtp, verifyOtp } from "../../../infrastructure/services/OtpStore";
import { AppError } from "../../../shared/AppError";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


@injectable()
export class VerifyOtpUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {}

  async execute(email: string, otp: string): Promise<User> {
    const isValid = verifyOtp(email, otp);
    if (!isValid) throw new AppError('Invalid or expired OTP', 400);

    const userDetails = getUserDetailsByEmail(email);
    if (!userDetails) throw new AppError('No user details found', 400);

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    const user = new User(
      new mongoose.Types.ObjectId(),
      userDetails.email,
      userDetails.name,
      'attendee',
      hashedPassword,
      undefined,
      new Date(),
      new Date(),
      false 
    );

    const savedUser = await this.userRepository.create(user);

    removeOtp(email); 
    return savedUser;
  }
}
