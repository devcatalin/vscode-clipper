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
      state.isInitialized = true;
    },
    addCard: (state, action: PayloadAction<Omit<Card, "id">>) => {
      const newId = Math.max(...state.cards.map((card) => card.id), 0) + 1;
      state.cards.push({
        id: newId,
        ...action.payload,
      });
    },
    updateCard: (state, action: PayloadAction<{ id: number; updates: Partial<Card> }>) => {
      const card = state.cards.find((c) => c.id === action.payload.id);
      if (card) {
        Object.assign(card, action.payload.updates);
      }
    },
    removeCard: (state, action: PayloadAction<number>) => {
      state.cards = state.cards.filter((card) => card.id !== action.payload);
    },
  },
});

export const { init, addCard, updateCard, removeCard } = slice.actions;

export const store = configureStore({
  reducer: slice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let currentWebview: vscode.Webview | null = null;

export const setStoreWebview = (webview: vscode.Webview) => {
  currentWebview = webview;
};

store.subscribe(() => {
  if (currentWebview) {
    currentWebview.postMessage({
      type: "render",
      value: store.getState().cards,
    });
  }
});
