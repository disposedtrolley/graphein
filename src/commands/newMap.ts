import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import { createHash } from "crypto";

const REACT_BUILD_FOLDER = "react-build";

enum EditorAction {
  didChangeOpenFile = "didChangeOpenFile",
}

interface EditorEvent {
  action: EditorAction;
  payload: EditorEventPayload;
}

interface EditorEventPayload {
  from?: EditorNode;
  to: EditorNode;
}

type EditorNodeKey = string;

interface EditorNode {
  key: EditorNodeKey;
  filename: string;
  position: vscode.Position;
  intellisense?: EditorNodeIntellisense;
}

interface EditorNodeIntellisense {
  function: string;
}

interface NewMapArgs {
  extensionPath: string;
}

export const newMap = (args: NewMapArgs) => {
  // Is it okay to declare this within the handler func? I'm not sure about
  // its lifetime...
  let currentEditor: vscode.TextEditor | undefined;
  currentEditor = vscode.window.activeTextEditor;

  if (!vscode.workspace.workspaceFolders) {
    return;
  }

  let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;

  console.log(workspaceRoot);

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
      // Why the timeout? https://github.com/microsoft/vscode/issues/114047
      setTimeout(async () => {
        if (!editor) {
          return;
        }

        let payload: EditorEventPayload = {
          to: {
            key: getEditorNodeKey(
              editor.document.fileName,
              editor.selection.active
            ),
            filename: getRelativeFilename(
              editor.document.fileName,
              workspaceRoot
            ),
            position: editor.selection.active,
          },
        };

        if (currentEditor) {
          payload.from = {
            key: getEditorNodeKey(
              currentEditor!.document.fileName,
              currentEditor!.selection.active
            ),
            filename: getRelativeFilename(
              currentEditor!.document.fileName,
              workspaceRoot
            ),
            position: currentEditor!.selection.active,
          };
        }

        const symbolsTo = symbolsAtPoint(
          await symbolsInDocument(editor.document.uri),
          editor.selection.active
        );
        console.log("SYMBOLS_TO:");
        console.log(symbolsTo);

        let symbolsFrom: vscode.SymbolInformation[] = [];
        if (currentEditor) {
          symbolsFrom = symbolsAtPoint(
            await symbolsInDocument(currentEditor.document.uri),
            editor.selection.active
          );
        }

        console.log("SYMBOLS_FROM:");
        console.log(symbolsFrom);

        const fromSymbol = symbolsFrom.length > 0 ? symbolsFrom[0].name : null;
        const toSymbol = symbolsTo.length > 0 ? symbolsTo[0].name : null;

        if (fromSymbol) {
          payload.from!.intellisense = {
            function: fromSymbol,
          };
        }

        if (toSymbol) {
          payload.to!.intellisense = {
            function: toSymbol,
          };
        }

        console.log(payload);

        sendWebviewMessage(panel.webview, {
          action: EditorAction.didChangeOpenFile,
          payload,
        });

        currentEditor = editor;
      }, 1);
    }
  );
};

const getRelativeFilename = (filename: string, workspaceRoot: string) => {
  // ugh
  return filename.replace(workspaceRoot, "").replace("/", "");
};

const getEditorNodeKey = (
  filename: string,
  position: vscode.Position
): EditorNodeKey => {
  const posAsString = `${position.line}:${position.character}`;
  return createHash("sha256")
    .update(`${filename}_${posAsString}`)
    .digest("hex");
};

const sendWebviewMessage = (
  destination: vscode.Webview,
  message: EditorEvent
) => {
  destination.postMessage(message);
};

interface ReactManifest {
  mainJSPath: string;
  mainCSSPath: string;
}

const symbolsInDocument = async (
  uri: vscode.Uri
): Promise<vscode.SymbolInformation[]> => {
  const res = await vscode.commands.executeCommand(
    "vscode.executeDocumentSymbolProvider",
    uri
  );
  return res as vscode.SymbolInformation[];
};

const symbolsAtPoint = (
  symbols: vscode.SymbolInformation[],
  p: vscode.Position
): vscode.SymbolInformation[] => {
  return symbols.filter((s) => s.location.range.contains(p));
};

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
