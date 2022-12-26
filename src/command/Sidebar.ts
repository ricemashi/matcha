import * as vscode from "vscode";
import { ExplorePanel } from "../views/ExplorePanel";

import { Sidebar } from "../views/Sidebar";
import { Fetcher } from "../Fetcher";
import { ChapterPanel } from "../views/ChapterPanel";

interface ICommand {
  execute(msg: any): void;
}

export class SidebarCommand {
  commands: { [id: string]: ICommand } = {};
  _webview: Sidebar;
  _extensionUri: vscode.Uri;

  _mangaHistory: [number, string][] = [];

  constructor(webview: Sidebar, extensionUri: vscode.Uri) {
    this._webview = webview;
    this._extensionUri = extensionUri;

    this.registerDefaultCommands();
    this.registerMangaCommands();
  }

  register(commandName: string, command: ICommand) {
    this.commands[commandName] = command;
  }

  execute(commandName: string, msg: any) {
    if (commandName in this.commands) {
      this.commands[commandName].execute(msg);
    } else {
      console.log(`Command [${commandName}] not recognised`);
    }
  }

  private registerDefaultCommands() {
    const webview = this._webview;
    const extensionUri = this._extensionUri;

    this.register("open_manga_explorer", {
      execute() {
        ExplorePanel.createOrShow(extensionUri);
      },
    });

    this.register("show_manga_news", {
      async execute() {
        const mangaNewsFeed = await Fetcher.getMangaFeed();

        webview._webview?.webview.postMessage({
          type: "manga_news",
          data: mangaNewsFeed,
        });
      },
    });
  }

  private async registerMangaCommands() {
    const rootThis = this;
    const webview = this._webview;
    const extensionUri = this._extensionUri;

    this.register("show_manga_info", {
      async execute(msg) {
        const mangaInfo = await Fetcher.getMangaInfo(msg.data.manga_id);

        webview._webview?.webview.postMessage({
          type: "manga_info",
          data: mangaInfo,
        });
      },
    });

    this.register("open_manga_chapter", {
      execute: (msg) => {
        rootThis._mangaHistory.push([
          Date.now(),
          `${msg.data.mangaTitle}: ${msg.data.chapterTitle}`,
        ]);
        vscode.window.showInformationMessage(
          `Opening ${msg.data.mangaTitle}: ${msg.data.chapterTitle}`
        );
        ChapterPanel.createOrShow(extensionUri, msg.data.chapterId);
      },
    });
  }

  //   private registerAnimeCommands() {}?
}
