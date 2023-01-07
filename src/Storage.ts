import { Desktop } from "./Desktop";
import { join } from "path";
import fs from "fs";
import JSONdb from "simple-json-db";

export class Storage {
  public static database: JSONdb;

  public static async checkDatabase() {
    const homeDir = Desktop.getHomeDirectory();

    const configDir = join(homeDir, ".matcha-vscode");

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
      fs.writeFileSync(join(configDir, "database.json"), "");

      this.database = new JSONdb(join(configDir, "database.json"), {});

      this.database.set("mangaHistory", {});
    }

    this.database = new JSONdb(join(configDir, "database.json"), {});
  }
  public static insertMangaHistory(data: any): void {
    this.checkDatabase();

    let history: Record<string, any> = this.database.get("mangaHistory");

    history[data.title] = data;

    this.database.set("mangaHistory", history);
  }

  public static getMangaHistory() {
    this.checkDatabase();
    const history = this.database.get("mangaHistory");

    return history;
  }

  public static reset() {
    const homeDir = Desktop.getHomeDirectory();
    const configDir = join(homeDir, ".matcha-vscode");
    fs.rmSync(configDir, { recursive: true, force: true });
  }
}
