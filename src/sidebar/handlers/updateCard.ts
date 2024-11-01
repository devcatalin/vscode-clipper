import * as vscode from "vscode";

export const handler = (data: { id: number; content: string }) => {
  vscode.window.showInformationMessage(`Updated card ${data.id} with content: ${data.content}`);
};
