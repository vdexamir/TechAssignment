import { ApiError } from "./ApiError";
import { HttpStatus } from "./HttpStatus";

/**
 * An instance of {@link ApiError} that represents a Conflict error.
 */
export class ConflictError extends ApiError {
  /**
   * Creates an instance of {@link ConflictError}.
   * @param message - The error message.
   */
  constructor(message: string) {
    super(HttpStatus.conflict, message);
  }
}
