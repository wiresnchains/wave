import esbuild from "esbuild";
import * as colorette from "colorette";

const logPrefix = colorette.cyanBright("[Bundler]");

const inFile = "src/main.js";
const outFile = "dist/wave.js";
const startTime = Date.now();

console.log(logPrefix, "Bundling", colorette.gray(inFile), "->", colorette.gray(outFile));

try {
    esbuild.build({
        entryPoints: [inFile],
        outfile: outFile,
        bundle: true,
        format: "cjs"
    });
    
    console.log(logPrefix, colorette.greenBright("Finished bundling"), colorette.gray(inFile), "->", colorette.gray(outFile), "in", `${colorette.green(Date.now() - startTime)}ms\n`);
}
catch (error) {
    console.error(logPrefix, colorette.redBright("Error when bundling"), colorette.gray(inFile), "->", colorette.gray(outFile), colorette.red(error));
}