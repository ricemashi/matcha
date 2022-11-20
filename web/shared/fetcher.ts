/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import { load } from "cheerio";

class Fetcher {
  public baseUrl = "http://www.mangahere.cc";
  public serviceBaseUrl = "https://api.consumet.org";

  public async getMangaChapter(chapterId: string) {
    const { data } = await axios.get(
      `${this.serviceBaseUrl}/manga/mangahere/read?chapterId=${chapterId}`
    );

    return data;
  }

  public async getMangaDetails(mangaId: string) {
    const { data } = await axios.get(
      `${this.serviceBaseUrl}/manga/mangahere/info?id=${mangaId}`
    );

    return data;
  }

  public async getMangaSearch(query: string) {
    const { data } = await axios.get(
      `${this.serviceBaseUrl}/manga/mangahere/${query}`
    );
    return data;
  }

  public async getMangaDirectory(page: number) {
    const result: Record<string, any> = {};

    try {
      const { data } = await axios.get(`${this.baseUrl}/directory/${page}.htm`);
      const $ = load(data);

      result.hasNextPage =
        $("div.pager-list-left > a.active").next().text() !== ">";

      result.results = $("div.container > div > div > ul > li")
        .map((_i, el) => ({
          id: $(el).find("a").attr("href")?.split("/")[2]!,
          title: $(el).find("p.manga-list-1-item-title > a").text(),
          subTitle: $(el).find("p.manga-list-1-item-subtitle > a").text(),
          image: $(el).find("a > img").attr("src"),
          headerForImage: { Referer: this.baseUrl },
        }))
        .get();

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export default new Fetcher();
