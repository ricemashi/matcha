/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";
import { apiBaseUrl } from "./Constants";

export class Fetcher {
  public static async getMangaQuote() {
    const { data } = await axios.get(`${apiBaseUrl.quote}/api/random`);
    return data;
  }

  public static async getMangaSearch(query: string) {
    const { data } = await axios.get(
      `${apiBaseUrl.service}/manga/mangahere/${query}`
    );

    return data;
  }

  public static async getMangaDirectory(page: number) {
    const result: Record<string, any> = {};

    try {
      const { data } = await axios.get(
        `${apiBaseUrl.manga}/directory/${page}.htm`
      );
      const $ = load(data);

      result.hasNextPage =
        $("div.pager-list-left > a.active").next().text() !== ">";

      result.results = $("div.container > div > div > ul > li")
        .map((_i, el) => ({
          id: $(el).find("a").attr("href")?.split("/")[2]!,
          title: $(el).find("p.manga-list-1-item-title > a").text(),
          subTitle: $(el).find("p.manga-list-1-item-subtitle > a").text(),
          image: $(el).find("a > img").attr("src"),
          headerForImage: { Referer: apiBaseUrl.manga },
        }))
        .get();

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  public static async getMangaInfo(id: string) {
    const { data } = await axios.get(
      `${apiBaseUrl.service}/manga/mangahere/info?id=${id}`
    );

    return data;
  }

  public static async getMangaFeed() {
    const result: Record<string, any> = [];

    try {
      const { data } = await axios.get(
        `${apiBaseUrl.news}/news/rss.xml?ann-edition=us`
      );
      const json = new XMLParser().parse(data);
      const { item } = json.rss.channel;

      for (let i = 0; i < 10; i++) {
        const x = item[i];

        result.push({
          title: x.title,
          link: x.link,
          guid: x.guid,
          description: x.description.replace(/(<([^>]+)>)/gi, ""),
          pubDate: x.pubDate,
        });
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return result;
  }
}
