import * as vscode from "vscode";

export function getRelativePath(absolutePath: string): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return absolutePath;
  }

  // Try to find the workspace that contains this file
  for (const folder of workspaceFolders) {
    const relativePath = vscode.workspace.asRelativePath(absolutePath, false);
    if (relativePath !== absolutePath) {
      return relativePath;
    }
  }
  return absolutePath;
}
