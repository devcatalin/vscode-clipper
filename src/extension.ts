import * as vscode from "vscode";
import { createSidebarProvider } from "./sidebar";
import { copyFileTree } from "./commands/copyFileTree";
import { copyFileTreeDepth } from "./commands/copyFileTreeDepth";
import { copyOpenEditors } from "./commands/copyOpenEditors";
import { createClip } from "./commands/createClip";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = createSidebarProvider(context.extensionUri);

  const commandDisposables = [
    vscode.commands.registerCommand("clipper.copyFileTree", copyFileTree),
    vscode.commands.registerCommand("clipper.copyFileTreeDepth", copyFileTreeDepth),
    vscode.commands.registerCommand("clipper.copyOpenEditors", copyOpenEditors),
    vscode.commands.registerCommand("clipper.createClip", createClip),
    vscode.window.registerWebviewViewProvider("clipper.cardsView", sidebarProvider),
  ];

  context.subscriptions.push(...commandDisposables);
}

export function deactivate() {}
