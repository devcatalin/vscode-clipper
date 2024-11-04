import * as vscode from "vscode";
import { configureStore } from "@reduxjs/toolkit";
import { mainSlice } from "./slice";

class WebviewRegistry {
  private webviews: Set<vscode.Webview> = new Set();

  register(webview: vscode.Webview) {
    this.webviews.add(webview);
    this.sendStateToWebview(webview, store.getState());
  }

  unregister(webview: vscode.Webview) {
    this.webviews.delete(webview);
  }

  private sendStateToWebview(webview: vscode.Webview, state: any) {
    try {
      webview.postMessage({
        type: "render",
        value: state,
      });
    } catch (error) {
      console.error("[Clipper] Error sending state to webview:", error);
    }
  }

  broadcastState(state: any) {
    this.webviews.forEach((webview) => {
      this.sendStateToWebview(webview, state);
    });
  }
}

export const webviewRegistry = new WebviewRegistry();

export const store = configureStore({
  reducer: mainSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

store.subscribe(() => {
  webviewRegistry.broadcastState(store.getState());
});
