const esbuild = require("esbuild");
const esbuildPluginTsc = require("esbuild-plugin-tsc");
const fs = require("fs");

esbuild.build({
    entryPoints: ["./src/bundle.ts"],
    outfile: "./dist/wave.js",
    bundle: true,
    platform: "browser",
    format: "cjs",
    minifyWhitespace: true,
    plugins: [esbuildPluginTsc()]
});

fs.copyFileSync("./src/benchmark.js", "./dist/benchmark.js");

// Remember that if we change what we build, we should also update .npmignore