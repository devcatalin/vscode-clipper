import * as vscode from "vscode";
import { store } from "./store";
import { ActionTypes, mainSlice } from "./slice";

interface WebviewMessage {
  type: "dispatch" | "command";
  value?: {
    actionType: ActionTypes;
    payload: unknown;
  };
  command?: string;
}

export function getWebviewUriFromFilename(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  filename: string
): vscode.Uri {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "resources", filename));
}

export async function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  templatePath: string
): Promise<string> {
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "resources", "style.css"));
  const baseScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "resources", "base.js"));
  const panelScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "src", "panel", "panel.js"));
  const sidebarScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "src", "sidebar", "sidebar.js"));

  const templateUri = vscode.Uri.joinPath(extensionUri, templatePath);
  const templateData = await vscode.workspace.fs.readFile(templateUri);
  const template = Buffer.from(templateData).toString("utf-8");

  return template
    .replace("${styleUri}", styleUri.toString())
    .replace("${baseScriptUri}", baseScriptUri.toString())
    .replace("${panelScriptUri}", panelScriptUri.toString())
    .replace("${sidebarScriptUri}", sidebarScriptUri.toString());
}

const getLoadingContent = () => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: var(--vscode-font-family);
        color: var(--vscode-foreground);
      }
      .loading {
        text-align: center;
      }
      .loading-text {
        margin-top: 16px;
      }
    </style>
  </head>
  <body>
    <div class="loading">
      <div class="loading-text">Loading Clipper...</div>
    </div>
  </body>
</html>`;

const getErrorContent = (error: Error) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: var(--vscode-font-family);
        color: var(--vscode-errorForeground);
      }
      .error {
        text-align: center;
        padding: 20px;
      }
      .error-title {
        font-size: 1.2em;
        margin-bottom: 8px;
      }
      .error-message {
        font-family: var(--vscode-editor-font-family);
        font-size: 0.9em;
        margin-top: 8px;
        padding: 8px;
        background-color: var(--vscode-inputValidation-errorBackground);
        border: 1px solid var(--vscode-inputValidation-errorBorder);
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="error">
      <div class="error-title">Failed to load Clipper</div>
      <div class="error-message">${error.message}</div>
    </div>
  </body>
</html>`;

export function createContentProvider(webview: vscode.Webview, extensionUri: vscode.Uri, templatePath: string) {
  // Set initial loading state
  webview.html = getLoadingContent();

  // Update content once template is loaded
  getWebviewContent(webview, extensionUri, templatePath)
    .then((content) => {
      webview.html = content;
    })
    .catch((error) => {
      console.error("[Clipper] Error loading webview content:", error);
      webview.html = getErrorContent(error);
    });
}

// Message handling
export const messageHandler = (message: WebviewMessage) => {
  if (message.type === "dispatch" && message.value) {
    const { actionType, payload } = message.value;
    const action = mainSlice.actions[actionType];
    if (action) {
      // @ts-expect-error - Redux Toolkit typing limitations
      store.dispatch(action(payload));
    } else {
      console.warn(`[Clipper] No action creator found for action type: ${actionType}`);
    }
  } else if (message.type === "command" && message.command) {
    vscode.commands.executeCommand(message.command);
  }
};

// Type guard for webview types
export function isWebviewPanel(webview: vscode.WebviewPanel | vscode.WebviewView): webview is vscode.WebviewPanel {
  return "reveal" in webview;
}

// Utility to get the proper title for logging
export function getWebviewTitle(webview: vscode.WebviewPanel | vscode.WebviewView): string {
  if (isWebviewPanel(webview)) {
    return webview.title;
  }
  return webview.description || "Sidebar View";
}

// Logging utility specific to webviews
export function logWebviewError(webview: vscode.WebviewPanel | vscode.WebviewView, error: Error) {
  const viewTitle = getWebviewTitle(webview);
  console.error(`[Clipper] Error in ${viewTitle}:`, error);
  vscode.window.showErrorMessage(`Clipper: Error in ${viewTitle} - ${error.message}`);
}
