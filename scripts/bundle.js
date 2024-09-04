const esbuild = require("esbuild");
const esbuildPluginTsc = require("esbuild-plugin-tsc");

esbuild.build({
    entryPoints: ["./src/bundle.ts"],
    outfile: "./dist/wave.js",
    bundle: true,
    platform: "browser",
    format: "cjs",
    plugins: [esbuildPluginTsc()]
});

// Remember that if we change what we build, we should also update .npmignore