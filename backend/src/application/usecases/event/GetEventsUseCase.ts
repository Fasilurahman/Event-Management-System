import { inject, injectable } from 'inversify';
import { TYPES } from '../../../constants/types';
import { Event } from '../../../domain/entities/Event';
import { IEventRepository } from '../../../domain/repositories/IEventRepository';

@injectable()
export class GetEventsUseCase {
    constructor(
        @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
    ) {}

  async execute(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}