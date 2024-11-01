import * as vscode from "vscode";
import { readFileContent } from "../utils/file";
import { store, setStoreWebview, addCard, updateCard, removeCard, init } from "./store";
import { ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

type ActionCreator = ActionCreatorWithPayload<any> | ActionCreatorWithoutPayload;
type ActionCreatorMap = {
  [key: string]: ActionCreator;
};

export const createMessageHandler = (actionCreators: ActionCreatorMap) => {
  return (message: { type: string; value: { actionType: string; payload: any } }) => {
    if (message.type === "dispatch") {
      const { actionType, payload } = message.value;
      const actionCreator = actionCreators[actionType];

      if (actionCreator) {
        store.dispatch(actionCreator(payload));
      } else {
        console.warn(`No action creator found for action type: ${actionType}`);
      }
    }
  };
};

export const createSidebarProvider = (extensionUri: vscode.Uri): vscode.WebviewViewProvider => ({
  resolveWebviewView: (webviewView: vscode.WebviewView) => {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = readFileContent(extensionUri, "sidebar/sidebar.html");

    setStoreWebview(webviewView.webview);

    const messageHandler = createMessageHandler({
      init,
      addCard,
      updateCard,
      removeCard,
    });

    webviewView.webview.onDidReceiveMessage(messageHandler);
  },
});
