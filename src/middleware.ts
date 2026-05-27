import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	const pathname = context.url.pathname;

	const isStaticFile = pathname.includes(".") || pathname.startsWith("/_");
	const isAdmin = pathname.includes("/admin");
	if (!isAdmin && !isStaticFile) {
		try {
			response.headers.set(
				"Cache-Control",
				"public, max-age=0, s-maxage=31536000, must-revalidate",
			);
		} catch (e) {
			console.warn(`Could not set cache headers for ${pathname}:`, e);
		}
	}

	return response;
});
