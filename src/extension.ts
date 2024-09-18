import * as vscode from "vscode";
import { copyFileTree } from "./commands/copyFileTree";
import { copyFileTreeDepth } from "./commands/copyFileTreeDepth";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("clipper.copyFileTree", copyFileTree);
  context.subscriptions.push(disposable);

  let disposableDepth = vscode.commands.registerCommand("clipper.copyFileTreeDepth", copyFileTreeDepth);
  context.subscriptions.push(disposableDepth);
}

export function deactivate() {}
