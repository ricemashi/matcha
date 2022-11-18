import axios from "axios";

export class Fetcher {
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
}
