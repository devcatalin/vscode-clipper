import * as vscode from "vscode";
import { configureStore } from "@reduxjs/toolkit";
import { slice } from "./slice";

export const store = configureStore({
  reducer: slice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let currentWebview: vscode.Webview | null = null;

export const setStoreWebview = (webview: vscode.Webview) => {
  console.log("[Clipper] Setting up webview");
  currentWebview = webview;

  const initialState = store.getState();
  try {
    currentWebview.postMessage({
      type: "render",
      value: initialState,
    });
    console.log("[Clipper] Initial state sent to webview:", initialState);
  } catch (error) {
    console.error("[Clipper] Error sending initial state:", error);
  }
};

store.subscribe(() => {
  if (currentWebview) {
    const state = store.getState();
    console.log("[Clipper] State updated, sending to webview:", state);
    try {
      currentWebview.postMessage({
        type: "render",
        value: state,
      });
    } catch (error) {
      console.error("[Clipper] Error sending state update:", error);
    }
  } else {
    console.warn("[Clipper] No webview available to receive state update");
  }
});
