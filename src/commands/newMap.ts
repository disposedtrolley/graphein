import * as path from "path";
import * as vscode from "vscode";

interface newMapArgs {
    extensionPath: string
}

export const newMap = (args: newMapArgs) => {
  vscode.window.showInformationMessage("Hello World from graphein!");

  const panel = vscode.window.createWebviewPanel(
    "grapheinMap",
    "Graphein - Map",
    vscode.ViewColumn.Two,
    {
        enableScripts: true,
    }
  );

  panel.webview.html = getWebviewContent();
};

const getWebviewContent = () => {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cat Coding</title>
      </head>
      <body>
          <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
      </body>
      </html>`;
      }
}