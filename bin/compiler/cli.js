import { logger } from "./logger.js";

const defaultArgs = {
    isBundleRequired: false,
    isReleaseRequired: false,
    input: "src",
    output: "build",
    platform: "node",
};

function parseArgs(options, arg, value) {
    switch (arg) {
        case "--bundle":
        case "-b":
            return { ...options, isBundleRequired: true };

        case "--release":
        case "-r":
            return { ...options, isReleaseRequired: true };

        case "--input":
            return { ...options, input: value || defaultArgs.input };

        case "--output":
            return { ...options, output: value || defaultArgs.output };

        default:
            return logger.error(`Invalid option - ${arg}`);
    }
}

export function getArgs() {
    const args = process.argv.slice(2);
    return args.reduce(
        (options, arg, index) => parseArgs(options, arg, args[index + 1]),
        defaultArgs,
    );
}