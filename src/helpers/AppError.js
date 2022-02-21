export default class AppError extends Error {
  constructor(msg, statusCode) {
    super(msg);

    this.statusCode = statusCode;
    this.status = `${this.status}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
