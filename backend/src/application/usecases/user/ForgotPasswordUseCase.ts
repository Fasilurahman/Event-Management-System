import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppError";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../infrastructure/services/EmailService";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError("User not found", 404);

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || "supersecretkey", 
      { expiresIn: "30m" }
    );


    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = "Reset your password";

    const message = `
        <p>Hello ${user.name},</p>
        <p>Click the button below to reset your password. This link is valid for 30 minutes.</p>
        <a href="${resetLink}" 
            style="
            display:inline-block;
            padding:10px 20px;
            font-size:16px;
            color:white;
            background-color:#14b8a6;
            text-decoration:none;
            border-radius:5px;
            ">
            Reset Password
        </a>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        `;

    await sendEmail(email, subject, message);

    return { message: "Password reset link sent successfully" };
  }

  static verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        email: string;
      };
      return decoded.email;
    } catch (err) {
      return null;
    }
  }
}
