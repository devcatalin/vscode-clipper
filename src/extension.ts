import * as vscode from "vscode";
import { copyFileTree } from "./commands/copyFileTree";
import { copyFileTreeDepth } from "./commands/copyFileTreeDepth";
import { copyOpenFiles } from "./commands/copyOpenFiles";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const commandDisposables = [
    vscode.commands.registerCommand("clipper.copyFileTree", copyFileTree),
    vscode.commands.registerCommand("clipper.copyFileTreeDepth", copyFileTreeDepth),
    vscode.commands.registerCommand("clipper.copyOpenFiles", copyOpenFiles),
    vscode.window.registerWebviewViewProvider("clipper.cardsView", sidebarProvider),
  ];

  context.subscriptions.push(...commandDisposables);
}

export function deactivate() {}
