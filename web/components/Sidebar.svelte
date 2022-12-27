<script lang="ts">
  import { onMount } from "svelte";
  import { merge_ssr_styles } from "svelte/internal";
  import Button from "./Button.svelte";
  import DefaultSidebar from "./DefaultSidebar.svelte";
  import MangaSidebar from "./MangaSidebar.svelte";

  let state: "default" | "manga" | "anime" = "default";
  let mangaId = "";

  onMount(async () => {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      switch (msg.type) {
        case "manga_triggered":
          state = "manga";
          mangaId = msg.data.manga_id;
          break;
      }
    });
  });

  const handleEventDispatcher = (event: any) => {
    if (event.detail.command == "return_to_default_sidebar") {
      state = "default";
    }
  };
</script>

<main>
  {#if state == "default"}
    <DefaultSidebar />
  {:else if state == "manga"}
    <MangaSidebar {mangaId} on:message={handleEventDispatcher} />
  {/if}
</main>
