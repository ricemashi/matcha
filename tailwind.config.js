/* eslint-disable @typescript-eslint/naming-convention */
const production = !process.env.ROLLUP_WATCH;
module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },

  plugins: [],
  theme: {
    extend: {
      backgroundSize: {
        fullPercent: "100% 100%",
      },
    },
  },
  content: ["./web/**/*.svelte"],
};
