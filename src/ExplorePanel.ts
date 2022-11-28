import * as vscode from "vscode";
import { apiBaseUrl } from "./Constants";
import EventEmitterHandler from "./Emitter";
import { Fetcher } from "./Fetcher";
import { getNonce } from "./Util";

export class Panel {
  public static currentPanel: Panel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;

  private _disposables: vscode.Disposable[] = [];

  constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (Panel.currentPanel) {
      Panel.currentPanel._panel.reveal(column);
      Panel.currentPanel._update();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "explore-panel",
      "Explore",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,

        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out"),
        ],
      }
    );

    Panel.currentPanel = new Panel(panel, extensionUri);
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);

    webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case "manga_triggered":
          EventEmitterHandler.getInstance().emit("manga_triggered", msg);
          break;
        case "change_manga_directory":
          const mangaSearchedDirectory = await Fetcher.getMangaSearch(
            msg.data.query
          );
          webview.postMessage({
            type: "change_manga_directory",
            data: mangaSearchedDirectory,
          });
          break;
        case "manga_directory":
          const mangaDirectory = await Fetcher.getMangaDirectory(1);

          this._panel.webview.postMessage({
            type: "manga_directory",
            data: mangaDirectory,
          });
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "explore-panel.js")
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "explore-panel.css")
    );

    const nonce = getNonce();

    return `
        <!DOCTYPE html>
		<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src; connect-src ${apiBaseUrl.manga} ${apiBaseUrl.service}; img-src https: data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">

                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                </script>
            </head>
            <body>

            </body>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </html>`;
  }
  public dispose() {
    Panel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
