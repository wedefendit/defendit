import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const parentDir = path.resolve(projectDir, "..");
const { loadEnvConfig } = nextEnv;

loadEnvConfig(parentDir, true);

const nextBin = path.join(projectDir, "node_modules", "next", "dist", "bin", "next");

const child = spawn(
  process.execPath,
  [nextBin, "dev", "--port", "3005", "--turbopack"],
  {
    cwd: projectDir,
    env: process.env,
    stdio: "inherit",
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
