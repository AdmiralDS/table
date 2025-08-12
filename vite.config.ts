import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["styled-components", { displayName: true }]],
      },
    }),
    svgr({
      svgrOptions: {
        dimensions: false,
        svgProps: {
          focusable: "{false}",
        },
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: true,
  },
});
