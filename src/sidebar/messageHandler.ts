// src/messageHandlers.ts
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

type MessageHandler = {
  type: string;
  value: any;
};

const loadHandlers = () => {
  const handlersDir = path.join(__dirname, "handlers");
  const handlers: Record<string, Function> = {};

  fs.readdirSync(handlersDir)
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      const handlerName = path.basename(file, ".js");
      const handlerModule = require(path.join(handlersDir, file));
      handlers[handlerName] = handlerModule.handler;
    });

  return handlers;
};

export const createMessageHandler = () => {
  const handlers = loadHandlers();

  return async (message: MessageHandler) => {
    try {
      if (message.type in handlers) {
        await handlers[message.type](message.value);
      } else {
        console.warn(`No handler found for message type: ${message.type}`);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error handling message: ${error}`);
    }
  };
};
