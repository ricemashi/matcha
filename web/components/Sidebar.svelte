<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";
  import DefaultSidebar from "./DefaultSidebar.svelte";
  import MangaSidebar from "./MangaSidebar.svelte";

  let isMangaClicked = false;
  let manga_id = "";

  onMount(async () => {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_triggered":
          isMangaClicked = true;
          manga_id = msg.data.manga_id;
          break;
      }
    });
  });

  const backToMenu = () => {
    isMangaClicked = false;
  };
</script>

<main>
  {#if isMangaClicked}
    <MangaSidebar mangaId={manga_id} />
    <Button on:click={backToMenu}>Back to Main</Button>
  {:else}
    <DefaultSidebar />
  {/if}
</main>
