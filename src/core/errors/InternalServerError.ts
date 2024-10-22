import { ApiError } from "./ApiError";
import { HttpStatus } from "./HttpStatus";

/**
 * An instance of {@link ApiError} that represents an Internal Server error.
 */
export class InternalServerError extends ApiError {
  /**
   * Creates an instance of {@link InternalServerError}.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(HttpStatus.internalServerError, message);
  }
}
