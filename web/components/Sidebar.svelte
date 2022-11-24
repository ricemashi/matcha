<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let text: string = "No emit";

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      console.log("take 1");
      switch (message.type) {
        case "manga_info": {
          text = "emmited";
          break;
        }
      }
    });
  });

  const dispatchInfo = () => {
    tsvscode.postMessage({ type: "test", value: "test" });
  };
</script>

<main>
  <div class="flex flex-col gap-4 my-3">
    <h1 class="text-xl font-bold mb-2">Quick Actions</h1>
    <Button on:click={dispatchInfo} variant="primary">Start Reading</Button>
    <Button on:click={dispatchInfo} variant="secondary">Explore Library</Button>
  </div>

  <div class="flex flex-col gap-4 my-10">
    <h1 class="text-xl font-bold mb-2">Latest News</h1>
    <div class="my-1">
      <h2 class="font-medium text-md mb-2 hover:text-green-400 cursor-pointer">
        Kaminaki Sekai no Kamisama Katsudō Anime Reveals Cast, Staff, 2023
        Premiere
      </h2>
      <span class="text-sm"
        >Junya Enoki, Akari Kitō star in anime by Studio Palette</span
      >
    </div>
    <span
      class="rounded-md w-full p-0.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 lg:w-1/3"
    />
    <div class="my-1">
      <h2 class="font-medium text-md mb-2 hover:text-green-400 cursor-pointer">
        Live-Action Touken Ranbu Film Sequel's Teaser Reveals More Cast, March
        31 Opening
      </h2>
      <span class="text-sm"
        >Akira Emoto, Kanji Tsuda, Terunosuke Takezai join cast in film set in
        Heian era Kyoto</span
      >
    </div>
    <span
      class="rounded-md w-full p-0.5 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 lg:w-1/3"
    />
    <div class="my-1">
      <h2 class="font-medium text-md mb-2 hover:text-green-400 cursor-pointer">
        Reiji Kaitо̄'s Shinigami Tantei Elria no Kai Manga Ends in December
      </h2>
      <span class="text-sm"
        >6th volume of manga about "Parallel Consciousness" personalities ships
        on January 10</span
      >
    </div>
  </div>

  <div class="my-10">
    <a href="/">
      <h5
        class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Want a quote from your favorite manga/anime characters?
      </h5>
    </a>
    <p class="mb-4 text-base text-gray-700 dark:text-gray-400">
      This button below will toast out some facts and quotes.
    </p>
    <button
      type="button"
      class="text-white bg-gradient-to-r from-yellow-600 to-red-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 "
      >Suprise me</button
    >
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
