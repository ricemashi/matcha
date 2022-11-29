<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";
  import DefaultSidebar from "./DefaultSidebar.svelte";
  import MangaSidebar from "./MangaSidebar.svelte";

  let isMangaClicked = false;
  let mangaId = "";

  // const state = {
  //   manga_sidebar: false,
  //   manga_id: "",
  // };

  onMount(async () => {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_triggered":
          const prevState = tsvscode.getState();

          console.log(prevState);

          isMangaClicked = true;
          mangaId = msg.data.manga_id;

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
    <MangaSidebar {mangaId} />
    <Button on:click={backToMenu}>Back to Main</Button>
  {:else}
    <DefaultSidebar />
  {/if}
</main>
