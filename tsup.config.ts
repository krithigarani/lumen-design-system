import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  // Rollup's treeshaker strips module-level directives, which would drop the
  // "use client" banner below. esbuild's own DCE is sufficient here.
  treeshake: false,
  splitting: false,
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Many Lumen components use hooks, so the bundle is marked client-side for
  // the Next.js App Router. Consumers can still render them inside server pages.
  banner: { js: '"use client";' },
});
