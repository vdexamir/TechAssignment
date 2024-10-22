import { describe, it, expect, jest } from "@jest/globals";
import type { CalendarEventRepository } from "../../src/core/repositories";
import type {
  CalendarApiDeps,
  CreateEventRequest,
  UpdateEventRequest,
} from "../../src/core/services";
import { CalendarApiService } from "../../src/services/CalendarApiService";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../src/core/errors";
import type { CalendarEvent } from "../../src/core/domain";
import { uuidV4 } from "../../src/utils";

const repository = {
  create: jest.fn(),
  update: jest.fn(),
  search: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
} as CalendarEventRepository;

const deps: CalendarApiDeps = {
  repository,
};

const overlappingEvents: CalendarEvent[] = [
  {
    id: uuidV4(),
    createdAt: new Date("2024-08-06T10:00:00.000Z"),
    title: "Overlapping 1",
    description: "Test Overlapping",
    startDate: new Date("2024-08-06T10:00:00.000Z"),
    endDate: new Date("2024-08-06T12:00:00.000Z"),
    organizer: "vladdexamir@gmail.com",
    isRecurring: false,
  },
  {
    id: uuidV4(),
    createdAt: new Date("2024-08-06T10:00:00.000Z"),
    title: "Overlapping 2",
    description: "Test Overlapping",
    startDate: new Date("2024-08-06T11:00:00.000Z"),
    endDate: new Date("2024-08-06T12:00:00.000Z"),
    organizer: "vladdexamir@gmail.com",
    isRecurring: false,
  },
];

function assertEvent(event: CalendarEvent, request: CreateEventRequest): void {
  expect(event).toBeDefined();
  expect(event.title).toBe(request.title);
  expect(event.startDate).toEqual(request.startDate);
  expect(event.endDate).toEqual(request.endDate);
  expect(event.organizer).toBe(request.organizer);
}

