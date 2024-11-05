import * as vscode from "vscode";
import { getRelativePath } from "../core/paths";

export async function copyCodeFromOpenEditors() {
  const openDocs = vscode.workspace.textDocuments.filter((doc) => {
    return (
      !doc.uri.scheme.includes("output") &&
      !doc.uri.scheme.includes("debug") &&
      !doc.uri.scheme.includes("extension") &&
      doc.uri.scheme === "file"
    );
  });

  if (openDocs.length === 0) {
    vscode.window.showInformationMessage("No open editors found.");
    return;
  }

  let output = "";

  for (const document of openDocs) {
    const fileName = document.fileName;
    const displayName = fileName.split(/[\\/]/).pop() || fileName;
    const relativePath = getRelativePath(fileName);
    const fileContent = document.getText();

    output += `\n[${displayName}](${relativePath})\n`;

    const languageId = document.languageId;
    output += "```" + languageId + "\n";
    output += fileContent;
    output += "\n```\n";
  }

  await vscode.env.clipboard.writeText(output);
  vscode.window.showInformationMessage(
    `Copied content from ${openDocs.length} editor${openDocs.length === 1 ? "" : "s"} to clipboard.`
  );
}
