import { AppContext, AppEvent, EventHandler, EventType } from "./types";

class EventBus {
  private static instance: EventBus;
  private handlers: EventHandler<unknown>[] = [];

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  registerHandler<T>(handler: EventHandler<T>): void {
    this.handlers.push(handler as unknown as EventHandler<unknown>);
  }

  unregisterHandler(handlerId: string): void {
    this.handlers = this.handlers.filter((h) => h.id !== handlerId);
  }

  emit<T = unknown>(type: EventType, context: AppContext, payload: T): void {
    const event: AppEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
    };

    const relevantHandlers = this.handlers.filter(
      (h) => h.targetEvent === type,
    );

    relevantHandlers.forEach((handler) => {
      try {
        // Type assertion for handler to match the payload type
        // This is safe because we filter by targetEvent
        if (handler.condition && !handler.condition(event)) {
          return;
        }
        handler.handle(event, context);
      } catch (error) {
        console.error(`Error in handler ${handler.id}:`, error);
      }
    });
  }
}

export const eventBus = EventBus.getInstance();
