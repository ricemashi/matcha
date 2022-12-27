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

  _animeHistory: Record<string, any> = {};
  _mangaHistory: Record<string, any> = {};

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
    const rootThis = this;
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

    this.register("show_history", {
      async execute() {
        webview._webview?.webview.postMessage({
          type: "history",
          data: {
            manga: rootThis._mangaHistory,
            anime: rootThis._animeHistory,
          },
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
        rootThis._mangaHistory[msg.data.mangaTitle] = {
          title: msg.data.mangaTitle,
          chapter: msg.data.chapterTitle,
          chapterId: msg.data.chapterId,
        };
        vscode.window.showInformationMessage(
          `Opening ${msg.data.mangaTitle}: ${msg.data.chapterTitle}`
        );
        ChapterPanel.createOrShow(extensionUri, msg.data.chapterId);
      },
    });
  }

  //   private registerAnimeCommands() {}?
}
