import * as vscode from "vscode";
import { getRelativePath } from "../core/paths";

export async function copyProblemsFromOpenEditors() {
  // Get all diagnostics from the current workspace
  const diagnostics = new Map<string, vscode.Diagnostic[]>();

  // Collect all diagnostics for open editors
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

  // Collect diagnostics for each open document
  for (const document of openDocs) {
    const diags = vscode.languages.getDiagnostics(document.uri);
    if (diags.length > 0) {
      diagnostics.set(document.uri.fsPath, diags);
    }
  }

  if (diagnostics.size === 0) {
    vscode.window.showInformationMessage("No problems found in open editors.");
    return;
  }

  let output = "# Problems in Open Editors\n\n";

  // Process each file with problems
  for (const [filePath, problems] of diagnostics) {
    const document = await vscode.workspace.openTextDocument(filePath);
    const fileName = filePath.split(/[\\/]/).pop() || filePath;
    const relativePath = getRelativePath(filePath);

    output += `## [${fileName}](${relativePath})\n\n`;

    // Group problems by severity
    const errorProblems = problems.filter((p) => p.severity === vscode.DiagnosticSeverity.Error);
    const warningProblems = problems.filter((p) => p.severity === vscode.DiagnosticSeverity.Warning);

    // Process errors
    if (errorProblems.length > 0) {
      output += "### Errors\n\n";
      for (const problem of errorProblems) {
        output += formatProblem(document, problem);
      }
    }

    // Process warnings
    if (warningProblems.length > 0) {
      output += "### Warnings\n\n";
      for (const problem of warningProblems) {
        output += formatProblem(document, problem);
      }
    }

    output += "\n";
  }

  await vscode.env.clipboard.writeText(output);
  vscode.window.showInformationMessage(
    `Copied problems from ${diagnostics.size} file${diagnostics.size === 1 ? "" : "s"} to clipboard.`
  );
}

function formatProblem(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): string {
  const startLine = diagnostic.range.start.line;
  const endLine = diagnostic.range.end.line;
  const lineNumber = startLine + 1;

  let output = `**${diagnostic.message}** (Line ${lineNumber})\n\n`;

  // Add code context
  output += "```" + document.languageId + "\n";

  // Add line numbers and code
  for (let i = Math.max(0, startLine - 1); i <= Math.min(document.lineCount - 1, endLine + 1); i++) {
    const lineText = document.lineAt(i).text;
    const lineNum = i + 1;
    const prefix = i === startLine ? ">" : " ";
    output += `${prefix} ${lineNum.toString().padStart(3)} | ${lineText}\n`;
  }

  output += "```\n\n";
  return output;
}
