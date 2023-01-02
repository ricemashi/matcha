<!-- svelte-ignore missing-declaration -->
<script lang="ts">
  import { onMount } from "svelte";
  import { useLazyImage as lazyImage } from "svelte-lazy-image";
  import Loader from "./Loader.svelte";
  import Button from "./Button.svelte";

  let result: Record<string, any>;

  let loaded = false;

  onMount(async () => {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_chapter":
          result = msg.data;
          loaded = true;
          break;
      }
    });
  });

  const changeMangaChapter = (idx: number) => {
    tsvscode.postMessage({
      type: "manga",
      data: {
        command: "change_manga_chapter",
        manga: result.manga,
        chapterIndex: idx,
      },
    });
  };
</script>

<main>
  <Loader {loaded}>
    <div class="flex flex-col justify-center sm:px-10 lg:px-40">
      <h1 class="text-xl font-bold my-3">
        {result.manga.title}: {result.chapterTitle}
      </h1>

      <div class="flex gap-3 mb-4">
        {#if result.previousChapter != null}
          <Button on:click={() => changeMangaChapter(result.previousChapter)}
            >Previous Chapter</Button
          >
        {/if}

        {#if result.nextChapter != null}
          <Button on:click={() => changeMangaChapter(result.nextChapter)}
            >Next Chapter</Button
          >
        {/if}
      </div>

      {#each result.pages as page}
        <img
          src={`https://api.consumet.org/utils/image-proxy?url=${page.img}&referer=${page.headerForImage.Referer}`}
          alt={`manga_chapter_${page.page}`}
          use:lazyImage
          loading="lazy"
          class="align-middle max-w-full"
        />
      {/each}

      <div class="flex gap-3 my-4">
        {#if result.previousChapter != null}
          <Button on:click={() => changeMangaChapter(result.previousChapter)}
            >Previous Chapter</Button
          >
        {/if}

        {#if result.nextChapter != null}
          <Button on:click={() => changeMangaChapter(result.nextChapter)}
            >Next Chapter</Button
          >
        {/if}
      </div>
    </div>
  </Loader>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
