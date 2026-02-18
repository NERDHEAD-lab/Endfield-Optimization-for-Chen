import { EventEmitter } from "events";

import { AppEvent, EventHandler, EventType } from "./types";

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public emitEvent<T>(type: EventType, payload: T) {
    const event: AppEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
    };
    this.emit(type, event);
  }

  public onEvent<T>(type: EventType, handler: EventHandler<AppEvent<T>>) {
    this.on(type, handler);
  }

  public offEvent<T>(type: EventType, handler: EventHandler<AppEvent<T>>) {
    this.removeListener(type, handler);
  }
}

export const eventBus = EventBus.getInstance();
