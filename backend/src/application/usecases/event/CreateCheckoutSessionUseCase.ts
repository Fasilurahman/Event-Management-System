import { inject, injectable } from "inversify";
import { TYPES } from "../../../constants/types";
import { IEventRepository } from "../../../domain/repositories/IEventRepository";

@injectable()
export class CreateCheckoutSessionUseCase {
      constructor(
        @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
      ) {}

  async execute(eventId: string, userId: string): Promise<string> {
    return await this.eventRepository.createCheckoutSession(eventId, userId);
  }
}