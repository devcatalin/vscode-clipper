import * as vscode from "vscode";
import BaseView from "../core/BaseView";

export class ClipperPanel extends BaseView {
  private static instance: ClipperPanel | undefined;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    super(panel, extensionUri);
  }

  protected getTemplatePath(): string {
    return "src/panel/panel.html";
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (ClipperPanel.instance) {
      (ClipperPanel.instance._webview as vscode.WebviewPanel).reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "clipperPanel",
      "Clipper Dashboard",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    ClipperPanel.instance = new ClipperPanel(panel, extensionUri);
  }
}
