import type { CalendarEvent } from "../domain";
import type { Repository } from "./Repository";

export interface CalendarEventRepository extends Repository<CalendarEvent> {}
