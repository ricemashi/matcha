/* eslint-disable @typescript-eslint/naming-convention */
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { fileURLToPath } from "url";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import path from "path";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fs
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
          preprocess: sveltePreprocess(),
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
