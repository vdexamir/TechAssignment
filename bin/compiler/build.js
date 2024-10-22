#!/usr/bin/env node

import { getArgs } from "./cli.js";
import { logger } from "./logger.js";
import { compile } from "./compile.js";
import { bundle } from "./bundle.js";

async function build() {
    const { input, output, isBundleRequired, isReleaseRequired } = getArgs();

    logger.info("Starting build...");

    if (isReleaseRequired) {
        process.env.NODE_ENV = "production";
    }

    await compile(input, output);

    if (isBundleRequired || isReleaseRequired) {
        await bundle(output);
    }

    logger.success("Build completed successfully");
}

await build();