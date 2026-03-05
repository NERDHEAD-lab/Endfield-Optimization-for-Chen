import { rendererBridge } from "../../utils/RendererBridge";
import { EventHandler, EventType, ShowChangelogEvent } from "../types";

/**
 * Handler to synchronize 'SHOW_CHANGELOG' events to the renderer.
 */
export const ChangelogUISyncHandler: EventHandler<ShowChangelogEvent> = {
  id: "ChangelogUISyncHandler",
  targetEvent: EventType.SHOW_CHANGELOG,

  handle: (event, _context) => {
    const { changelogs, oldVersion, newVersion } = event.payload;

    // Delegate to RendererBridge for reliable delivery
    rendererBridge.send("UI:SHOW_CHANGELOG", {
      changelogs,
      oldVersion,
      newVersion,
    });
  },
};
