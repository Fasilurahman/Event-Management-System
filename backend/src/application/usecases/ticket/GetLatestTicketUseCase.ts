import { ITicketRepository } from "../../../domain/repositories/ITicketRepository";
import mongoose from "mongoose";
import { Ticket } from "../../../domain/entities/Ticket";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

@injectable()
export class GetLatestTicketUseCase {
    constructor(
      @inject(TYPES.ITicketRepository) private ticketRepository: ITicketRepository
    ) {}

  async execute(userId: string): Promise<Ticket | null> {
    return this.ticketRepository.getLatestTicketByUser(new mongoose.Types.ObjectId(userId));
  }
}
