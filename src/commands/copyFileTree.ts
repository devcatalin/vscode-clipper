import * as vscode from "vscode";
import { determineRootPath } from "../utils/paths";
import { createIgnoreFilter } from "../utils/ignore";
import { basename } from "path";
import { generateFileTree } from "../utils/treeGenerators";

export async function copyFileTree(uri?: vscode.Uri) {
  const rootPath = await determineRootPath(uri);
  if (!rootPath) {
    vscode.window.showErrorMessage("Unable to determine a root folder for the file tree.");
    return;
  }

  const rootName = basename(rootPath);
  const ig = createIgnoreFilter(rootPath);
  const treeText = generateFileTree(rootPath, rootName, ig);

  vscode.env.clipboard.writeText(treeText);
  vscode.window.showInformationMessage("File tree copied to clipboard!");
}
