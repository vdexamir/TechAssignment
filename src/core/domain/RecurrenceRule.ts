/**
 * Allowed frequencies for a recurring rule
 */
export enum Frequency {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

/**
 * A recurrence rule for defining recurring events
 */
export interface RecurrenceRule {
  readonly frequency: Frequency;
  readonly interval?: number;
  readonly count?: number;
  readonly endDate?: Date;
  readonly exceptions?: Date[];
}
