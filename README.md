cat << 'EOF' > README.md

# 🌿 New Life Integration Website & API Platform

A high-performance, edge-ready web application and community management platform built for **New Life Integration & Wellbeing Network CLG** (Ireland). This repository marks a transition to a lightning-fast, hybrid architecture powered by **Astro 6**, **Hono**, and **Cloudflare Pages**, entirely managed using **Bun**.

---

## 🛠️ Tech Stack & Resources

| Technology | Purpose | Documentation |
| :--- | :--- | :--- |
| **Astro v6** | Hybrid Web Framework (Static Pages + Edge SSR API) | [astro.build](https://astro.build/) |
| **Hono v4** | Ultra-fast Router for Edge API Endpoints | [hono.dev](https://hono.dev/) |
| **Cloudflare Pages** | Serverless Edge Hosting & Cloudflare Workers | [pages.cloudflare.com](https://pages.cloudflare.com/) |
| **Bun** | Ultra-fast Runtime, Package Manager & Bundler | [bun.sh](https://bun.sh/) |
| **Tailwind v4** | CSS Framework (Vite Engine & Native CLI) | [tailwindcss.com](https://tailwindcss.com/) |
| **Shadcn UI** | Accessible & Composable React UI Components | [ui.shadcn.com](https://ui.shadcn.com/) |
| **Biome** | High-performance Linter, Formatter & Type Checker | [biomejs.dev](https://biomejs.dev/) |

---

## 📦 Key Packages & Architecture Explained

Based on the project's production architecture, here is how the core dependencies work together:

* **`astro/hono` (Advanced Routing):** Transforms the entire Astro application into a unified Hono instance. Hono acts as the central middleware layer and API router, while passing frontend requests directly to Astro’s page-rendering engine.
* **`@astrojs/cloudflare`:** The official Astro adapter that compiles the entire codebase (pages, styles, and Hono server) into an optimized, single Cloudflare Pages Worker.
* **`shadcn` & `React 19`:** Powers advanced client-side components like interactive contact logs, multi-step branch application fields, and animated layout inputs.
* **`wrangler`:** The native Cloudflare CLI tool used for type generation, environment variable binding, and local edge-runtime emulation.

---

## 📂 API Routes & Integrations (`src/app.ts`)

The server side uses a modular Hono architecture to handle client requests securely without exposing secret credentials to the frontend. It integrates natively with **Brevo CRM & SMTP Services**:

* **`POST /api/contact`**: Validates incoming public inquiries. It automatically upserts the user into the Brevo CRM (List ID `3`: *website*) and concurrently dispatches transactional summary emails to both the NLI administration group and the user.
* **`POST /api/open-branch`**: Processes "Expression of Interest" submissions for new community branches across Ireland, securely parsing applicant backgrounds, language proficiencies, and regional data before pushing updates to Brevo.
* **`POST /api/subscribe`**: A fast, minimal hook designed for quick newsletter subscriptions, safely logging emails directly into CRM automation funnels.

---

## 🚀 Getting Started

### Environment Setup

Create a `.env` file in the root directory of your project to store local secret tokens

---

### Development

## Install dependencies using Bun

bun install

## Start the local development server

bun run dev

## 🚀 Development & Core Commands

| Command | Script | Description |
| :--- | :--- | :--- |
| `bun run start` | `bun run generate-types && bun run astro dev --verbose | Generates Cloudflare type bindings and boots the local Vite development server with detailed log outputs. |
| `bun run dev` | `bun astro dev` | Starts the local development server utilizing Bun execution for maximum speed with hot-module reloading (HMR). |
| `bun run sync` | `astro sync` | Synchronizes Astro definitions, building local ambient types for content and page routing structures. |
| `bun run astro` | `astro` | A CLI passthrough enabling the execution of arbitrary Astro commands directly (e.g., `bun run astro --help`). |

---

## 📦 Build & Preview Pipelines

| Command | Script | Description |
| :--- | :--- | :--- |
| `bun run build` | `bun run generate-types && bun run sync && bun run astro build && bun run build:tailwind && bun run build:postcss` | Production Build Pipeline. Generates system types, executes standalone compilation for Cloudflare Pages Workers, and fully minifies static bundles and CSS stylesheets. |
| `bun run generate-types` | `wrangler types` | Scans the local environment context and dynamically generates worker-configuration.d.ts types for strict Cloudflare bindings. |

---

## 🎨 Stylesheet Compilation

*Note: While Tailwind CSS v4 runs smoothly through the Vite plugin in dev mode, these production pipeline scripts ensure strict post-processing build distribution compliance.*

| Command | Script | Description |
| :--- | :--- | :--- |
| `bun run build:tailwind` | `bun x @tailwindcss/cli -i src/styles/global.css -o dist/global.css --minify` | Compiles standalone Tailwind v4 utility classes via the native Tailwind CLI, generating an optimized and minified global stylesheet in `dist/`. |
| `bun run build:postcss` | `postcss dist/global.css -o dist/global.css` | Passes the compiled stylesheet through PostCSS to seamlessly apply specific vendor transforms or plugins in-place. |

---


---

## 🔧 Maintenance

| Command | Script | Description |
| :--- | :--- | :--- |
| **`bun run browserslist`** | `bunx update-browserslist-db@latest` | Updates your local `caniuse-lite` database target indices, keeping CSS autoprefixing completely updated to current vendor browser builds. |

---

## 🛠️ Stack Summary

* **Framework Engine:** Astro v6 (configured in SSR `standalone` Node.js execution mode).
* **Component Ecosystem:** React 19 + Shadcn UI components optimized via `class-variance-authority` and `tailwind-merge`.
* **Styling Architecture:** Tailwind CSS v4 running via native Vite compiler plugins (`@tailwindcss/vite`).
* **Hosting Platform::** Cloudflare Pages (Serverless static assets with underlying SSR Workers integration via @astrojs/cloudflare).
* **Formatting Engine:** Biome JS running directly inside Bun execution paths for fast static analysis.
* **Runtime Environment:** Bun (Edge-ready engine optimizing dependency trees and deployment pipelines).
