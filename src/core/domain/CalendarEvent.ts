import type { Entity } from "../types";
import type { RecurrenceRule } from "./RecurrenceRule";

/**
 * The CalendarEvent entity for interacting with a calendar
 */
export interface CalendarEvent extends Entity {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly title: string;
  readonly organizer: string;
  readonly description?: string;
  readonly isRecurring: boolean;
  readonly recurrenceRule?: RecurrenceRule;
}
