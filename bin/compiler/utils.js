export function isProductionBuild() {
    return process.env.NODE_ENV === "production";
}

export function computePlatform() {
    return process.env.PLATFORM || "node";
}