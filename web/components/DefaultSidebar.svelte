<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let feeds: any[] = [];

  onMount(async () => {
    tsvscode.postMessage({
      type: "manga_news",
      data: "",
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

  const dispatchOpenExplorer = () => {
    tsvscode.postMessage({ type: "open_explorer", data: "open_explorer" });
  };
  const dispatchMangaQuote = () => {
    tsvscode.postMessage({ type: "manga_quote", data: "manga_quote" });
  };
</script>

<main>
  <div class="flex flex-col gap-4 my-3">
    <h1 class="text-xl font-bold mb-2">Quick Actions</h1>
    <Button on:click={dispatchOpenExplorer} variant="primary"
      >Start Reading</Button
    >
    <Button on:click={dispatchOpenExplorer} variant="secondary"
      >Explore Library</Button
    >
  </div>

  <div class="flex flex-col gap-4 my-12 overflow-y-scroll">
    <h1 class="text-xl font-bold mb-4">Animanga News</h1>

    <div class="flex flex-col gap-4 h-96 overflow-y-scroll scrollbar-hide">
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

  <div class="mt-5">
    <h5 class="mb-5 text-xl font-bold tracking-tight ">
      Want a quote from your favorite manga/anime characters?
    </h5>
    <button
      type="button"
      class="text-white bg-gradient-to-r from-yellow-600 to-red-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 "
      on:click={dispatchMangaQuote}>Suprise me</button
    >
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
