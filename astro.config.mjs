import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://astroship.web3templates.com",
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  // Expose environment variables to the client
  define: {
    'import.meta.env.GOOGLE_TAG_MANAGER_ID': JSON.stringify(process.env.GOOGLE_TAG_MANAGER_ID),
  },
});
