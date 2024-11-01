import * as vscode from "vscode";

export const handler = (cardId: number) => {
  vscode.window.showInformationMessage(`Deleted card ${cardId}`);
};
