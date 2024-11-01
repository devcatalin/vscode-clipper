import * as vscode from "vscode";

export async function copyOpenFiles() {
  const openDocs = vscode.workspace.textDocuments.filter((doc) => {
    return (
      !doc.uri.scheme.includes("output") &&
      !doc.uri.scheme.includes("debug") &&
      !doc.uri.scheme.includes("extension") &&
      doc.uri.scheme === "file"
    );
  });

  if (openDocs.length === 0) {
    vscode.window.showInformationMessage("No open files found.");
    return;
  }

  let output = "";

  for (const document of openDocs) {
    const fileName = document.fileName;
    const displayName = fileName.split(/[\\/]/).pop() || fileName;
    const fileContent = document.getText();

    output += `\n[${displayName}](${fileName})\n`;

    const languageId = document.languageId;
    output += "```" + languageId + "\n";
    output += fileContent;
    output += "\n```\n";
  }

  await vscode.env.clipboard.writeText(output);
  vscode.window.showInformationMessage(
    `Copied content from ${openDocs.length} file${openDocs.length === 1 ? "" : "s"} to clipboard.`
  );
}
