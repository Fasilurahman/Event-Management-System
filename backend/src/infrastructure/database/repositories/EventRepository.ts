import mongoose from "mongoose";
import { Event } from "../../../domain/entities/Event";
import { IEventRepository } from "../../../domain/repositories/IEventRepository";
import { EventModel } from "../models/EventModel";
import { stripe } from "../../config/stripe";
import { User } from "../../../domain/entities/User";
import { UserModel } from "../models/UserModel";

export class EventRepository implements IEventRepository {
  async create(event: Event): Promise<Event> {
    const newEvent = new EventModel({
      ...event,
      _id: new mongoose.Types.ObjectId(event._id),
    });
    const savedEvent = await newEvent.save();

    return new Event(
      savedEvent._id,
      savedEvent.title,
      savedEvent.description,
      savedEvent.date,
      savedEvent.time,
      savedEvent.location,
      savedEvent.category,
      savedEvent.attendees,
      savedEvent.maxAttendees,
      savedEvent.price,
      savedEvent.status,
      savedEvent.judges,
      savedEvent.food,
      savedEvent.guests,
      savedEvent.createdAt,
      savedEvent.updatedAt
    );
  }

  async findById(id: mongoose.Types.ObjectId): Promise<Event | null> {
    const event = await EventModel.findById(id).exec();
    if (!event) return null;
    return new Event(
      event._id,
      event.title,
      event.description,
      event.date,
      event.time,
      event.location,
      event.category,
      event.attendees,
      event.maxAttendees,
      event.price,
      event.status,
      event.judges,
      event.food,
      event.guests,
      event.createdAt,
      event.updatedAt
    );
  }

  async findAll(): Promise<any[]> {
    const events = await EventModel.find().lean().exec();

    return events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees,
      price: event.price,
      status: event.status,
      judges: event.judges,
      food: event.food,
      guests: event.guests,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
  }

  async update(
    id: mongoose.Types.ObjectId,
    event: Partial<Event>
  ): Promise<Event | null> {
    const updatedEvent = await EventModel.findByIdAndUpdate(id, event, {
      new: true,
    });
    return updatedEvent ? (updatedEvent.toObject() as Event) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EventModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async createCheckoutSession(
    eventId: string,
    userId: string
  ): Promise<string> {
    const event = await EventModel.findById(eventId);
    if (!event) throw new Error("Event not found");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: event.title },
            unit_amount: event.price * 100, // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        eventId,
        userId,
      },
    });

    return session.id;
  }

  async incrementAttendees(
    eventId: mongoose.Types.ObjectId
  ): Promise<Event | null> {
    return EventModel.findByIdAndUpdate(
      eventId,
      { $inc: { attendees: 1 } },
      { new: true }
    ).exec();
  }


}
