import mongoose from "mongoose";
import Stripe from "stripe";
import QRCode from "qrcode";
import { IEventRepository } from "../../../domain/repositories/IEventRepository";
import { ITicketRepository } from "../../../domain/repositories/ITicketRepository"
import { inject, injectable } from "inversify";
import { TYPES } from "../../../constants/types";

@injectable()
export class HandleStripeWebhookUseCase {
  constructor(
    @inject(TYPES.IEventRepository) private eventRepository: IEventRepository,
    @inject(TYPES.ITicketRepository) private ticketRepository: ITicketRepository
    
  ) {}

  async execute(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Checkout session completed");
        const session = event.data.object as Stripe.Checkout.Session;
        const eventId = session.metadata?.eventId;
        const userId = session.metadata?.userId;

        if (eventId && userId) {
          // 1️⃣ Increment attendees count
          await this.eventRepository.incrementAttendees(
            new mongoose.Types.ObjectId(eventId)
          );

          // 2️⃣ Generate QR code (contains ticketId or unique info)
          const ticketId = new mongoose.Types.ObjectId().toString();
          const qrCodeDataUrl = await QRCode.toDataURL(
            JSON.stringify({ ticketId, eventId, userId })
          );

          // 3️⃣ Create a ticket record in DB
          await this.ticketRepository.create({
            _id: new mongoose.Types.ObjectId(),
            ticketId,
            eventId: new mongoose.Types.ObjectId(eventId),
            userId: new mongoose.Types.ObjectId(userId),
            status: "booked",
            purchaseDate: new Date(),
            qrCode: qrCodeDataUrl,
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
