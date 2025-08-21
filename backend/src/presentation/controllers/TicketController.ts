import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../constants/types";
import { GetTicketsByUserUseCase } from "../../application/usecases/ticket/GetTicketsByUserUseCase";
import { VerifyTicketUseCase } from "../../application/usecases/ticket/VerifyTicketUseCaset";
import { GetLatestTicketUseCase } from "../../application/usecases/ticket/GetLatestTicketUseCase";
import { TicketUseCase } from "../../application/usecases/ticket/TicketUseCase";
import { GetAllTicketsUseCase } from "../../application/usecases/ticket/GetAllTicketsUseCase";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { STATUS_CODES } from "../../shared/constants/statusCodes";
import { MESSAGES } from "../../shared/constants/ResponseMessages";
import mongoose from "mongoose";

@injectable()
export class TicketController {
  constructor(
    @inject(TYPES.GetTicketsByUserUseCase) private getTicketsByUserUseCase: GetTicketsByUserUseCase,
    @inject(TYPES.VerifyTicketUseCase) private verifyTicketUseCase: VerifyTicketUseCase,
    @inject(TYPES.GetLatestTicketUseCase) private getLatestTicketUseCase: GetLatestTicketUseCase,
    @inject(TYPES.TicketUseCase) private ticketUseCase: TicketUseCase,
    @inject(TYPES.GetAllTicketsUseCase) private getAllTicketsUseCase: GetAllTicketsUseCase
  ) {}

  async getUserTickets(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tickets = await this.getTicketsByUserUseCase.execute(
        new mongoose.Types.ObjectId(req.user!.userId)
      );
      res.status(STATUS_CODES.OK).json({ success: true, tickets });
    } catch (error) {
      next(error);
    }
  }

  async verifyTicket(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(req.params.ticketId, 'req.params.ticketId');
      const ticket = await this.verifyTicketUseCase.execute(req.params.ticketId);
      if (!ticket) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: MESSAGES.TICKET.NOT_FOUND });
      }
      console.log(ticket, 'ticket');
      res.status(STATUS_CODES.OK).json({ success: true, ticket });
    } catch (error) {
      next(error);
    }
  }

  async getLatestTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const ticket = await this.getLatestTicketUseCase.execute(userId);

      if (!ticket) {
        return res.status(404).json({ success: false, message: "No ticket found" });
      }

      return res.status(200).json({ success: true, ticket });
    } catch (error) {
      next(error);
    }
  }

async getTicketsWithEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId; // coming from authMiddleware
    console.log(userId, 'userId');
    const tickets = await this.ticketUseCase.getTicketsWithEvent(userId);
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
}


  async getAllTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await this.getAllTicketsUseCase.execute();
      console.log(tickets, '12345678909');
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }
}