import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";

const REACT_BUILD_FOLDER = "react-build";

interface NewMapArgs {
  extensionPath: string;
}

export const newMap = (args: NewMapArgs) => {
  vscode.window.showInformationMessage("Hello World from graphein!");

  const panel = vscode.window.createWebviewPanel(
    "grapheinMap",
    "Graphein - Map",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(args.extensionPath, REACT_BUILD_FOLDER)),
      ],
    }
  );

  panel.webview.html = getWebviewContent();
  console.log(getReactManifest(args.extensionPath));
};

interface ReactManifest {
  mainJSPath: string;
  mainCSSPath: string;
  indexHTMLPath: string;
}

const getReactManifest = (basePath: string): ReactManifest => {
  const buildPath = path.join(basePath, REACT_BUILD_FOLDER);
  const manifestPath = path.join(buildPath, "asset-manifest.json");

  const manifest = fs.readFileSync(manifestPath);
  const manifestJSON = JSON.parse(manifest.toString());
  const manifestJSONFiles = manifestJSON["files"];

  return {
    indexHTMLPath: path.join(buildPath, manifestJSONFiles["index.html"]),
    mainJSPath: path.join(buildPath, manifestJSONFiles["main.js"]),
    mainCSSPath: path.join(buildPath, manifestJSONFiles["main.css"]),
  };
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
};
