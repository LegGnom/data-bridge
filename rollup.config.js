import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.main,
                format: "cjs",
            },

            {
                file: pkg.module,
                format: "esm",
            },
        ],
        plugins: [
            typescript({
                tsconfig: "./tsconfig.json",
                declaration: true,
                declarationDir: "dist",
                rootDir: "src",
            }),
            terser(),
        ],
    },
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.browser,
                name: "data",
                format: "umd",
            },
        ],
        plugins: [typescript(), nodeResolve(), commonjs(), terser()],
    },
];
