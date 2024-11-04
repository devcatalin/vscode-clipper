import * as vscode from "vscode";
import { copyFileTree } from "./commands/copyFileTree";
import { copyFileTreeDepth } from "./commands/copyFileTreeDepth";
import { copyOpenEditors } from "./commands/copyOpenEditors";
import { createClip } from "./commands/createClip";

import { store } from "./core/store";
import { copyAllClips, removeAllClips } from "./core/slice";
import { ClipperPanel } from "./panel/ClipperPanel";
import ClipperSidebar from "./sidebar/ClipperSidebar";

export function activate(context: vscode.ExtensionContext) {
  const commandDisposables = [
    vscode.commands.registerCommand("clipper.copyFileTree", copyFileTree),
    vscode.commands.registerCommand("clipper.copyFileTreeDepth", copyFileTreeDepth),
    vscode.commands.registerCommand("clipper.copyOpenEditors", copyOpenEditors),
    vscode.commands.registerCommand("clipper.createClip", createClip),
    vscode.commands.registerCommand("clipper.copyAllClips", () => store.dispatch(copyAllClips())),
    vscode.commands.registerCommand("clipper.removeAllClips", () => store.dispatch(removeAllClips())),
    vscode.commands.registerCommand("clipper.openDashboard", () => {
      ClipperPanel.createOrShow(context.extensionUri);
    }),
    vscode.window.registerWebviewViewProvider(
      "clipper.cardsView",
      ClipperSidebar.createProvider(context.extensionUri)
    ),
  ];

  context.subscriptions.push(...commandDisposables);
}

export function deactivate() {}
