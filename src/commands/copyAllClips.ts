import * as vscode from "vscode";
import { store } from "../sidebar/store";

export async function copyAllClips() {
  const clips = store.getState().clips;
  const clipText = clips.map((clip) => clip.message).join("\n");
  vscode.env.clipboard.writeText(clipText);
  vscode.window.showInformationMessage("All clips copied to clipboard!");
}
