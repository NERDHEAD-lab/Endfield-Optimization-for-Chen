import { describe, it, expect } from "vitest";

import { getMenuItems } from "./index";

describe("Feature Metadata Validation", () => {
  it("should not have duplicate storage keys across features", () => {
    const allFeatures = getMenuItems();
    const keyMap: Record<string, string> = {}; // key -> featureId
    const duplicates: string[] = [];

    allFeatures.forEach((feature) => {
      const keys = feature.usingKeys || [];
      keys.forEach((key) => {
        if (keyMap[key]) {
          duplicates.push(
            `Key "${key}" is used by both "${keyMap[key]}" and "${feature.id}"`,
          );
        } else {
          keyMap[key] = feature.id;
        }
      });
    });

    if (duplicates.length > 0) {
      throw new Error(
        `Duplicate storage keys detected:\n${duplicates.join("\n")}`,
      );
    }

    expect(duplicates.length).toBe(0);
  });
});
