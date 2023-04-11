import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "src/index.ts",
  output: [
    {
      file: "/dist/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    commonjs(),
    resolve(),
    typescript({
      emitDeclarationOnly: true,
      declaration: true,
      include: ["src/**/*"],
      outDir: "dist",
      exclude: ["node_modules", "dist"],
    }),
    babel({
      babelHelpers: "bundled",
      extensions: ["js", "ts"],
    }),
  ],
};
