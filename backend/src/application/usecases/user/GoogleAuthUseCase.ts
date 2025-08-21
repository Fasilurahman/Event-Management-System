import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import mongoose from "mongoose";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";


@injectable()
export class GoogleAuthUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepo: IUserRepository
    ) {}

  async execute(idToken: string): Promise<{ token: string; user: User }> {
    const googleUser = await this.userRepo.verifyToken(idToken);
    console.log(googleUser,'google userrrrrrrr')
    // Find or create user
    let user = await this.userRepo.findByEmail(googleUser.email);
    if (!user) {
      const newUserEntity = new User(
        new mongoose.Types.ObjectId(),
        googleUser.email,
        googleUser.name,
        "attendee",
        null,
        googleUser.googleId,
        new Date(),
        new Date()
      );

      user = await this.userRepo.create(newUserEntity);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return { token, user };
  }
}
