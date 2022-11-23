<script lang="ts">
  import { onMount } from "svelte";
  import { useLazyImage as lazyImage } from "svelte-lazy-image";
  import Fetcher from "../shared/fetcher";

  let mangas: any[] = [];
  let query = "";

  onMount(() => {
    mangaDirectory();
  });

  const mangaDirectory = async () => {
    const data = await Fetcher.getMangaDirectory(1);
    mangas = data.results;
  };

  const searchResults = async () => {
    if (query === "") {
      mangaDirectory();
      return;
    }

    const data = await Fetcher.getMangaSearch(query);
    mangas = data.results;
  };

  const handleImgError = (i: number) => {
    mangas[i].image =
      "https://raw.githubusercontent.com/ricemashi/matcha/main/media/no_image.png";
  };
</script>

<main>
  <form on:submit|preventDefault={searchResults}>
    <div class="relative m-7">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <svg
          aria-hidden="true"
          class="h-5 w-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          /></svg
        >
      </div>
      <input
        type="search"
        id="default-search"
        class="border-none outline-none focus:ring-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:ring-3 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
        placeholder="Search for a manga..."
        bind:value={query}
      />
      <button
        type="submit"
        class="absolute right-2.5 bottom-2.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        on:click={searchResults}>Search</button
      >
    </div>
  </form>

  <div
    class="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2 p-8"
  >
    {#each mangas as manga, i}
      <div class="flex flex-col gap-1 my-2">
        <a href="/" class="bg-green-400">
          <img
            class="hover:translate-x-1 hover:-translate-y-1 delay-50 duration-100 h-80 w-72 bg-no-repeat object-fill"
            src={`https://api.consumet.org/utils/image-proxy?url=${manga.image}&referer=${manga.headerForImage.Referer}`}
            alt={`${manga.id}-image`}
            loading="lazy"
            on:error={() => {
              handleImgError(i);
            }}
            use:lazyImage
          />
        </a>
        <a href="/" class="hover:text-green-400 text-gray-200 font-semibold"
          >{manga.title}</a
        >
      </div>
    {/each}
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
