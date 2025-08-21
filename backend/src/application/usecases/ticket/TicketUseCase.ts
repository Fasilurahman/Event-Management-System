import { inject, injectable } from "inversify";
import { TYPES } from "../../../constants/types";
import { ITicketRepository } from "../../../domain/repositories/ITicketRepository";
import mongoose from "mongoose";

@injectable()
export class TicketUseCase {
  constructor(
    @inject(TYPES.ITicketRepository) private ticketRepository: ITicketRepository
  ) {}

  async getTicketsWithEvent(userId:  mongoose.Types.ObjectId) {
    return this.ticketRepository.findTicketsWithEvent(userId);
  }
}
