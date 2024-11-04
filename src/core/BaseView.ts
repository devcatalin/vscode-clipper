import * as vscode from "vscode";
import { webviewRegistry } from "./store";
import { createContentProvider, messageHandler } from "./webview";

abstract class BaseView {
  protected _webview: vscode.WebviewPanel | vscode.WebviewView;
  protected _disposables: vscode.Disposable[] = [];

  constructor(webview: vscode.WebviewPanel | vscode.WebviewView, extensionUri: vscode.Uri) {
    this._webview = webview;

    this._webview.webview.options = {
      enableScripts: true,
    };

    // Load content
    createContentProvider(this._webview.webview, extensionUri, this.getTemplatePath());

    // Setup message handling
    webviewRegistry.register(this._webview.webview);
    this._webview.webview.onDidReceiveMessage(messageHandler as (message: any) => void);

    // Handle disposal
    this._webview.onDidDispose(
      () => {
        webviewRegistry.unregister(this._webview.webview);
        this.dispose();
      },
      null,
      this._disposables
    );
  }

  protected abstract getTemplatePath(): string;

  public dispose() {
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}

export default BaseView;
