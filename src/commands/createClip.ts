import * as vscode from "vscode";
import { addClip } from "../core/slice";
import { store } from "../core/store";

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

  let processedDocumentText = documentText;
  if (userInput.toLowerCase().includes("line")) {
    const lines = documentText.split("\n");
    const startLine = selection.isEmpty ? 1 : selection.start.line + 1;
    processedDocumentText = lines.map((line, index) => `${startLine + index}  ${line}`).join("\n");
  }

  store.dispatch(addClip({ message: userInput, filePath: fileName, code: processedDocumentText, languageId }));

  const selectionMsg = selection.isEmpty ? "full content" : "selection";
  vscode.window.showInformationMessage(`Created clip from ${fileName} ${selectionMsg}.`);
}
