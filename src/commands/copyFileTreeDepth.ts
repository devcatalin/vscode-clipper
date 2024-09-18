import * as vscode from "vscode";
import { determineRootPath } from "../utils/paths";
import { createIgnoreFilter } from "../utils/ignore";
import { generateFileTreeWithDepth } from "../utils/treeGenerators";
import { basename } from "path";

export async function copyFileTreeDepth(uri?: vscode.Uri) {
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
  const rootName = basename(rootPath);
  const ig = createIgnoreFilter(rootPath);
  const isRelative = rootPath !== vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  const treeText = generateFileTreeWithDepth(rootPath, rootName, ig, maxDepth, isRelative);

  vscode.env.clipboard.writeText(treeText);
  vscode.window.showInformationMessage("File tree with depth limit copied to clipboard!");
}
