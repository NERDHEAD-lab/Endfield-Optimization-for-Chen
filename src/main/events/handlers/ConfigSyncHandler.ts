import { rendererBridge } from "../../utils/RendererBridge";
import {
  ConfigChangeEvent,
  ConfigDeleteEvent,
  EventHandler,
  EventType,
} from "../types";

export const ConfigChangeSyncHandler: EventHandler<ConfigChangeEvent> = {
  id: "ConfigChangeSyncHandler",
  targetEvent: EventType.CONFIG_CHANGE,

  // No condition needed, sync all config changes for now
  handle: (event, _context) => {
    const { key, oldValue, newValue } = event.payload;
    rendererBridge.send("config-changed", key, newValue, oldValue);
  },
};

export const ConfigDeleteSyncHandler: EventHandler<ConfigDeleteEvent> = {
  id: "ConfigDeleteSyncHandler",
  targetEvent: EventType.CONFIG_DELETE,

  handle: (event, _context) => {
    const { key } = event.payload;
    // We can reuse the same channel or a deletion-specific one
    // Sending null or undefined as value implies deletion/reset in some patterns
    rendererBridge.send("config-changed", key, null);
  },
};
