import { z } from "zod";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppError";
import { storeUserDetailsWithOTP } from "../../../infrastructure/services/OtpStore";
import { sendEmail } from "../../../infrastructure/services/EmailService";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});


@injectable()
export class RegisterUserUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {}

  async execute(data: unknown) {
    try {
      const validated = RegisterUserSchema.parse(data);
      const existingUser = await this.userRepository.findByEmail(
        validated.email
      );
      console.log("Existing user:", existingUser);
      if (existingUser) throw new Error("User already exists");

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(`Generated OTP for ${validated.email}: ${otp}`);

      storeUserDetailsWithOTP(validated.email, otp, {
        name: validated.name,
        email: validated.email,
        password: validated.password,
      });

      // Send OTP email
      const subject = "Your OTP for Registration";
      const message = `Hello ${validated.name},\n\nYour OTP is: ${otp}\nIt is valid for 5 minutes.\n\nThank you!`;
      await sendEmail(validated.email, subject, message);

      return { message: "OTP sent successfully" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(error.message, 400);
      }
      throw new AppError("Unknown error", 400);
    }
  }
}
