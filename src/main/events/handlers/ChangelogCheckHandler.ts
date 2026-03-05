import { changelogService } from "../../services/ChangelogService";
import { eventBus } from "../EventBus";
import {
  AppContext,
  ConfigChangeEvent,
  EventHandler,
  EventType,
} from "../types";

/**
 * Handles 'launcherVersion' config changes.
 * Used to detect updates and fetch changelogs.
 */
export const ChangelogCheckHandler: EventHandler<ConfigChangeEvent> = {
  id: "ChangelogCheckHandler",
  targetEvent: EventType.CONFIG_CHANGE,

  condition: (event) => {
    return event.payload.key === "launcherVersion";
  },

  handle: async (event, context: AppContext) => {
    const { oldValue, newValue } = event.payload;

    if (
      typeof oldValue === "string" &&
      typeof newValue === "string" &&
      oldValue && // Ensure old value existed (not fresh install)
      newValue
    ) {
      console.log(
        `[ChangelogCheckHandler] Version changed: ${oldValue} -> ${newValue}. Fetching changelogs...`,
      );

      const changelogs = await changelogService.fetchChangelogs(
        newValue,
        oldValue,
      );

      if (changelogs.length > 0) {
        console.log(
          `[ChangelogCheckHandler] Broadcasting SHOW_CHANGELOG with ${changelogs.length} items.`,
        );
        eventBus.emit(EventType.SHOW_CHANGELOG, context, {
          changelogs,
          oldVersion: oldValue,
          newVersion: newValue,
        });
      } else {
        console.log("[ChangelogCheckHandler] No relevant changelogs found.");
      }
    }
  },
};