function assertEventDoesNotExist(error: unknown, id: string): void {
  expect(error).toBeDefined();
  expect(error).toBeInstanceOf(BadRequestError);
  expect((error as BadRequestError).message).toBe(
    `CalendarEvent with id ${id} does not exist in our system`
  );
  expect(repository.find).toHaveBeenCalledWith("testId");
}
describe("CalendarApiService", () => {
  const calendarApi = new CalendarApiService(deps);
  describe("createEvent", () => {
    const request: CreateEventRequest = {
      title: "Test Title",
      startDate: new Date("2024-08-06T10:00:00.000Z"),
      endDate: new Date("2024-08-06T12:00:00.000Z"),
      description: "Test Description",
      organizer: "vladdexamir@gmail.com",
    };
    it("should throw an error if startDate is after endDate", async () => {
      try {
        await calendarApi.createEvent({
          ...request,
          endDate: new Date("2024-08-06T08:00:00.000Z"),
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(BadRequestError);
        expect((error as BadRequestError).message).toBe("Invalid end time");
        expect(repository.search).not.toBeCalled();
      }
    });

    it(`should throw an error if there are overlapping events and allowOverlapping is not set`, async () => {
      jest.spyOn(repository, "search").mockResolvedValueOnce(overlappingEvents);

      try {
        await calendarApi.createEvent(request);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(ConflictError);
        expect((error as ConflictError).message).toBe(
          `The event is overlapping with following events: Overlapping 1, Overlapping 2`
        );
        expect(repository.search).toHaveBeenCalledWith({
          filters: {
            startDate: request.startDate,
            endDate: request.endDate,
          },
        });
      }
    });

    it("should create an event", async () => {
      jest.spyOn(repository, "search").mockResolvedValueOnce([]);

      const event = await calendarApi.createEvent(request);

      assertEvent(event, request);
      expect(repository.search).toHaveBeenCalledWith({
        filters: {
          startDate: request.startDate,
          endDate: request.endDate,
        },
      });
    });

    it("should create an event with unique id", async () => {
      jest.spyOn(repository, "search").mockResolvedValue([]);

      const event1 = await calendarApi.createEvent({
        ...request,
        title: "Event 1",
      });
      const event2 = await calendarApi.createEvent({
        ...request,
        title: "Event 2",
      });

      expect(event1).toBeDefined();
      expect(event2).toBeDefined();
      expect(event1.id).not.toEqual(event2.id);
    });

    it(`should create an event if there are overlapping events and allowOverlapping is set`, async () => {
      jest.spyOn(repository, "search").mockResolvedValueOnce(overlappingEvents);

      const event = await calendarApi.createEvent({
        ...request,
        allowOverlapping: true,
      });

      assertEvent(event, request);
      expect(repository.search).not.toBeCalled();
    });
  });

  describe("findEvent", () => {
    it("should return the event with corresponding with id", async () => {
      const expectedEvent: CalendarEvent = {
        id: "testId",
        title: "Test Event",
        description: "Testing Find",
        organizer: "vladdexamir@gmail.com",
        createdAt: new Date("2024-08-06T10:00:00.000Z"),
        startDate: new Date("2024-08-06T10:00:00.000Z"),
        isRecurring: false,
        endDate: new Date("2024-08-06T12:00:00.000Z"),
      };
      jest.spyOn(repository, "find").mockResolvedValue(expectedEvent);

      const foundEvent = await calendarApi.findEvent("testId");

      expect(foundEvent).toBeDefined();
      expect(foundEvent).toEqual(expectedEvent);
      expect(repository.find).toHaveBeenCalledWith("testId");
    });

    it("should throw an error if the event does not exist", async () => {
      jest.spyOn(repository, "find").mockResolvedValueOnce(undefined);

      try {
        await calendarApi.findEvent("testId");
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toBe(
          `CalendarEvent with id testId does not exist in our system`
        );
        expect(repository.find).toHaveBeenCalledWith("testId");
      }
    });
  });

  describe("searchEvents", () => {
    it("should return a list of empty events if there are no events", async () => {
      jest.spyOn(repository, "search").mockResolvedValueOnce([]);

      const events = await calendarApi.searchEvents({});
      expect(events).toBeDefined();
      expect(events).toEqual([]);
      expect(repository.search).toHaveBeenCalledWith({});
    });

    it("should return a list of events containing all events", async () => {
      const expectedEvents = [
        ...overlappingEvents,
        {
          id: uuidV4(),
          createdAt: new Date("2024-08-06T10:00:00.000Z"),
          title: "Search Events 1",
          description: "Test Search",
          startDate: new Date("2024-08-06T11:00:00.000Z"),
          endDate: new Date("2024-08-06T12:00:00.000Z"),
          organizer: "vladdexamir@gmail.com",
          isRecurring: false,
        },
        {
          id: uuidV4(),
          createdAt: new Date("2024-08-06T10:00:00.000Z"),
          title: "Search Events 2",
          description: "Test Search",
          startDate: new Date("2024-08-06T11:00:00.000Z"),
          endDate: new Date("2024-08-06T12:00:00.000Z"),
          organizer: "vladdexamir@gmail.com",
          isRecurring: false,
        },
      ];
      jest.spyOn(repository, "search").mockResolvedValueOnce(expectedEvents);

      const events = await calendarApi.searchEvents({});
      expect(events).toBeDefined();
      expect(events).toEqual(expectedEvents);
      expect(events.length).toBe(expectedEvents.length);
      expect(repository.search).toHaveBeenCalledWith({});
    });

    it("should return a list of events from a start date to an end date", async () => {
      jest.spyOn(repository, "search").mockResolvedValue(overlappingEvents);

      const startDate = new Date("2024-08-06T10:00:00.000Z");
      const endDate = new Date("2024-08-06T12:00:00.000Z");
      const events = await calendarApi.searchEvents({
        filters: {
          startDate,
          endDate,
        },
      });

      expect(events).toBeDefined();
      expect(events).toEqual(overlappingEvents);
      expect(events.length).toEqual(overlappingEvents.length);
      expect(repository.search).toHaveBeenCalledWith({
        filters: {
          startDate,
          endDate,
        },
      });
    });
  });

  describe("updateEvent", () => {
    const request: UpdateEventRequest = {
      title: "Updated Title",
      startDate: new Date("2024-08-06T10:00:00.000Z"),
      endDate: new Date("2024-08-06T12:00:00.000Z"),
      description: "Updated Description",
    };

    const foundEvent: CalendarEvent = {
      id: "testId",
      startDate: new Date(),
      endDate: new Date(),
      organizer: "vladdexamir@gmail.com",
      title: "Found event",
      createdAt: new Date("2024-08-06T10:00:00.000Z"),
      isRecurring: false,
    };
    it("should throw an error if the event does not exist", async () => {
      jest.spyOn(repository, "find").mockResolvedValueOnce(undefined);

      try {
        await calendarApi.updateEvent("testId", request);
      } catch (error) {
        assertEventDoesNotExist(error, "testId");
        expect(repository.update).not.toBeCalled();
      }
    });

    it("should throw an error if startDate is after endDate", async () => {
      jest.spyOn(repository, "find").mockResolvedValueOnce(foundEvent);

      try {
        await calendarApi.updateEvent("testId", {
          ...request,
          endDate: new Date("2024-08-06T08:00:00.000Z"),
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(BadRequestError);
        expect((error as BadRequestError).message).toBe("Invalid end time");
        expect(repository.find).toHaveBeenCalledWith("testId");
        expect(repository.search).not.toBeCalled();
      }
    });

    it(`should throw an error if there are overlapping events and allowOverlapping is not set`, async () => {
      jest.spyOn(repository, "find").mockResolvedValueOnce(foundEvent);
      jest.spyOn(repository, "search").mockResolvedValueOnce(overlappingEvents);

      try {
        await calendarApi.updateEvent("testId", request);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(ConflictError);
        expect((error as ConflictError).message).toBe(
          `The event is overlapping with following events: Overlapping 1, Overlapping 2`
        );
        expect(repository.find).toHaveBeenCalledWith("testId");
        expect(repository.search).toHaveBeenCalledWith({
          filters: {
            startDate: request.startDate,
            endDate: request.endDate,
          },
        });
      }
    });

    it("should update the event", async () => {
      const updatedAt = new Date();
      jest.spyOn(repository, "find").mockResolvedValueOnce(foundEvent);
      jest.spyOn(repository, "search").mockResolvedValueOnce([]);
      jest.spyOn(repository, "update").mockResolvedValueOnce({
        ...foundEvent,
        title: "Updated Title",
        updatedAt,
      });

      const updatedEvent = await calendarApi.updateEvent("testId", {
        title: "Updated Title",
      });
      expect(updatedEvent).toBeDefined();
      expect(updatedEvent.title).toBe(request.title);
      expect(updatedEvent.updatedAt).toBeDefined();
      expect(repository.find).toHaveBeenCalledWith("testId");
      expect(repository.search).toHaveBeenCalledWith({
        filters: {},
      });
      expect(repository.update).toHaveBeenCalledWith("testId", {
        title: "Updated Title",
        updatedAt,
      });
    });

    it(`should update the event if there are overlapping events and allowOverlapping is set`, async () => {
      const updatedAt = new Date();
      jest.spyOn(repository, "find").mockResolvedValueOnce(foundEvent);
      jest.spyOn(repository, "search").mockResolvedValueOnce(overlappingEvents);
      jest.spyOn(repository, "update").mockResolvedValueOnce({
        id: "testId",
        title: "Updated Title",
        startDate: new Date("2024-08-06T10:00:00.000Z"),
        endDate: new Date("2024-08-06T12:00:00.000Z"),
        description: "Updated Description",
        organizer: "vladdexamir@gmail.com",
        createdAt: new Date("2024-08-06T10:00:00.000Z"),
        updatedAt: new Date(),
        isRecurring: false,
      });

      const updatedEvent = await calendarApi.updateEvent("testId", {
        ...request,
        allowOverlapping: true,
      });

      expect(updatedEvent).toBeDefined();
      expect(updatedEvent.title).toBe(request.title);
      expect(updatedEvent.updatedAt).toBeDefined();
      expect(updatedEvent.startDate).toEqual(request.startDate);
      expect(updatedEvent.endDate).toEqual(request.endDate);
      expect(updatedEvent.description).toBe(request.description);
      expect(repository.find).toHaveBeenCalledWith("testId");
      expect(repository.search).not.toBeCalled();
      expect(repository.update).toHaveBeenCalledWith("testId", {
        ...request,
        updatedAt,
      });
    });
  });

  describe("deleteEvent", () => {
    it("should throw an error if the event does not exist", async () => {
      jest.spyOn(repository, "find").mockResolvedValueOnce(undefined);

      try {
        await calendarApi.deleteEvent({ id: "testId" });
      } catch (error) {
        assertEventDoesNotExist(error, "testId");
        expect(repository.delete).not.toBeCalled();
      }
    });

    it("should delete the event", async () => {
      const expectedEvent: CalendarEvent = {
        id: "testId",
        title: "Test Event",
        description: "Testing Find",
        organizer: "vladdexamir@gmail.com",
        createdAt: new Date("2024-08-06T10:00:00.000Z"),
        startDate: new Date("2024-08-06T10:00:00.000Z"),
        endDate: new Date("2024-08-06T12:00:00.000Z"),
        isRecurring: false,
      };
      jest.spyOn(repository, "find").mockResolvedValue(expectedEvent);

      await calendarApi.deleteEvent({ id: "testId" });

      expect(repository.find).toHaveBeenCalledWith("testId");
      expect(repository.delete).toHaveBeenCalledWith("testId");
    });
  });
});
