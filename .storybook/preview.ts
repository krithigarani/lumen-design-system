import type { Preview } from "@storybook/react-vite";
import "../src/styles/lumen.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      options: {
        void: { name: "Void", value: "#030309" },
        deep: { name: "Deep indigo", value: "#07071a" },
      },
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
  initialGlobals: {
    backgrounds: { value: "void" },
  },
};

export default preview;
