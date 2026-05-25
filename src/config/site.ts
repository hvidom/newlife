export const siteConfig = {
	// Basic site info
	title: "Newlife",
	author: "hvidom",
	description: "New astro project",
	url: "https://newlife.devopsick.workers.dev/",

	// SEO & Metadata
	defaultLocale: "en",
	twitter: {
		creator: undefined,
		site: undefined,
	},
	defaultOgImage: "/og-image.png",

	// Navigation
	navigation: [{ href: "/", label: "Home" }],
};

export type SiteConfig = typeof siteConfig;