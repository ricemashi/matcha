<script lang="ts">
  export let variant: "primary" | "secondary" = "primary";

  let variantStyle: string;

  const variantType = {
    primary:
      "from-green-400 via-green-500 to-green-600 focus:ring-green-300 dark:focus:ring-green-800 ",
    secondary:
      "from-red-400 via-red-500 to-red-600 focus:ring-red-300 dark:focus:ring-red-800",
  };

  switch (variant) {
    case "primary":
      variantStyle = variantType["primary"];
      break;
    case "secondary":
      variantStyle = variantType["secondary"];
      break;
    default:
      variantStyle = "";
  }

  $: style = variantStyle;
</script>

<main>
  <button
    class="text-white w-full bg-gradient-to-r {style} hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center mr-2"
    type="button"
    class:variant
    on:click
  >
    <slot />
  </button>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
