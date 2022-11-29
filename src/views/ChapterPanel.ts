import * as vscode from "vscode";
import { apiBaseUrl } from "../Constants";
import { Fetcher } from "../Fetcher";
import { getNonce } from "../Util";

export class ChapterPanel {
  public static currentPanel: ChapterPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _chapterId: string;

  private _disposables: vscode.Disposable[] = [];

  constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    chapterId: string
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._chapterId = chapterId;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: vscode.Uri, chapterId: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (ChapterPanel.currentPanel) {
      ChapterPanel.currentPanel._panel.reveal(column);
      ChapterPanel.currentPanel._chapterId = chapterId;
      ChapterPanel.currentPanel._update();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "chapter-panel",
      "Chapter",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,

        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out"),
        ],
      }
    );

    ChapterPanel.currentPanel = new ChapterPanel(
      panel,
      extensionUri,
      chapterId
    );
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);

    const chapterData = await Fetcher.getMangaChapters(this._chapterId);

    this._panel.webview.postMessage({
      type: "manga_chapter",
      data: chapterData,
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "chapter-panel.js")
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "chapter-panel.css")
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
    ChapterPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
