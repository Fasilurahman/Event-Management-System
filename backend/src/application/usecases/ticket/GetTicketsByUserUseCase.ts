import mongoose from 'mongoose';
import { Ticket } from '../../../domain/entities/Ticket';
import { ITicketRepository } from '../../../domain/repositories/ITicketRepository';
import { TYPES } from '../../../constants/types';
import { inject, injectable } from 'inversify';

@injectable()
export class GetTicketsByUserUseCase {
    constructor(
      @inject(TYPES.ITicketRepository) private ticketRepository: ITicketRepository
    ) {}

  async execute(userId: mongoose.Types.ObjectId): Promise<Ticket[]> {
    return this.ticketRepository.findByUserId(userId);
  }
}