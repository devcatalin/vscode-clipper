import * as vscode from "vscode";
import { store } from "../sidebar/store";
import { removeAllClips as removeAllClipsAction } from "../sidebar/slice";

export async function removeAllClips() {
  store.dispatch(removeAllClipsAction());
  vscode.window.showInformationMessage("Removed all clips.");
}
