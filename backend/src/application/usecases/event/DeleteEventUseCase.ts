import { inject, injectable } from "inversify";
import { TYPES } from "../../../constants/types";
import { IEventRepository } from "../../../domain/repositories/IEventRepository";

@injectable()
export class DeleteEventUseCase {
      constructor(
        @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
      ) {}

  async execute(eventId: string) {
    return await this.eventRepository.delete(eventId);
  }
}
