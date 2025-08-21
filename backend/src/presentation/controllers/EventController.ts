import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { CreateEventUseCase } from "../../application/usecases/event/CreateEventUseCase";
import { GetEventsUseCase } from "../../application/usecases/event/GetEventsUseCase";
import { UpdateEventUseCase } from "../../application/usecases/event/UpdateEventUseCase";
import { DeleteEventUseCase } from "../../application/usecases/event/DeleteEventUseCase";
import { CreateCheckoutSessionUseCase } from "../../application/usecases/event/CreateCheckoutSessionUseCase";
import { HandleStripeWebhookUseCase } from "../../application/usecases/event/HandleStripeWebhookUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { STATUS_CODES } from "../../shared/constants/statusCodes";
import { MESSAGES } from "../../shared/constants/ResponseMessages";
import { stripe } from "../../infrastructure/config/stripe";
import { TYPES } from "../../constants/types";

@injectable()
export class EventController {
  constructor(
    @inject(TYPES.CreateEventUseCase) private createEventUseCase: CreateEventUseCase,
    @inject(TYPES.GetEventsUseCase) private getEventsUseCase: GetEventsUseCase,
    @inject(TYPES.UpdateEventUseCase) private updateEventUseCase: UpdateEventUseCase,
    @inject(TYPES.DeleteEventUseCase) private deleteEventUseCase: DeleteEventUseCase,
    @inject(TYPES.CreateCheckoutSessionUseCase) private createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
    @inject(TYPES.HandleStripeWebhookUseCase) private handleStripeWebhookUseCase: HandleStripeWebhookUseCase
  ) {}

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      console.log("Creating event with data:", req.body);
      const event = await this.createEventUseCase.execute(req.body);
      res
        .status(STATUS_CODES.CREATED)
        .json({ success: true, message: MESSAGES.EVENT.CREATED, event });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.getEventsUseCase.execute();
      console.log("Events:", events);
      res.status(STATUS_CODES.OK).json({ success: true, events });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      console.log("Updating event with ID:", id, "and data:", eventData);
      const updatedEvent = await this.updateEventUseCase.execute(id, eventData);

      return res.status(200).json({
        success: true,
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id;
      const result = await this.deleteEventUseCase.execute(eventId);

      return res
        .status(200)
        .json({ success: true, message: "Event deleted successfully", result });
    } catch (error) {
      next(error);
    }
  }

  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.body;
      console.log(req.body, 'reqqqqbody');
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        throw new Error("User ID is required");
      }
      console.log(
        "Creating checkout session for event ID:",
        eventId,
        "and user ID:",
        userId
      );
      const sessionId = await this.createCheckoutSessionUseCase.execute(
        eventId,
        userId
      );
      console.log("Checkout session ID:", sessionId);
      res.status(200).json({ success: true, sessionId });
    } catch (error) {
      next(error);
    }
  }

  async stripeWebhook(req: Request, res: Response, next: NextFunction) {
    console.log("Stripe webhook received");
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log(event, "1234567");
      await this.handleStripeWebhookUseCase.execute(event);
      res.status(STATUS_CODES.OK).json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook processing failed:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
      next(error);
    }
  }
}