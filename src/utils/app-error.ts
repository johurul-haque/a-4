export class AppError extends Error {
  status: number;

  constructor(status: number, name: string, message: string) {
    super(message);
    this.status = status;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}
