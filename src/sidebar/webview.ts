import * as vscode from "vscode";
import * as Handlebars from "handlebars";
import { readFileContent } from "../utils/file";

export const configureWebview = (webview: vscode.Webview, extensionUri: vscode.Uri) => {
  webview.options = {
    enableScripts: true,
    localResourceRoots: [extensionUri],
  };
};

export const generateWebviewContent = (extensionUri: vscode.Uri, data: any): string => {
  const templateContent = readFileContent(extensionUri, "sidebar/template.hbs");
  const scriptContent = readFileContent(extensionUri, "sidebar/script.js");

  const template = Handlebars.compile(templateContent);
  const htmlContent = template(data);

  return htmlContent.replace("</body>", `<script>${scriptContent}</script></body>`);
};
