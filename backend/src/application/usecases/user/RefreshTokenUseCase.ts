import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import mongoose from "mongoose";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "supersecretkey";


@injectable()
export class RefreshTokenUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {}

  async execute(refreshToken: string | undefined): Promise<string> {
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    let decoded: { userId: string; role: string };
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string; role: string };
    } catch (err) {
      throw new Error("Invalid or expired refresh token");
    }

    // Find the user
    const user: User | null = await this.userRepository.findById(new mongoose.Types.ObjectId(decoded.userId));
    if (!user) {
      throw new Error("User not found");
    }

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return newAccessToken;
  }
}
