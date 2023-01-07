<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let feeds: any[] = [];
  let history: {
    manga: any[];
    anime: any[];
  } = {
    manga: [],
    anime: [],
  };

  onMount(async () => {
    tsvscode.postMessage({
      type: "default",
      data: {
        command: "show_manga_news",
      },
    });

    tsvscode.postMessage({
      type: "default",
      data: {
        command: "show_history",
      },
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_news":
          feeds = msg.data;
          break;
        case "history":
          history.manga = Object.values(msg.data.manga);
          break;
      }
    });
  });

  const openMangaExplorer = () => {
    tsvscode.postMessage({
      type: "default",
      data: {
        command: "open_manga_explorer",
      },
    });
  };

  const openAnimeExplorer = () => {
    tsvscode.postMessage({
      type: "default",
      data: {
        command: "open_anime_explorer",
      },
    });
  };

  const showMangaChapter = (manga: any) => {
    tsvscode.postMessage({
      type: "manga",
      data: {
        command: "open_manga_chapter",
        manga: manga.chapter.manga,
        chapterIndex: manga.chapter.chapterIdx,
        chapterId: manga.chapter.chapterId,
        chapterTitle: manga.chapter.chapterTitle,
      },
    });
  };
</script>

<main>
  <div class="flex flex-col gap-4 my-3">
    <h1 class="text-xl font-bold mb-2">Quick Actions</h1>
    <Button on:click={openMangaExplorer} variant="primary">Start Reading</Button
    >
    <Button on:click={openAnimeExplorer} variant="secondary"
      >Explore Anime</Button
    >
  </div>

  <div class="flex flex-col gap-4 my-6 overflow-y-scroll">
    <h1 class="text-xl font-bold mb-4">Animanga News</h1>

    <div class="flex flex-col gap-4 h-72 overflow-y-scroll scrollbar-hide">
      {#each feeds as feed, i}
        <div class="my-1">
          <a href={feed.link}>
            <h2
              class="font-medium text- mb-2 hover:text-green-400 cursor-pointer"
            >
              {feed.title}
            </h2>
          </a>
          <span class="text-sm">{feed.description}</span>
        </div>
        {#if i < feeds.length - 1}
          <span
            class="rounded-md  p-0.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 "
          />
        {/if}
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-4 my-7 overflow-y-scroll">
    <h1 class="text-xl font-bold">Continue Reading</h1>

    <div class="inline-flex  w-full rounded-md " role="group">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        type="button"
        class="py-2 px-4 text-sm  w-full font-medium cursor-pointer bg-transparent rounded-l-lg border border-gray-500  hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white  dark:hover:bg-gray-700 dark:focus:bg-gray-700"
      >
        Anime
      </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        type="button"
        class="py-2 px-4 text-sm w-full font-medium cursor-pointer bg-transparent rounded-r-md border border-gray-500 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white  dark:hover:bg-gray-700 dark:focus:bg-gray-700"
      >
        Manga
      </a>
    </div>

    <div
      class="flex flex-col mt-1.5 gap-4 h-48 overflow-y-scroll scrollbar-hide"
    >
      {#each history.manga as manga, i}
        <div class="my-0.5">
          <a
            on:click={() => showMangaChapter(manga)}
            href="/"
            class=" text-base font-light hover:text-green-400">{manga.title}</a
          >
          <p class="text-xs dark:text-slate-400">
            {manga.chapter.chapterTitle}
          </p>
        </div>
      {/each}
    </div>
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
