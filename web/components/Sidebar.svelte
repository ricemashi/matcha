<script lang="ts">
  import Button from "./Button.svelte";
</script>

<main>
  <!-- svelte-ignore missing-declaration -->
  <Button
    on:click={() => tsvscode.postMessage({ type: "test", value: "test" })}
    variant="primary">Start Reading</Button
  >
  <!-- svelte-ignore missing-declaration -->
  <Button
    on:click={() => tsvscode.postMessage({ type: "test", value: "test" })}
    variant="secondary">Explore Library</Button
  >
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
