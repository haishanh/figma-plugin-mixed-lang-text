import { defineConfig } from "vite";
import { resolve } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const minify = process.env.APP_ENV !== "dev";

function inlinePlugin() {
  return {
    name: "inline-assets-plugin",
    transformIndexHtml: {
      enforce: "post",
      transform(html, ctx) {
        if (!ctx || !ctx.bundle) return html;
        const bundle = ctx.bundle;
        const keys = Object.keys(bundle);

        console.log(keys);

        // return html;
        return `
        <style>${bundle["style.css"] && bundle["style.css"].source}</style>
        <div id="app"></div>
        <script>${bundle["ui.js"].code}</script>
        `;
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), inlinePlugin()],
  resolve: {
    alias: {
      // try to mimic SvelteKit DX
      // https://github.com/sveltejs/kit/blob/8f67e4/packages/kit/src/core/build/index.js#L172
      $lib: resolve(__dirname, "src/lib"),
    },
  },
  build: {
    minify,
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    rollupOptions: {
      input: {
        // for the UI
        ui: resolve(__dirname, "index.html"),
        // for the main thread
        main: resolve(__dirname, "src/main.ts"),
      },
      inlineDynamicImports: true,
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
        manualChunks: (id) => {
          if (id.endsWith("src/main.ts")) {
            return "main";
          } else if (/src\/lib\/shared\//.test(id)) {
            // do not split
            return;
          } else {
            return "ui-chunk.js";
          }
        },
      },
    },
  },
});
