<script lang="ts">
  import { onMount } from "svelte";

  export let mangaId: string;
  let manga: Record<string, any> = {};
  let loaded = false;

  onMount(() => {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_info":
          manga = msg.data;
          loaded = true;
          break;
      }
    });
  });

  $: {
    tsvscode.postMessage({
      type: "manga_info",
      data: {
        manga_id: mangaId,
      },
    });
  }

  const dispatchMangaChapter = (chapterId: string, chapterTitle: string) => {
    tsvscode.postMessage({
      type: "open_manga_chapter",
      data: {
        mangaTitle: manga.title,
        chapterId,
        chapterTitle,
      },
    });
  };

  const handleImgError = () => {
    manga.image =
      "https://raw.githubusercontent.com/ricemashi/matcha/main/media/no_image.png";
  };
</script>

<main class:mangaId>
  {#if loaded}
    <div
      class="mb-5 h-96 object-scale-down w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1"
    >
      <img
        src={`https://api.consumet.org/utils/image-proxy?url=${manga.image}&referer=${manga.headers.Referer}`}
        alt="manga_image"
        class="object-cover w-full rounded-sm"
        on:error={() => {
          handleImgError();
        }}
      />
    </div>
    <h1 class="text-center text-lg font-bold mb-1">{manga.title}</h1>
    <p class="text-center text-base text-slate-400">{manga.authors}</p>

    <div class="my-8 flex flex-col gap-2 h-72 overflow-y-scroll scrollbar-hide">
      {#each manga.chapters as chapter}
        <div>
          <a
            on:click={() => dispatchMangaChapter(chapter.id, chapter.title)}
            href="/"
            class="hover:text-green-400 text-base text-gray-200 font-light"
            >{chapter.title}</a
          >
          <p class="text-xs text-slate-400">{chapter.releasedDate}</p>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
</style>
