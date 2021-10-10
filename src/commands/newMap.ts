import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";

const REACT_BUILD_FOLDER = "react-build";

enum EditorAction {
  didChangeOpenFile = "didChangeOpenFile",
}

interface EditorEvent {
  action: EditorAction;
  payload: EditorEventPayload;
}

interface EditorEventPayload {
  filename: string;
}

interface NewMapArgs {
  extensionPath: string;
}

export const newMap = (args: NewMapArgs) => {
  vscode.window.showInformationMessage("Hello World from graphein!");

  const reactBuildPath = path.join(args.extensionPath, REACT_BUILD_FOLDER);

  const panel = vscode.window.createWebviewPanel(
    "grapheinMap",
    "Graphein - Map",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(reactBuildPath)],
    }
  );

  const manifest = getReactManifest(reactBuildPath);

  panel.webview.html = getReactWebviewContent({
    base: filePathToVSCodeResource(reactBuildPath),
    styles: filePathToVSCodeResource(
      path.join(reactBuildPath, manifest.mainCSSPath)
    ),
    scripts: filePathToVSCodeResource(
      path.join(reactBuildPath, manifest.mainJSPath)
    ),
  });

  vscode.window.onDidChangeActiveTextEditor(
    (editor: vscode.TextEditor | undefined) => {
      setTimeout(() => {
        // Why the timeout? https://github.com/microsoft/vscode/issues/114047
        panel.webview.postMessage({
          action: events.EditorAction.didChangeOpenFile,
          payload: {
            filename: `${editor?.document.fileName}`,
          },
        });
      }, 1);
    }
  );
};

interface ReactManifest {
  mainJSPath: string;
  mainCSSPath: string;
}

const getReactManifest = (reactBuildPath: string): ReactManifest => {
  const manifestPath = path.join(reactBuildPath, "asset-manifest.json");

  const manifest = fs.readFileSync(manifestPath);
  const manifestJSON = JSON.parse(manifest.toString());
  const manifestJSONFiles = manifestJSON["files"];

  return {
    mainJSPath: manifestJSONFiles["main.js"],
    mainCSSPath: manifestJSONFiles["main.css"],
  };
};

const getReactWebviewContent = (args: {
  base: vscode.Uri;
  styles: vscode.Uri;
  scripts: vscode.Uri;
}) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <title>React App</title>
        <link rel="stylesheet" type="text/css" href="${args.styles}">
        <base href="${args.base}/">
    </head>

    <body>
        <div id="root"></div>
        
        <script src="${args.scripts}"></script>
    </body>
    </html>`;
};

const filePathToVSCodeResource = (filepath: string): vscode.Uri => {
  return vscode.Uri.file(filepath).with({ scheme: "vscode-resource" });
};
