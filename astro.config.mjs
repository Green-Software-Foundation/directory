import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";
import redirectsData from "./redirects.json";

const redirects = Object.fromEntries(
  redirectsData.map(({ from, to }) => [from, to])
);

// https://astro.build/config
export default defineConfig({
  redirects,
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
});
