const SUCCESS_ICON = "✅";
const ERROR_ICON = "❌";
const INFO_ICON = "ℹ️";

function success(message) {
    console.log(`${SUCCESS_ICON} ${message}`);
}

function error(message) {
    console.error(`${ERROR_ICON} Error: ${message}`);
    console.log("Exiting...");
    process.exit(1);
}

function info(message) {
    console.log(`${INFO_ICON} ${message}`);
}

export const logger = {
    success,
    error,
    info,
};