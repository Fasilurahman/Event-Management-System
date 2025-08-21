// application/usecases/GetAllTicketsUseCase.ts
import { ITicketRepository } from "../../../domain/repositories/ITicketRepository";
import { Ticket } from "../../../domain/entities/Ticket";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllTicketsUseCase {
    constructor(
    @inject(TYPES.ITicketRepository) private ticketRepository: ITicketRepository
  ) {}

  async execute(): Promise<Ticket[]> {
    return await this.ticketRepository.getAllTickets();
  }
}
