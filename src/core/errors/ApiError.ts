import type { HttpStatus } from "./HttpStatus";

/**
 * Abstract Calendar Api Error
 */
export abstract class ApiError extends Error {
  protected constructor(
    readonly status: HttpStatus,
    message: string
  ) {
    super(message);
  }
}
