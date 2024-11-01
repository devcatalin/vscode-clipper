import * as vscode from "vscode";
import { configureWebview, generateWebviewContent } from "./webview";
import { createMessageHandler } from "./messageHandler";

export const createSidebarProvider = (extensionUri: vscode.Uri): vscode.WebviewViewProvider => ({
  resolveWebviewView: (webviewView: vscode.WebviewView) => {
    configureWebview(webviewView.webview, extensionUri);

    webviewView.webview.onDidReceiveMessage(createMessageHandler());

    const cards = getSampleCards();
    webviewView.webview.html = generateWebviewContent(extensionUri, { cards });
  },
});

export const getSampleCards = () => [
  { id: 1, title: "Card 1", content: "Content 1" },
  { id: 2, title: "Card 2", content: "Content 2" },
  { id: 3, title: "Card 3", content: "Content 3" },
];
