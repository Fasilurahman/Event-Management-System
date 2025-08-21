export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function createError(message: string, statusCode: number) {
  return new AppError(message, statusCode);
}