import axios from "axios";

import { ReleaseNote } from "../../../shared/types";
import { logger } from "../../utils/logger";
import { EventHandler } from "../types";

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
}

export const PatchNoteHandler: EventHandler = async (_payload, context) => {
  const win = context.mainWindow;
  if (!win || win.isDestroyed()) return;

  try {
    logger.log("[PatchNoteHandler] Fetching release notes from GitHub...");
    // Defined in src/global.d.ts
    const owner = __REPO_OWNER__;
    const repo = __REPO_NAME__;
    const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

    // Fetch last 5 releases
    const response = await axios.get<GitHubRelease[]>(url, {
      params: { per_page: 5 },
      timeout: 5000,
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      const notes: ReleaseNote[] = response.data.map((release) => ({
        version: release.tag_name.replace(/^v/, ""),
        date: new Date(release.published_at).toLocaleDateString(),
        body: release.body,
        html_url: release.html_url,
      }));

      win.webContents.send("patch-notes-data", notes);
      logger.log(
        `[PatchNoteHandler] Sent ${notes.length} release notes to renderer.`,
      );
    }
  } catch (error) {
    logger.error("[PatchNoteHandler] Failed to fetch patch notes:", error);
    win.webContents.send("patch-notes-error", "Failed to load patch notes.");
  }
};
