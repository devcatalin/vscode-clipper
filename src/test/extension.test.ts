import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Copy file tree", async () => {
    // Create a temporary directory structure
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-test-"));
    fs.mkdirSync(path.join(tempDir, "subdir"));
    fs.writeFileSync(path.join(tempDir, "file1.txt"), "content");
    fs.writeFileSync(path.join(tempDir, "subdir", "file2.txt"), "content");

    // Execute the command
    await vscode.commands.executeCommand("clipper.copyFileTree", vscode.Uri.file(tempDir));

    // Get the clipboard content
    const clipboardContent = await vscode.env.clipboard.readText();

    console.log("Clipboard content:\n", clipboardContent);

    // Assert the clipboard content
    assert.ok(clipboardContent.includes("file1.txt"));
    assert.ok(clipboardContent.includes("subdir"));
    assert.ok(clipboardContent.includes("file2.txt"));

    // Clean up
    fs.rmSync(tempDir, { recursive: true });
  });
});
