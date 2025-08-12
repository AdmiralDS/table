import { resolve } from "node:path";
import pkg from "./package.json";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["styled-components", { displayName: true }]],
      },
    }),
    libInjectCss(),
    svgr({
      svgrOptions: {
        dimensions: false,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            "preset-default",
            "removeTitle",
            "removeDesc",
            "removeDoctype",
            "cleanupIds",
          ],
        },
        svgProps: {
          focusable: "{false}",
        },
      },
    }),
    tsconfigPaths(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
      outDir: "./dist/types",
    }),
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    minify: false,
    // use vite library mode to build the package
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
    },
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies || {}).map(
        (dep) => new RegExp(`^${dep}`, "i")
      ),
      output: [
        {
          format: "esm",
          dir: "./dist/esm",
          preserveModulesRoot: "lib",
          preserveModules: true,
          interop: "auto",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "assets/[hash][extname]",
          entryFileNames: "[name].js",
          exports: "named",
        },
        {
          format: "cjs",
          dir: "./dist/cjs",
          preserveModulesRoot: "lib",
          preserveModules: true,
          interop: "auto",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "assets/[hash][extname]",
          entryFileNames: "[name].js",
          exports: "named",
        },
      ],
    },
  },
});
