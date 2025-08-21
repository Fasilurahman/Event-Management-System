import { inject, injectable } from 'inversify';
import { TYPES } from '../../../constants/types';
import { Ticket } from '../../../domain/entities/Ticket';
import { ITicketRepository } from '../../../domain/repositories/ITicketRepository';

@injectable()
export class VerifyTicketUseCase {
  constructor(
    @inject(TYPES.ITicketRepository) private ticketRepository: ITicketRepository
  ) {}

  async execute(ticketId: string): Promise<Ticket | null> {
    return this.ticketRepository.findByTicketId(ticketId);
  }
}