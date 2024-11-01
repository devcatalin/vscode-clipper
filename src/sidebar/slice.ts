import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as vscode from "vscode";

interface Clip {
  id: number;
  message: string;
  filePath: string;
  code: string;
  languageId: string;
}

export interface State {
  clips: Clip[];
}

const initialState: State = {
  clips: [],
};

const formatClipForCopy = (clip: Clip): string => {
  const displayName = clip.filePath.split(/[\\/]/).pop() || clip.filePath;
  return `${clip.message}\n\n[${displayName}](${clip.filePath})\n\`\`\`${clip.languageId}\n${clip.code}\n\`\`\``;
};

export const slice = createSlice({
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
    removeAllClips: (state) => {
      console.log("[Clipper] Removing all clips");
      state.clips = [];
      vscode.window.showInformationMessage(`Removed all clips.`);
    },
    copyAllClips: (state) => {
      console.log("[Clipper] Copying all clips");
      if (state.clips.length === 0) {
        vscode.window.showWarningMessage("No clips to copy.");
        return;
      }
      const formattedClips = state.clips.map(formatClipForCopy).join("\n\n---\n\n");
      vscode.env.clipboard.writeText(formattedClips);
      vscode.window.showInformationMessage(`Copied ${state.clips.length} clips to clipboard.`);
    },
  },
});

export const { addClip, updateClip, removeClip, removeAllClips, copyAllClips } = slice.actions;
