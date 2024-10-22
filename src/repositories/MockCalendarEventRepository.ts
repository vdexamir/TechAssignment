import { CalendarEvent } from "../core/domain";
import type { CalendarEventRepository } from "../core/repositories";
import { SearchParams } from "../core/repositories/Repository";
import type { UpdateEventRequest } from "../core/services";

const DataSource: Map<string, CalendarEvent> = new Map<string, CalendarEvent>();

export class MockCalendarEventRepository implements CalendarEventRepository {
  public async find(id: string): Promise<CalendarEvent | undefined> {
    return DataSource.get(id);
  }

  public async search(
    _params?: SearchParams<CalendarEvent> | undefined
  ): Promise<CalendarEvent[]> {
    return [...DataSource.entries()].map(([_, event]) => event);
  }

  public async create(entity: CalendarEvent): Promise<void> {
    DataSource.set(entity.id, entity);
  }

  public async update(
    id: string,
    updates: UpdateEventRequest
  ): Promise<CalendarEvent> {
    const event = DataSource.get(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent = {
      ...event,
      ...updates,
    };

    DataSource.set(id, updatedEvent);
    return updatedEvent;
  }

  public async delete(id: string): Promise<void> {
    DataSource.delete(id);
  }
}
