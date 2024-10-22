#!/usr/bin/env node

import { resolve } from "path";
import { execSync } from "child_process";

const __dirname = import.meta.dirname;
const NODE_MODULES_BIN = resolve(__dirname, "../../node_modules/.bin");

console.log("Linting files ...");

try {
  execSync(
    `${NODE_MODULES_BIN}/eslint --ext .ts,.tsx,.js,.jsx --no-error-on-unmatched-pattern --cache ${process.argv[2] ?? ""} .`,
    { stdio: "inherit" },
  );
  console.log("Linting files complete");
  process.exit(0);
} catch (error) {
  console.error("Linting files failed");
  process.exit(1);
}
