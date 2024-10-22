import { CalendarEvent } from "../core/domain";
import { SearchParams } from "../core/repositories/Repository";
import type {
  CalendarApi,
  CreateEventRequest,
  DeleteEventRequest,
  UpdateEventRequest,
} from "../core/services";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../core/errors";

export class CalendarApiController implements CalendarApi {
  constructor(private readonly _service: CalendarApi) {}

  public async createEvent(
    request: CreateEventRequest
  ): Promise<CalendarEvent> {
    this._validateCreateEventRequest(request);

    try {
      return this._service.createEvent(request);
    } catch (error) {
      this._handleError(error);
    }
  }

  public async findEvent(id: string): Promise<CalendarEvent> {
    try {
      return this._service.findEvent(id);
    } catch (error) {
      this._handleError(error);
    }
  }

  public async searchEvents(
    request: SearchParams<CalendarEvent>
  ): Promise<CalendarEvent[]> {
    try {
      return this._service.searchEvents(request);
    } catch (error) {
      this._handleError(error);
    }
  }

  public async updateEvent(
    id: string,
    request: UpdateEventRequest
  ): Promise<CalendarEvent> {
    this._validateUpdateEventRequest(request);

    try {
      return this._service.updateEvent(id, request);
    } catch (error) {
      this._handleError(error);
    }
  }

  public async deleteEvent(request: DeleteEventRequest): Promise<void> {
    try {
      return this._service.deleteEvent(request);
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * This can be handled using validators like joi or zod, but I didn't want
   * to introduce a new dependency for a low complexity use case.
   */
  private _validateCreateEventRequest(
    request: Partial<CreateEventRequest>
  ): void {
    if (Object.keys(request).length === 0) {
      throw new BadRequestError("Request must not be empty");
    }

    const { title, startDate, endDate } = request;
    if (!title || title.trim().length === 0) {
      throw new BadRequestError("Title must not be empty");
    }

    if (!(startDate && endDate)) {
      throw new BadRequestError("Start date and end date must not be empty");
    }
  }

  private _validateUpdateEventRequest(request: UpdateEventRequest): void {
    if (Object.keys(request).length === 0) {
      throw new BadRequestError("Request must not be empty");
    }

    const { title, startDate, endDate } = request;
    if ("title" in request && (!title || title.trim().length === 0)) {
      throw new BadRequestError("Title must not be empty if provided");
    }

    if ("startDate" in request && !startDate) {
      throw new BadRequestError("Start date must not be empty");
    }

    if ("endDate" in request && !endDate) {
      throw new BadRequestError("End date must not be empty");
    }
  }

  private _handleError(error: unknown): never {
    if (
      [
        error instanceof BadRequestError,
        error instanceof ConflictError,
        error instanceof NotFoundError,
      ].some(Boolean)
    ) {
      throw error;
    }

    throw new InternalServerError(String(error));
  }
}
