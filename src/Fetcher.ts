/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";
import { apiBaseUrl } from "./Constants";
import { extractKey } from "./Util";

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

  public static async getMangaChapters(chapterId: string) {
    const chapterPages: any[] = [];
    const url = `${apiBaseUrl.manga}/manga/${chapterId}/1.html`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          cookie: "isAdult=1",
        },
      });

      const $ = load(data);

      const copyrightHandle =
        $("p.detail-block-content").text().match("Dear user") ||
        $("p.detail-block-content").text().match("blocked");
      if (copyrightHandle) {
        throw Error(copyrightHandle.input?.trim());
      }

      const bar = $("script[src*=chapter_bar]").data();
      const html = $.html();
      if (typeof bar !== "undefined") {
        const ss = html.indexOf("eval(function(p,a,c,k,e,d)");
        const se = html.indexOf("</script>", ss);
        const s = html.substring(ss, se).replace("eval", "");
        const ds = eval(s) as string;

        const urls = ds.split("['")[1].split("']")[0].split("','");

        urls.map((url, i) =>
          chapterPages.push({
            page: i,
            img: `https:${url}`,
            headerForImage: { Referer: url },
          })
        );
      } else {
        let sKey = extractKey(html);
        const chapterIdsl = html.indexOf("chapterid");
        const chapterId = html
          .substring(chapterIdsl + 11, html.indexOf(";", chapterIdsl))
          .trim();

        const chapterPagesElmnt = $(
          "body > div:nth-child(6) > div > span"
        ).children("a");

        const pages = parseInt(
          chapterPagesElmnt.last().prev().attr("data-page") ?? "0"
        );

        const pageBase = url.substring(0, url.lastIndexOf("/"));

        let resText = "";
        for (let i = 1; i <= pages; i++) {
          const pageLink = `${pageBase}/chapterfun.ashx?cid=${chapterId}&page=${i}&key=${sKey}`;

          for (let j = 1; j <= 3; j++) {
            const { data } = await axios.get(pageLink, {
              headers: {
                Referer: url,
                "X-Requested-With": "XMLHttpRequest",
                cookie: "isAdult=1",
              },
            });

            resText = data as string;

            if (resText) {
              break;
            } else {
              sKey = "";
            }
          }

          const ds = eval(resText.replace("eval", ""));

          const baseLinksp = ds.indexOf("pix=") + 5;
          const baseLinkes = ds.indexOf(";", baseLinksp) - 1;
          const baseLink = ds.substring(baseLinksp, baseLinkes);

          const imageLinksp = ds.indexOf("pvalue=") + 9;
          const imageLinkes = ds.indexOf('"', imageLinksp);
          const imageLink = ds.substring(imageLinksp, imageLinkes);

          chapterPages.push({
            page: i - 1,
            img: `https:${baseLink}${imageLink}`,
            headerForImage: { Referer: url },
          });
        }
      }
      return chapterPages;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
