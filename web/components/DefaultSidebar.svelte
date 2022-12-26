<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let feeds: any[] = [];

  onMount(async () => {
    tsvscode.postMessage({
      type: "default",
      data: {
        command: "show_manga_news",
      },
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_news":
          feeds = msg.data;
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

  // const dispatchMangaQuote = () => {
  //   tsvscode.postMessage({ type: "default", data: {command: "manga_quote"} });
  // };
</script>

<main>
  <div class="flex flex-col gap-4 my-3">
    <h1 class="text-xl font-bold mb-2">Quick Actions</h1>
    <Button on:click={openMangaExplorer} variant="primary">Start Reading</Button
    >
    <Button on:click={openMangaExplorer} variant="secondary"
      >Explore Library</Button
    >
  </div>

  <div class="flex flex-col gap-4 my-12 overflow-y-scroll">
    <h1 class="text-xl font-bold mb-4">Animanga News</h1>

    <div class="flex flex-col gap-4 h-72 overflow-y-scroll scrollbar-hide">
      {#each feeds as feed, i}
        <div class="my-1">
          <a href={feed.link}>
            <h2
              class="font-medium text-md mb-2 hover:text-green-400 cursor-pointer"
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
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
