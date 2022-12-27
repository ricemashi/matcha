<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Loader from "./Loader.svelte";
  import Button from "./Button.svelte";

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
    loaded = false;
    tsvscode.postMessage({
      type: "manga",
      data: {
        command: "show_manga_info",
        manga_id: mangaId,
      },
    });
  }

  const showMangaChapter = (chapter: any) => {
    tsvscode.postMessage({
      type: "manga",
      data: {
        command: "open_manga_chapter",
        mangaTitle: manga.title,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
      },
    });
  };

  const handleImgError = () => {
    manga.image =
      "https://raw.githubusercontent.com/ricemashi/matcha/main/media/no_image.png";
  };

  const dispatch = createEventDispatcher();

  const returnToMenu = () => {
    dispatch("message", {
      command: "return_to_default_sidebar",
    });
  };
</script>

<main class:mangaId>
  <Loader {loaded}>
    <div
      class="mb-4 h-72 object-scale-down w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1"
    >
      <img
        src={`https://api.consumet.org/utils/image-proxy?url=${manga.image}&referer=${manga.headers.Referer}`}
        alt="manga_image"
        class="object-cover w-full h-full rounded-sm"
        on:error={() => {
          handleImgError();
        }}
      />
    </div>
    <h1 class="text-center text-lg font-bold mb-1">{manga.title}</h1>
    <p class="text-center text-base text-slate-400">{manga.authors}</p>

    <div class="my-4 flex flex-col gap-2 h-72 overflow-y-scroll scrollbar-hide">
      {#each manga.chapters as chapter}
        <div>
          <a
            on:click={() => showMangaChapter(chapter)}
            href="/"
            class=" text-base font-light hover:text-green-400"
            >{chapter.title}</a
          >
          <p class="text-xs dark:text-slate-400">{chapter.releasedDate}</p>
        </div>
      {/each}
    </div>

    <Button
      extraStyle="my-2"
      variant="accent"
      on:click={() => showMangaChapter(manga.chapters.at(0))}
      >Latest Chapter</Button
    >
    <Button
      extraStyle="my-2"
      variant="accentTwo"
      on:click={() => showMangaChapter(manga.chapters.at(-1))}
      >First Chapter</Button
    >

    <Button extraStyle="my-2" variant="secondary" on:click={returnToMenu}
      >Back to Main</Button
    >
  </Loader>
</main>
