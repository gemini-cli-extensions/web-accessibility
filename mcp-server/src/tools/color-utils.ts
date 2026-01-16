/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Parses axe-core's expectedContrastRatio format (e.g., "4.5:1" or "3:1") into a number.
 * @param ratio - Expected contrast ratio from axe-core (e.g., "4.5:1" or "3:1")
 * @returns Parsed numeric ratio (e.g., 4.5 or 3)
 */
export function parseExpectedContrastRatio(ratio: string): number {
  const parsed = parseFloat(ratio);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid contrast ratio format: "${ratio}". Expected format: "4.5:1" or "3:1"`
    );
  }
  return parsed;
}
