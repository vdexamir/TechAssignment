import { ApiError } from "./ApiError";
import { HttpStatus } from "./HttpStatus";

/**
 * An instance of {@link ApiError} that represents a Bad Request error.
 */
export class BadRequestError extends ApiError {
  /**
   * Creates an instance of {@link BadRequestError}.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(HttpStatus.badRequest, message);
  }
}
