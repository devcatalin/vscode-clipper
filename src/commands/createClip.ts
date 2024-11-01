import * as vscode from "vscode";

export async function createClip() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found.");
    return;
  }

  const userInput = await vscode.window.showInputBox({
    prompt: "Enter text to prepend to the copied content",
    placeHolder: "Your text here... (include 'line' for line numbers)",
  });

  if (userInput === undefined) {
    return;
  }

  const selection = editor.selection;
  const documentText = !selection.isEmpty ? editor.document.getText(selection) : editor.document.getText();
  const languageId = editor.document.languageId;
  const fileName = editor.document.fileName;
  const displayName = fileName.split(/[\\/]/).pop() || fileName;

  let processedDocumentText = documentText;
  if (userInput.toLowerCase().includes("line")) {
    const lines = documentText.split("\n");
    const startLine = selection.isEmpty ? 1 : selection.start.line + 1;
    processedDocumentText = lines.map((line, index) => `${startLine + index}  ${line}`).join("\n");
  }

  const output = `${userInput}\n\n[${displayName}](${fileName})\n\`\`\`${languageId}\n${processedDocumentText}\n\`\`\``;

  await vscode.env.clipboard.writeText(output);

  const selectionMsg = selection.isEmpty ? "full document" : "selected text";
  vscode.window.showInformationMessage(`Copied user input and ${selectionMsg} to clipboard.`);
}
