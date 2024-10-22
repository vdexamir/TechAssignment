import type { CalendarEvent } from "../domain";
import type { CalendarEventRepository } from "../repositories";
import type {
  CreateEventRequest,
  DeleteEventRequest,
  UpdateEventRequest,
} from "./CalendarApiRequests";
import type { SearchParams } from "../repositories/Repository";

/**
 * Dependencies for CalendarApi
 */
export interface CalendarApiDeps {
  /**
   * The DataSource API for CalendarEvents
   */
  readonly repository: CalendarEventRepository;
}

/**
 * An API for managing CalendarEvents
 */
export interface CalendarApi {
  /**
   * Creates a new calendar event
   * @param request - {@link CreateEventRequest}
   * @returns a promise with {@link CalendarEvent}
   * @throws a {@link BadRequestError} if request is not valid
   * @throws {@link ConflictError} if the event is overlapping with other
   * events and the allowOverlapping option is not set
   */
  createEvent(request: CreateEventRequest): Promise<CalendarEvent>;

  /**
   *
   * @param id - the id of the event to be looking for
   * @returns the specified {@link CalendarEvent}
   * @throws a {@link NotFoundError} if the event does not exist
   */
  findEvent(id: string): Promise<CalendarEvent>;

  /**
   * Search for calendar events using various filters or options
   * @param request - {@link SearchParams}
   * @returns a list of {@link CalendarEvent}s
   * @privateRemarks - In the Technical Assignment it's called listEvents,
   * but to be honest, I think searchEvents is a better name. Feel free to
   * adjust it back to listEvents if you don't like my suggestion.
   */
  searchEvents(request: SearchParams<CalendarEvent>): Promise<CalendarEvent[]>;

  /**
   * Updates an existing calendar event
   * @param id - the id of the event to be updated
   * @param request - {@link UpdateEventRequest}
   * @returns the updated {@link CalendarEvent}
   * @throws {@link BadRequestError} if payload is not valid
   * @throws {@link ConflictError} if the event is overlapping with other
   * events and the allowOverlapping option is not set
   */
  updateEvent(id: string, request: UpdateEventRequest): Promise<CalendarEvent>;

  /**
   * Deletes a specific calendar event
   * @param request - {@link DeleteEventRequest}
   * @throws a {@link BadRequestError} if the event does not exist
   */
  deleteEvent(request: DeleteEventRequest): Promise<void>;
}
