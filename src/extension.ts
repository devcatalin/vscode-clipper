import * as vscode from "vscode";
import { copyFileTree } from "./commands/copyFileTree";
import { copyFileTreeDepth } from "./commands/copyFileTreeDepth";
import { copyOpenFiles } from "./commands/copyOpenFiles";

export function activate(context: vscode.ExtensionContext) {
  const commandDisposables = [
    vscode.commands.registerCommand("clipper.copyFileTree", copyFileTree),
    vscode.commands.registerCommand("clipper.copyFileTreeDepth", copyFileTreeDepth),
    vscode.commands.registerCommand("clipper.copyOpenFiles", copyOpenFiles),
  ];
  context.subscriptions.push(...commandDisposables);
}

export function deactivate() {}
