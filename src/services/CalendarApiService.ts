import { CalendarEvent, type RecurrenceRule } from "../core/domain";
import { SearchParams } from "../core/repositories/Repository";
import type {
  CalendarApi,
  CalendarApiDeps,
  CreateEventRequest,
  DeleteEventRequest,
  UpdateEventRequest,
} from "../core/services";
import type { CalendarEventRepository } from "../core/repositories";
import { BadRequestError, ConflictError, NotFoundError } from "../core/errors";
import { uuidV4 } from "../utils";

export class CalendarApiService implements CalendarApi {
  public async createEvent(
    request: CreateEventRequest
  ): Promise<CalendarEvent> {
    await this._validateRequest(request);

    const event: CalendarEvent = {
      ...request,
      id: uuidV4(),
      createdAt: new Date(),
      isRecurring: Boolean(request.recurrenceRule),
    };

    await this._repository.create(event);
    return event;
  }

  public async findEvent(id: string): Promise<CalendarEvent> {
    const event = await this._repository.find(id);
    if (!event) {
      throw new NotFoundError(
        `CalendarEvent with id ${id} does not exist in our system`
      );
    }

    return event;
  }

  public async searchEvents(
    request: SearchParams<CalendarEvent>
  ): Promise<CalendarEvent[]> {
    return this._repository.search(request);
  }

  public async updateEvent(
    id: string,
    request: UpdateEventRequest
  ): Promise<CalendarEvent> {
    await this._assertEvent(id);
    await this._validateRequest(request);

    const { allowOverlapping, ...payload } = request;
    return this._repository.update(id, {
      ...payload,
      updatedAt: new Date(),
    });
  }

  public async deleteEvent({
    id,
    occurrence,
    futureEvents = false,
  }: DeleteEventRequest): Promise<void> {
    const event = await this._assertEvent(id);

    if (!(event.isRecurring && event.recurrenceRule)) {
      return this._repository.delete(id);
    }

    if (futureEvents) {
      return this._deleteFutureEvents(id, event.recurrenceRule);
    }

    return this._deleteRecurringEvent(id, event.recurrenceRule, occurrence);
  }

  private async _validateRequest({
    startDate,
    endDate,
    allowOverlapping,
  }: CreateEventRequest | UpdateEventRequest): Promise<void> {
    if ((startDate?.getTime() ?? 0) >= (endDate?.getTime() ?? 1)) {
      throw new BadRequestError("Invalid end time");
    }

    if (allowOverlapping) {
      return;
    }

    const overlappingEvents = await this._repository.search({
      filters: {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      },
    });

    if (overlappingEvents.length === 0) {
      return;
    }

    const overlappingEventTitles = overlappingEvents
      .map(({ title }) => title)
      .join(", ");
    throw new ConflictError(
      `The event is overlapping with following events: ${overlappingEventTitles}`
    );
  }

  private async _assertEvent(id: string): Promise<CalendarEvent> {
    try {
      return await this.findEvent(id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new BadRequestError(error.message);
      } else {
        throw error;
      }
    }
  }

  private async _deleteFutureEvents(
    id: string,
    recurrenceRule: RecurrenceRule
  ): Promise<void> {
    const request: UpdateEventRequest = {
      recurrenceRule: {
        ...recurrenceRule,
        endDate: new Date(),
      },
    };

    await this._repository.update(id, request);
  }

  private async _deleteRecurringEvent(
    id: string,
    recurrenceRule: RecurrenceRule,
    occurrence?: Date
  ): Promise<void> {
    if (!occurrence) {
      return;
    }

    const exceptions = Array.from(
      new Set([...(recurrenceRule?.exceptions ?? []), occurrence])
    );
    const request: UpdateEventRequest = {
      recurrenceRule: {
        ...recurrenceRule,
        exceptions,
      },
    };

    await this._repository.update(id, request);
  }

  private readonly _repository: CalendarEventRepository;

  public constructor({ repository }: CalendarApiDeps) {
    this._repository = repository;
  }
}
