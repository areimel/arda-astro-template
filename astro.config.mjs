import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://ardastro.template.com",
  integrations: [
    mdx(), 
    sitemap({
      // AI-optimized sitemap configuration
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Include all dynamic routes for AI discovery
      customPages: [
        'https://ardastro.template.com/',
        'https://ardastro.template.com/blog',
        'https://ardastro.template.com/case-studies', 
        'https://ardastro.template.com/products',
        'https://ardastro.template.com/careers',
        'https://ardastro.template.com/styleguide',
        'https://ardastro.template.com/about',
        'https://ardastro.template.com/contact',
        'https://ardastro.template.com/pricing'
      ]
    }),
    icon()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // Expose environment variables to the client
  define: {
    'import.meta.env.GOOGLE_TAG_MANAGER_ID': JSON.stringify(process.env.GOOGLE_TAG_MANAGER_ID),
  },
});
