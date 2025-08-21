import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretkey';

@injectable()
export class LoginUserUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {}

  async execute(data: unknown): Promise<{ user: User; token: string; refreshToken: string }> {
    const validated = LoginUserSchema.parse(data);

    const user = await this.userRepository.findByEmail(validated.email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      validated.password,
      user.password ?? ""
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Access token (short-lived)
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Optionally save refreshToken in DB if you want to invalidate later
    

    return { user, token, refreshToken };
  }
}
