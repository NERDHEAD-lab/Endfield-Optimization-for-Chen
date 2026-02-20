import { AppConfig } from "../../shared/types";
import { eventBus } from "../events/EventBus";
import { AppContext, EventType } from "../events/types";
import {
  setConfig as storeSetConfig,
  deleteConfig as storeDeleteConfig,
  getConfig as storeGetConfig,
} from "../store";

/**
 * Sets a configuration value and broadcasts the change event via EventBus.
 */
export function setConfigWithEvent(
  context: AppContext,
  key: string,
  value: unknown,
) {
  let oldValue: unknown = undefined;

  const currentConfig = storeGetConfig() as AppConfig;
  oldValue = currentConfig[key as keyof AppConfig];

  // Update Store
  storeSetConfig(key, value);

  // Broadcast Event
  eventBus.emit(EventType.CONFIG_CHANGE, context, {
    key,
    oldValue,
    newValue: value,
  });
}

/**
 * Deletes a configuration value and broadcasts the delete event.
 */
export function deleteConfigWithEvent(context: AppContext, key: string) {
  let oldValue: unknown = undefined;

  const currentConfig = storeGetConfig() as AppConfig;
  oldValue = currentConfig[key as keyof AppConfig];

  // Update Store
  storeDeleteConfig(key);

  // Broadcast Event
  eventBus.emit(EventType.CONFIG_DELETE, context, {
    key,
    oldValue,
  });
}
