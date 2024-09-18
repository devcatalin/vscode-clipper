import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export async function determineRootPath(uri?: vscode.Uri): Promise<string | undefined> {
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
