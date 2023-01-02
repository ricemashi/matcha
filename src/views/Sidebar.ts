import * as vscode from "vscode";
import { apiBaseUrl } from "../Constants";
import EventEmitterHandler from "../Emitter";

import { getNonce } from "../Util";
import { SidebarCommand } from "../command/Sidebar";

export class Sidebar implements vscode.WebviewViewProvider {
  public _webview?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext
  ) {
    if (!this._webview) {
      this._webview = webviewView;
    }

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    const command = new SidebarCommand(this, this._extensionUri);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type !== "default" || "manga" || "anime") {
        command.execute(msg.data.command, msg);
      }
    });

    EventEmitterHandler.getInstance().on("manga_triggered", (msg) => {
      webviewView.webview.postMessage({
        type: "manga_triggered",
        data: msg.data,
      });
    });

    EventEmitterHandler.getInstance().on("change_manga_chapter", (msg) => {
      command.execute("open_manga_chapter", msg);
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "sidebar.css")
    );

    const nonce = getNonce();

    return `
        <!DOCTYPE html>
		<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src; connect-src ${apiBaseUrl.news}; img-src https: data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
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
}
