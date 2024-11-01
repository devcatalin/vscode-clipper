import * as vscode from "vscode";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface Card {
  id: number;
  title: string;
  content: string;
}

interface SidebarState {
  isInitialized: boolean;
  cards: Card[];
}

const initialState: SidebarState = {
  isInitialized: false,
  cards: [],
};

const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    init: (state) => {
      console.log("[Clipper] Initializing state");
      state.isInitialized = true;
    },
    addCard: (state, action: PayloadAction<Omit<Card, "id">>) => {
      console.log("[Clipper] Adding card:", action.payload);
      const newId = Math.max(...state.cards.map((card) => card.id), 0) + 1;
      state.cards.push({
        id: newId,
        ...action.payload,
      });
    },
    updateCard: (state, action: PayloadAction<{ id: number; updates: Partial<Card> }>) => {
      console.log("[Clipper] Updating card:", action.payload);
      const card = state.cards.find((c) => c.id === action.payload.id);
      if (card) {
        Object.assign(card, action.payload.updates);
      } else {
        console.warn("[Clipper] Card not found for update:", action.payload.id);
      }
    },
    removeCard: (state, action: PayloadAction<number>) => {
      console.log("[Clipper] Removing card:", action.payload);
      state.cards = state.cards.filter((card) => card.id !== action.payload);
    },
  },
});

export const { init, addCard, updateCard, removeCard } = slice.actions;

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
      value: initialState.cards,
    });
    console.log("[Clipper] Initial state sent to webview:", initialState.cards);
  } catch (error) {
    console.error("[Clipper] Error sending initial state:", error);
  }
};

store.subscribe(() => {
  if (currentWebview) {
    const state = store.getState();
    console.log("[Clipper] State updated, sending to webview:", state.cards);
    try {
      currentWebview.postMessage({
        type: "render",
        value: state.cards,
      });
    } catch (error) {
      console.error("[Clipper] Error sending state update:", error);
    }
  } else {
    console.warn("[Clipper] No webview available to receive state update");
  }
});
