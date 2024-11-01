import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export const readFileContent = (extensionUri: vscode.Uri, filename: string): string => {
  try {
    const filePath = path.join(extensionUri.fsPath, "src", filename);
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to read ${filename}`);
    return "";
  }
};
