import * as vscode from "vscode";
import { ExplorePanel } from "../views/ExplorePanel";
import { Storage } from "../Storage";
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
    const webview = this._webview;
    const extensionUri = this._extensionUri;

    this.register("open_manga_explorer", {
      execute() {
        ExplorePanel.createOrShow(extensionUri);
      },
    });

    this.register("open_anime_explorer", {
      execute() {
        vscode.window.showInformationMessage(
          `Currently under production, please wait!`
        );
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
        const mangaHistory = Storage.getMangaHistory();
        webview._webview?.webview.postMessage({
          type: "history",
          data: {
            manga: mangaHistory,
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
        const manga = msg.data.manga;
        const index = msg.data.chapterIndex;
        const nextChapter = manga.chapters[index - 1]?.id;
        const prevChapter = manga.chapters[index + 1]?.id;

        const context = {
          manga,
          chapterTitle: manga.chapters[index].title,
          chapterId: manga.chapters[index].id,
          previousChapter: prevChapter === undefined ? null : index + 1,
          nextChapter: nextChapter === undefined ? null : index - 1,
          chapterIdx: index,
        };

        rootThis._mangaHistory[manga.title] = {
          chapter: context,
          title: manga.title,
        };

        Storage.insertMangaHistory({
          chapter: context,
          title: manga.title,
        });

        vscode.window.showInformationMessage(
          `Opening ${manga.title}: ${context.chapterTitle}`
        );

        ChapterPanel.createOrShow(extensionUri, context);
      },
    });
  }
}
