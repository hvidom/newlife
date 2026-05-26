export const siteConfig = {
	// Basic site info
	title: "Newlife",
	author: "hvidom",
	description: "New astro project",
	url: "https://newlifeintegration.ie",

	// SEO & Metadata
	defaultLocale: "en",
	twitter: {
		creator: undefined,
		site: undefined,
	},
	defaultOgImage: "/fallback.png",

	// Navigation
	navigation: [{ href: "/", label: "Home" }],
};

export type SiteConfig = typeof siteConfig;
