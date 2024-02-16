import jetpack from "fs-jetpack";
import esbuild from "esbuild";

const inFile = jetpack.path("src", "main.js");
const outFile = jetpack.path("dist", "wave.js");

jetpack.remove(outFile);

esbuild.build({
    entryPoints: [inFile],
    outfile: outFile,
    bundle: true,
    format: "cjs"
});