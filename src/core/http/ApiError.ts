/**
 * An operational (expected) error. Services throw it; the error middleware turns
 * it into a consistent error envelope. Anything that isn't an ApiError is
 * treated as an unexpected 500.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly errors: Record<string, string>;
  readonly isOperational = true;

  constructor(
    statusCode: number,
    message: string,
    errors: Record<string, string> = {},
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = 'Bad request', errors?: Record<string, string>) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static unprocessable(message = 'Validation failed', errors: Record<string, string> = {}) {
    return new ApiError(422, message, errors);
  }
}
