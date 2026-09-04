import { describe, it, expect } from "vitest";
import {
  toneText,
  toneBadge,
  toneOutlineHover,
  toneSweepBorder,
  toneSweepFill,
  type Tone,
} from "./tone";

const TONES: Tone[] = ["violet", "cyan", "gold", "magenta"];
const MAPS = { toneText, toneBadge, toneOutlineHover, toneSweepBorder, toneSweepFill };

describe("tone maps", () => {
  it.each(Object.entries(MAPS))("%s covers every tone", (_name, map) => {
    for (const tone of TONES) {
      expect(map[tone]).toBeTruthy();
    }
    expect(Object.keys(map).sort()).toEqual([...TONES].sort());
  });

  // Tailwind's @source scanner reads literal text, so a class assembled at
  // runtime would never make it into the shipped stylesheet.
  it.each(Object.entries(MAPS))("%s holds only literal class names", (_name, map) => {
    for (const value of Object.values(map)) {
      expect(value).not.toContain("${");
      expect(value).not.toContain("`");
      expect(value.trim()).toBe(value);
    }
  });

  it("names the tone it maps to", () => {
    for (const tone of TONES) {
      expect(toneText[tone]).toContain(tone);
      expect(toneBadge[tone]).toContain(tone);
    }
  });
});
