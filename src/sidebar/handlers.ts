import * as vscode from "vscode";

type MessageHandler = (webview: vscode.Webview, value?: any) => void;
type MessageHandlers = Record<string, MessageHandler>;

export const createMessageHandler = (handlers: MessageHandlers) => {
  return (webview: vscode.Webview, message: { type: string; value?: any }) => {
    const handler = handlers[message.type];
    if (handler) {
      handler(webview, message.value);
    } else {
      console.warn(`No handler found for message type: ${message.type}`);
    }
  };
};
