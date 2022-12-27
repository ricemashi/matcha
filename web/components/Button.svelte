<script lang="ts">
  export let variant: "primary" | "secondary" | "accent" | "accentTwo" =
    "primary";
  export let extraStyle: string = "";

  let variantStyle: string;

  const variantType = {
    primary:
      "from-green-400 via-green-500 to-green-600 focus:ring-green-300 dark:focus:ring-green-800 ",
    secondary:
      "from-red-400 via-red-500 to-red-600 focus:ring-red-300 dark:focus:ring-red-800",
    accentTwo:
      "bg-gradient-to-bl from-green-400 to-blue-600 focus:ring-green-200 dark:focus:ring-green-800",
    accent:
      "bg-gradient-to-br from-green-400 to-blue-600 focus:ring-green-200 dark:focus:ring-green-800",
  };

  switch (variant) {
    case "primary":
      variantStyle = variantType["primary"];
      break;
    case "secondary":
      variantStyle = variantType["secondary"];
      break;
    case "accent":
      variantStyle = variantType["accent"];
      break;
    case "accentTwo":
      variantStyle = variantType["accentTwo"];
      break;
    default:
      variantStyle = "";
  }

  $: style = variantStyle;
</script>

<main>
  <button
    class="text-white w-full bg-gradient-to-r {style} {extraStyle} focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-3.5 text-center mr-2"
    type="button"
    class:variant
    class:extraStyle
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
