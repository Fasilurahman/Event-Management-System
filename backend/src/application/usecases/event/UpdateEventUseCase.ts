import mongoose from "mongoose";
import { Event } from "../../../domain/entities/Event";
import { IEventRepository } from "../../../domain/repositories/IEventRepository";
import { TYPES } from "../../../constants/types";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateEventUseCase {
    constructor(
      @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
    ) {}

  async execute(id: string, eventData: Partial<Event>): Promise<Event | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Event ID");
    }

    const updatedEvent = await this.eventRepository.update(
      new mongoose.Types.ObjectId(id),
      eventData
    );

    if (!updatedEvent) {
      throw new Error("Event not found or could not be updated");
    }

    return updatedEvent;
  }
}
