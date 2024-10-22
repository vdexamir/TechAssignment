import { build } from "esbuild";
import { logger } from "./logger.js";
import { computePlatform, isProductionBuild } from "./utils.js";

function getOptions(src, output) {
    const isProduction = isProductionBuild();
    const platform = computePlatform();

    return {
        entryPoints: [`${src}/index.js`],
        bundle: true,
        outfile: `${output}/index.js`,
        minify: isProduction,
        sourcemap: !isProduction,
        allowOverwrite: true,
        platform,
    };
}

export async function bundle(src, output = src) {
    logger.info("Optimizing build artifacts...");

    const options = getOptions(src, output);
    try {
        await build(options);
        logger.success("Successfully optimized build artifacts");
    } catch (error) {
        logger.error(error);
    }
}