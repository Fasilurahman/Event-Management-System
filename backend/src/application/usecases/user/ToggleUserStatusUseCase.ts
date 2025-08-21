import { inject, injectable } from "inversify";
import { TYPES } from "../../../constants/types";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import mongoose from "mongoose";

@injectable()
export class ToggleUserStatusUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {}

  async execute(userId: mongoose.Types.ObjectId) {
    const user = await this.userRepository.findById(new mongoose.Types.ObjectId(userId));
    if (!user) throw new Error("User not found");

    const newStatus = user.isBlocked ? false : true;
    const updatedUser = await this.userRepository.updateBlockStatus(userId, newStatus);
    return updatedUser;
  }
}
