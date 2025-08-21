import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../../infrastructure/logging/logger";
import { AppError } from "../../shared/AppError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";
import { MESSAGES } from "../../shared/constants/ResponseMessages";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.SERVER.INTERNAL_SERVER_ERROR;

  // 🛠 Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.error("Validation error", {
      errors: err.errors,
      method: req.method,
      url: req.originalUrl,
    });

    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      type: "ValidationError",
      message: MESSAGES.VALIDATION.VALIDATION_ERROR,
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        issue: e.message,
      })),
    });
  }

  // 🛠 Handle custom AppError
  if (err instanceof AppError) {
    logger.error(`AppError: ${message}`, {
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
    });

    return res.status(statusCode).json({
      success: false,
      type: "AppError",
      message,
    });
  }

  // 🛠 Handle unexpected errors
  logger.error(`Unexpected error: ${message}`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    type: "ServerError",
    message: MESSAGES.SERVER.INTERNAL_SERVER_ERROR,
  });
};
