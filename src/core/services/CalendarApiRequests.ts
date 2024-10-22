import type { Updates } from "../types";
import type { CalendarEvent, RecurrenceRule } from "../domain";

interface RequestConfig {
  readonly allowOverlapping?: boolean;
}

/**
 * The shape of a request for creating a new CalendarEvent
 */
export interface CreateEventRequest extends RequestConfig {
  readonly title: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly organizer: string;
  readonly description?: string;
  readonly recurrenceRule?: RecurrenceRule;
}

type NotUpdatableProps = "organizer";

/**
 * The shape of a request for updating an existing CalendarEvent
 */
export interface UpdateEventRequest
  extends RequestConfig,
    Omit<Updates<CalendarEvent>, NotUpdatableProps> {}

export interface DeleteEventRequest {
  readonly id: string;
  readonly occurrence?: Date;
  readonly futureEvents?: boolean;
}
