// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { siteConfig } from "./src/config/site";

const SITE = import.meta.env.PROD ? siteConfig.url : "http://localhost:4321";
// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), sitemap()],
  adapter: cloudflare(),
  site: SITE,
	output: "server",
	prefetch: {
		prefetchAll: true,
	},
	server: {
		port: 4321,
	},
  experimental: {
    advancedRouting: true,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});