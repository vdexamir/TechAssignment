#!/usr/bin/env node

import { join, resolve } from "path";
import { execSync } from "child_process";

const __dirname = import.meta.dirname;
const NODE_MODULES_BIN = resolve(__dirname, "../../node_modules/.bin");
const ROOT = execSync("git rev-parse --show-toplevel").toString().trim();
const IGNORE_FILE = join(ROOT, ".gitignore");

console.log("Formatting files ...");

try {
  execSync(
    `${NODE_MODULES_BIN}/prettier . --write --cache --ignore-path ${IGNORE_FILE}`,
    { stdio: "inherit" },
  );
  console.log("Formatting files complete");
  process.exit(0);
} catch (error) {
  console.error("Formatting files failed", error);
  process.exit(1);
}
