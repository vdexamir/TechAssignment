import { ApiError } from "./ApiError";
import { HttpStatus } from "./HttpStatus";

/**
 * An instance of {@link ApiError} that represents a Not Found error.
 */
export class NotFoundError extends ApiError {
  /**
   * Creates an instance of {@link NotFoundError}.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(HttpStatus.notFound, message);
  }
}
