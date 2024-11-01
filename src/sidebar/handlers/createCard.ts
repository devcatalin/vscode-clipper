import * as vscode from "vscode";

export const handler = (data: { title: string; content: string }) => {
  vscode.window.showInformationMessage(`Created new card: ${data.title}`);
};
