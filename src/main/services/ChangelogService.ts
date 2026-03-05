import axios from "axios";

import { ChangelogItem } from "../../shared/types";

// Constants
const REPO_OWNER = "NERDHEAD-lab";
const REPO_NAME = "Endfield-Optimization-for-Chen";
const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

export class ChangelogService {
  /**
   * Fetches changelogs between two versions.
   * Inclusive of newVersion, exclusive of oldVersion.
   */
  async fetchChangelogs(
    newVersion: string,
    oldVersion: string,
  ): Promise<ChangelogItem[]> {
    try {
      console.log(
        `[ChangelogService] Fetching releases from GitHub for range (${oldVersion} -> ${newVersion}]`,
      );

      const response = await axios.get(`${GITHUB_API_BASE}/releases`, {
        params: { per_page: 30 }, // Fetch up to 30 recent releases
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      const releases = response.data;
      if (!Array.isArray(releases)) {
        console.warn("[ChangelogService] GitHub response is not an array.");
        return [];
      }

      // Filter releases between oldVersion and newVersion
      // Logic:
      // 1. Sort releases by published_at (descending)
      // 2. Find releases where version satisfies: oldVersion < version <= newVersion
      // Note: This requires semver comparison or reliable string comparison if formats match.

      // For simplicity in this iteration, we include releases that are "newer" than oldVersion
      // and "older or equal" to newVersion based on the list order (assuming chronological).

      const relevantReleases: ChangelogItem[] = [];
      let foundOldVersion = false;

      for (const release of releases) {
        const tagName = release.tag_name.replace(/^v/, ""); // Remove 'v' prefix

        // If we hit the new version (top of list), start collecting
        // If we hit the old version, stop collecting (exclusive)
        // BUT: GitHub releases are ordered new -> old.

        // Scenarios:
        // 1. Current (New) is 1.2.0, Old is 1.0.0
        // List: 1.2.0, 1.1.0, 1.0.0 ...
        // We want 1.2.0 and 1.1.0.

        if (tagName === oldVersion) {
          foundOldVersion = true;
          break; // Stop processing further (older) releases
        }

        // Include this release if it matches newVersion or is newer than oldVersion (implicit by loop order)
        // And we haven't hit oldVersion yet.
        // Safety: Ensure we don't go beyond newVersion if for some reason the list has newer stuff (e.g. user downgraded)
        // If release is newer than newVersion, skip???? No, usually we upgrade.
        // Let's assume standard upgrade path for now.

        if (this.compareVersions(tagName, newVersion) <= 0) {
          console.log(
            `[ChangelogService] Found release ${tagName}. Body length: ${release.body?.length}`,
          );
          relevantReleases.push({
            version: tagName,
            date: release.published_at.split("T")[0],
            body: release.body || "*No content provided*",
            html_url: release.html_url,
          });
        }
      }

      if (!foundOldVersion && relevantReleases.length === 30) {
        console.warn(
          "[ChangelogService] Old version not found within last 30 releases. Changelog might be truncated.",
        );
      }

      return relevantReleases;
    } catch (error) {
      console.error("[ChangelogService] Failed to fetch changelogs:", error);
      return [];
    }
  }

  // Helper: Simple version comparison (semver-like)
  private compareVersions(a: string, b: string): number {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }
}

export const changelogService = new ChangelogService();
