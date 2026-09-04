import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Guards the *shipped* stylesheet.
 *
 * Consumers get `dist/styles.css` and are told they need no Tailwind install,
 * so the build must carry every class the components reference. Run
 * `npm run build:css` first — the `test` script does.
 */
const DIST = resolve(import.meta.dirname, "../../dist/styles.css");

let css = "";

beforeAll(() => {
  if (!existsSync(DIST)) {
    throw new Error(`${DIST} is missing — run \`npm run build:css\` before testing.`);
  }
  css = readFileSync(DIST, "utf8");
});

describe("shipped stylesheet", () => {
  it("is not empty", () => {
    expect(css.length).toBeGreaterThan(1000);
  });

  it("registers the scroll custom property", () => {
    expect(css).toContain("--lumen-scroll");
  });

  describe("vendor prefix ordering", () => {
    // The minifier drops a standard property when a -webkit- one follows it,
    // which silently removed the glass blur once already.
    it.each(["backdrop-filter", "mask"])(
      "declares -webkit-%s before the standard property",
      (prop) => {
        const std = new RegExp(`[;{]${prop}:`);
        if (!std.test(css)) return; // property not used
        const webkitAt = css.indexOf(`-webkit-${prop}:`);
        const stdAt = css.search(std);
        expect(webkitAt).toBeGreaterThanOrEqual(0);
        expect(webkitAt).toBeLessThan(stdAt);
      },
    );

    it("keeps the standard backdrop-filter alongside the prefixed one", () => {
      expect(css).toContain("-webkit-backdrop-filter:");
      expect(css).toMatch(/[;{]backdrop-filter:/);
    });
  });

  describe("effect classes", () => {
    it.each([
      ".glass",
      ".gradient-text",
      ".text-glow",
      ".eyebrow",
      ".hairline",
      ".hologram-ring",
      ".floaty",
    ])("ships %s", (cls) => {
      expect(css).toContain(cls);
    });
  });

  describe("motion classes", () => {
    it.each([
      ".lumen-reveal",
      ".lumen-split-char",
      ".lumen-parallax",
      ".lumen-scrim-center",
      ".lumen-scrim-left",
      ".lumen-scrim-right",
      ".lumen-progress-fill",
      ".lumen-cue",
      ".lumen-collapse",
      ".lumen-dialog",
      ".lumen-popover",
      ".lumen-carousel",
      ".lumen-slide",
      ".lumen-nebula",
    ])("ships %s", (cls) => {
      expect(css).toContain(cls);
    });
  });

  describe("@source scanning", () => {
    // These utilities only appear inside component files. If the scanner ever
    // stops seeing them, consumers lose the styling with no build error.
    it.each([
      "text-cyan",
      "text-violet",
      "border-white",
      "rounded-3xl",
      "snap-center",
      "tabular-nums",
      "backdrop-blur",
    ])("emits the %s utility used by components", (util) => {
      expect(css).toContain(util);
    });
  });

  describe("accessibility guards", () => {
    it("respects prefers-reduced-motion", () => {
      expect(css).toContain("prefers-reduced-motion");
    });

    it("keeps content visible when scripting is unavailable", () => {
      expect(css).toContain("scripting");
    });
  });
});
