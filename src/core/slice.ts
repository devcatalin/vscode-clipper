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

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    addClip: (state, action: PayloadAction<Omit<Clip, "id">>) => {
      const newId = Math.max(...state.clips.map((clip) => clip.id), 0) + 1;
      state.clips.push({
        id: newId,
        ...action.payload,
      });
    },
    removeClip: (state, action: PayloadAction<number>) => {
      state.clips = state.clips.filter((clip) => clip.id !== action.payload);
    },
    removeAllClips: (state) => {
      state.clips = [];
      vscode.window.showInformationMessage(`Removed all clips.`);
    },
    copyAllClips: (state) => {
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

export type SliceActions = typeof mainSlice.actions;
export type ActionTypes = keyof SliceActions;

export const { addClip, removeClip, removeAllClips, copyAllClips } = mainSlice.actions;
