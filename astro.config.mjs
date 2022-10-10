import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://booker-king-portfolio.vercel.app",
  integrations: [react(), tailwind(), sitemap()],
  output: "static",
  adapter: vercel(),

  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
