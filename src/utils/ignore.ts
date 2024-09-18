import ignore, { Ignore } from "ignore";
import * as path from "path";
import { existsSync, readFileSync } from "fs";

export function createIgnoreFilter(rootPath: string): Ignore {
  const ig = ignore().add(DEFAULT_IGNORED_PATHS);
  const gitignorePath = path.join(rootPath, ".gitignore");

  if (existsSync(gitignorePath)) {
    const gitignoreContent = readFileSync(gitignorePath, "utf8");
    ig.add(gitignoreContent);
  }

  return ig;
}

export const DEFAULT_IGNORED_PATHS = [
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  ".next",
  ".git",
  ".DS_Store",
  ".vscode",
  "temp",
  "logs",
  "__pycache__",
  ".venv",
  "env",
  "venv",
  "target",
  ".idea",
  ".classpath",
  ".project",
  ".bundle",
  "vendor/bundle",
  "vendor",
  "bin",
  "pkg",
  "CMakeFiles",
  ".stack-work",
  "_build",
  "deps",
  ".dart_tool",
  ".flutter-plugins",
  ".packages",
];
