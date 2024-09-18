import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import ignore, { Ignore } from "ignore";

const defaultIgnoredFiles = [
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

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("clipper.copyFileTree", handleCopyFileTree);
  context.subscriptions.push(disposable);

  let disposableDepth = vscode.commands.registerCommand("clipper.copyFileTreeDepth", handleCopyFileTreeDepth);
  context.subscriptions.push(disposableDepth);
}

async function handleCopyFileTree(uri?: vscode.Uri) {
  const rootPath = await determineRootPath(uri);
  if (!rootPath) {
    vscode.window.showErrorMessage("Unable to determine a root folder for the file tree.");
    return;
  }

  const rootName = path.basename(rootPath);
  const ig = createIgnoreFilter(rootPath);
  const treeText = generateFileTree(rootPath, rootName, ig);

  vscode.env.clipboard.writeText(treeText);
  vscode.window.showInformationMessage("File tree copied to clipboard!");
}

async function handleCopyFileTreeDepth(uri?: vscode.Uri) {
  const rootPath = await determineRootPath(uri);
  if (!rootPath) {
    vscode.window.showErrorMessage("Unable to determine a root folder for the file tree.");
    return;
  }

  const depthInput = await vscode.window.showInputBox({
    prompt: "Enter the maximum depth for the file tree",
    placeHolder: "e.g., 3",
    validateInput: (value) => {
      const depth = parseInt(value);
      return isNaN(depth) || depth <= 0 ? "Please enter a positive integer" : null;
    },
  });

  if (depthInput === undefined) {
    return; // User cancelled the input
  }

  const maxDepth = parseInt(depthInput);
  const rootName = path.basename(rootPath);
  const ig = createIgnoreFilter(rootPath);
  const isRelative = rootPath !== vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const treeText = generateFileTreeWithDepth(rootPath, rootName, ig, maxDepth, isRelative);

  vscode.env.clipboard.writeText(treeText);
  vscode.window.showInformationMessage("File tree with depth limit copied to clipboard!");
}

async function determineRootPath(uri?: vscode.Uri): Promise<string | undefined> {
  // If uri is provided, it's called from the context menu
  if (uri && fs.statSync(uri.fsPath).isDirectory()) {
    return uri.fsPath;
  }

  // If no uri is provided, it's likely called from the command palette
  if (!uri) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder is open.");
      return undefined;
    }

    const inputPath = await vscode.window.showInputBox({
      prompt: "Enter a relative path for the root folder (leave empty for workspace root)",
      placeHolder: "e.g., src/components",
    });

    if (inputPath === undefined) {
      // User cancelled the input
      return undefined;
    }

    const fullPath = inputPath ? path.join(workspaceFolders[0].uri.fsPath, inputPath) : workspaceFolders[0].uri.fsPath;

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      return fullPath;
    } else if (inputPath) {
      vscode.window.showErrorMessage("Invalid path or not a directory.");
      return undefined;
    }
  }

  // Fallback to workspace root if no input was provided
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  vscode.window.showErrorMessage("Unable to determine a root folder for the file tree.");
  return undefined;
}

function createIgnoreFilter(rootPath: string): Ignore {
  const ig = ignore().add(defaultIgnoredFiles);
  const gitignorePath = path.join(rootPath, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ig.add(gitignoreContent);
  }

  return ig;
}

function getFilteredAndSortedItems(dir: string, ig: Ignore): fs.Dirent[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => !ig.ignores(item.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) {
        return -1;
      }
      if (!a.isDirectory() && b.isDirectory()) {
        return 1;
      }
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
}

function generateFileTree(dir: string, rootName: string, ig: Ignore, indent: string = ""): string {
  let result = `${rootName}\n`;
  const items = getFilteredAndSortedItems(dir, ig);

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextIndent = indent + (isLast ? "    " : "│   ");

    result += `${indent}${connector}${item.name}\n`;

    if (item.isDirectory()) {
      result += generateFileTree(path.join(dir, item.name), "", ig, nextIndent).split("\n").slice(1).join("\n");
      if (result[result.length - 1] !== "\n") {
        result += "\n";
      }
    }
  });

  return result;
}

function generateFileTreeWithDepth(
  dir: string,
  rootName: string,
  ig: Ignore,
  maxDepth: number,
  isRelative: boolean,
  currentDepth: number = 0,
  indent: string = ""
): string {
  let result = `${rootName}\n`;

  if (currentDepth >= maxDepth) {
    result += `${indent}...\n`;
    return result;
  }

  const items = getFilteredAndSortedItems(dir, ig);

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextIndent = indent + (isLast ? "    " : "│   ");

    result += `${indent}${connector}${item.name}\n`;

    if (item.isDirectory()) {
      const subTree = generateFileTreeWithDepth(
        path.join(dir, item.name),
        "",
        ig,
        maxDepth,
        isRelative,
        currentDepth + 1,
        nextIndent
      );
      result += subTree.split("\n").slice(1).join("\n");
    }
  });

  return result;
}

export function deactivate() {}
