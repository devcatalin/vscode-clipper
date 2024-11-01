import * as vscode from "vscode";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface Clip {
  id: number;
  message: string;
  filePath: string;
  code: string;
  languageId: string;
}

interface SidebarState {
  clips: Clip[];
}

const initialState: SidebarState = {
  clips: [
    {
      id: 1,
      message: "Example clip",
      filePath: "/example/path/file.ts",
      code: "function example() {\n  console.log('hello');\n  return true;\n}\n\nexample();",
      languageId: "typescript",
    },
  ],
};

const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    addClip: (state, action: PayloadAction<Omit<Clip, "id">>) => {
      console.log("[Clipper] Adding clip:", action.payload);
      const newId = Math.max(...state.clips.map((clip) => clip.id), 0) + 1;
      state.clips.push({
        id: newId,
        ...action.payload,
      });
    },
    updateClip: (state, action: PayloadAction<{ id: number; updates: Partial<Clip> }>) => {
      console.log("[Clipper] Updating clip:", action.payload);
      const clip = state.clips.find((c) => c.id === action.payload.id);
      if (clip) {
        Object.assign(clip, action.payload.updates);
      } else {
        console.warn("[Clipper] Clip not found for update:", action.payload.id);
      }
    },
    removeClip: (state, action: PayloadAction<number>) => {
      console.log("[Clipper] Removing clip:", action.payload);
      state.clips = state.clips.filter((clip) => clip.id !== action.payload);
    },
  },
});

export const { addClip, updateClip, removeClip } = slice.actions;

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
