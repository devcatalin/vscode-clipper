import * as vscode from "vscode";
import BaseView from "../core/BaseView";

class ClipperSidebar extends BaseView {
  private static instance: ClipperSidebar | undefined;

  private constructor(webviewView: vscode.WebviewView, extensionUri: vscode.Uri) {
    super(webviewView, extensionUri);
  }

  protected getTemplatePath(): string {
    return "src/sidebar/sidebar.html";
  }

  public static createProvider(extensionUri: vscode.Uri): vscode.WebviewViewProvider {
    return {
      resolveWebviewView: (webviewView: vscode.WebviewView): void | Thenable<void> => {
        if (ClipperSidebar.instance) {
          ClipperSidebar.instance.dispose();
          ClipperSidebar.instance = undefined;
        }
        ClipperSidebar.instance = new ClipperSidebar(webviewView, extensionUri);
      },
    };
  }

  public dispose(): void {
    ClipperSidebar.instance = undefined;
    super.dispose();
  }
}

export default ClipperSidebar;
