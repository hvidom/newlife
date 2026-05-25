/// <reference types="astro/client" />

interface Env {
	BREVO_API_KEY: string;
}

interface Runtime {
	env: Env;
}

declare namespace App {
	interface Locals extends Runtime {}
}
