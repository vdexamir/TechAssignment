import { transform } from "@swc/core";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { logger } from "./logger.js";
import { isProductionBuild } from "./utils.js";

const compilerOptions = {
    jsc: {
        parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true,
            topLevelAwait: true,
        },
        target: "esnext",
        externalHelpers: true,
        minify: {
            compress: {
                unused: true,
            },
            format: {
                comments: false,
            },
        },
    },
    module: {
        type: "es6",
        strict: true,
        lazy: true,
    },
    sourceMaps: false,
    minify: false,
};

function setCompilerOptions() {
    if (isProductionBuild()) {
        compilerOptions.minify = true;
    } else {
        compilerOptions.sourceMaps = true;
    }
}

async function processFile(input, output) {
    const sourceCode = await readFile(input, "utf-8");
    const { code, map } = await transform(sourceCode, compilerOptions);

    const filename = output.replace(/\.[^.]+$/, ".js");

    const commands = [void writeFile(filename, code, "utf-8")];
    if (compilerOptions.sourceMaps && map) {
        commands.push(writeFile(`${filename}.map`, map, "utf-8"));
    }

    await Promise.all(commands);
}

async function buildArtifacts(input, output) {
    const items = await readdir(input, { withFileTypes: true });

    await Promise.all(
        items.map(async (item) => {
            const sourcePath = join(input, item.name);
            const outputPath = join(output, item.name);

            if (item.isDirectory()) {
                return buildArtifacts(sourcePath, outputPath);
            }

            return processFile(sourcePath, outputPath);
        }),
    );
}

export async function compile(input, output) {
    logger.info("Creating build artifacts...");

    setCompilerOptions();

    try {
        await buildArtifacts(input, output);
        logger.success("Successfully created build artifacts");
    } catch (error) {
        logger.error(error);
    }
}