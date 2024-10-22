import { MockCalendarEventRepository } from "../repositories";
import { CalendarApiService } from "../services/CalendarApiService";
import { CalendarApiController } from "./CalendarApiController";

const deps = {
  repository: new MockCalendarEventRepository(),
};
const service = new CalendarApiService(deps);

export const calendarApi = new CalendarApiController(service);
