// src/SidebarProvider.ts
import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview();

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "deleteCard": {
          // Handle card deletion
          vscode.window.showInformationMessage(`Deleted card ${data.value}`);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview() {
    // Sample data for testing
    const cards = [
      { id: 1, title: "Card 1", content: "Content 1" },
      { id: 2, title: "Card 2", content: "Content 2" },
      { id: 3, title: "Card 3", content: "Content 3" },
    ];

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: var(--vscode-font-family);
            padding: 10px;
          }
          .card {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 10px;
            position: relative;
          }
          .card-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .delete-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: transparent;
            border: none;
            color: var(--vscode-editor-foreground);
            cursor: pointer;
            padding: 4px 8px;
          }
          .delete-btn:hover {
            color: var(--vscode-errorForeground);
          }
        </style>
      </head>
      <body>
        <div id="app">
          ${cards
            .map(
              (card) => `
            <div class="card" id="card-${card.id}">
              <div class="card-title">${card.title}</div>
              <div class="card-content">${card.content}</div>
              <button class="delete-btn" onclick="deleteCard(${card.id})">✕</button>
            </div>
          `
            )
            .join("")}
        </div>

        <script>
          const vscode = acquireVsCodeApi();

          function deleteCard(id) {
            vscode.postMessage({
              type: 'deleteCard',
              value: id
            });
            
            const card = document.getElementById('card-' + id);
            if (card) {
              card.remove();
            }
          }
        </script>
      </body>
      </html>
    `;
  }
}
