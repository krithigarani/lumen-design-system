import { defineConfig } from "tsup";

const shared = {
  format: ["esm"] as const,
  dts: true,
  // Rollup's treeshaker strips module-level directives, which would drop the
  // "use client" banner on the client entry. esbuild's own DCE is sufficient.
  treeshake: false,
  splitting: false,
  external: ["react", "react-dom", "react/jsx-runtime"],
};

export default defineConfig([
  {
    // Server-safe: no directive, so these render in React Server Components.
    ...shared,
    entry: { index: "src/index.ts" },
    clean: true,
  },
  {
    // Interactive: needs state, effects, refs or event handlers.
    ...shared,
    entry: { client: "src/client.ts" },
    clean: false,
    banner: { js: '"use client";' },
  },
]);
