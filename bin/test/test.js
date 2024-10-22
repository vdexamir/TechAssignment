#!/usr/bin/env node

import { resolve } from "path";
import { execSync } from "child_process";

const __dirname = import.meta.dirname;
const NODE_MODULES_BIN = resolve(__dirname, "../../node_modules/.bin");

console.log("Running tests ...");

try {
  execSync(`${NODE_MODULES_BIN}/jest ${process.argv[2] ?? ""}`, {
    stdio: "inherit",
  });
  console.log("Tests complete");
} catch (error) {
  console.error("Tests failed");
  process.exit(1);
}
