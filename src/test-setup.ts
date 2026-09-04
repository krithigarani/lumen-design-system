import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Real compiled styles, so layout and paint assertions mean something.
import "./styles/lumen.css";

// Match the Storybook canvas: the void background is what makes the
// atmosphere z-index regression observable.
document.documentElement.style.background = "#030309";
document.body.style.background = "#030309";
document.body.style.margin = "0";

afterEach(() => {
  cleanup();
  window.scrollTo(0, 0);
  // Modal locks this; a leak would silently break later tests.
  document.documentElement.style.overflow = "";
});
