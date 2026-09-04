import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    projects: [
      {
        // Pure logic and build artefacts — no DOM, so these stay fast.
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        // Components run in a real browser. Lumen leans on platform APIs
        // (<dialog>, the Popover API, IntersectionObserver, scroll-snap) and
        // on real layout, none of which jsdom can honestly simulate.
        plugins: [tailwindcss()],
        // Pre-bundle these: discovering them mid-run makes Vite reload the
        // page, which aborts whichever test is in flight.
        optimizeDeps: {
          include: [
            "react",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "react-dom",
            "react-dom/client",
            "@testing-library/react",
            "@testing-library/dom",
            "@testing-library/user-event",
          ],
        },
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.tsx"],
          setupFiles: ["./src/test-setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
