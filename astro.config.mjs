// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site";
import partytown from "@astrojs/partytown";

const SITE = process.env.NODE_ENV === "production" ? siteConfig.url : "http://localhost:4321";
// https://astro.build/config
export default defineConfig({
    integrations: [react(), mdx(),  
        sitemap({
        entryLimit: 10000,
        }), 
        partytown({
        config: {
          forward: ['dataLayer.push', 'gtag']
        }
      })],
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
    },
});