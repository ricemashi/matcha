/* eslint-disable @typescript-eslint/naming-convention */
const svelte = require("rollup-plugin-svelte");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
const { fileURLToPath } = require("url");
const sveltePreprocess = require("svelte-preprocess");
const typescript = require("@rollup/plugin-typescript");
const postcss = require("rollup-plugin-postcss");
const path = require("path");
const fs = require("fs");

const production = !process.env.ROLLUP_WATCH;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

module.exports = fs
  .readdirSync(path.join(__dirname, "web", "pages"))
  .map((input) => {
    const name = input.split(".")[0];
    return {
      input: "web/pages/" + input,
      output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "out/" + name + ".js",
      },
      plugins: [
        svelte({
          preprocess: sveltePreprocess({
            sourceMap: !production,
            postcss: {
              plugins: [require("tailwindcss"), require("autoprefixer")],
            },
          }),
        }),

        postcss({
          extract: true,
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
          browser: true,
          dedupe: ["svelte"],
          moduleDirectory: ["node_modules"],
        }),
        commonjs(),
        typescript({
          tsconfig: "web/tsconfig.json",
          sourceMap: !production,
          inlineSources: !production,
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        // !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        // !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
      ],
      watch: {
        clearScreen: false,
      },
    };
  });
