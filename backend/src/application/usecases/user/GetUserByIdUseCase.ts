import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { User } from "../../../domain/entities/User";
import mongoose from "mongoose";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";


@injectable()
export class GetUserByIdUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: mongoose.Types.ObjectId): Promise<Pick<User, "name" | "email"> | null> {
    return this.userRepository.findById(id);
  }
}
