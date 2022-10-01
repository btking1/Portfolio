import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
// https://astro.build/config
export default defineConfig({
  site: "https://booker-king-portfolio.vercel.app",
  integrations: [react(), tailwind()],
  output: "server",
  adapter: vercel(),
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
});
