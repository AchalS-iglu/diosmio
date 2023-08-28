// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
				GITHUB_ID: string;
				GITHUB_SECRET: string;
				GOOGLE_ID: string;
				GOOGLE_SECRET: string;
				AUTH_SECRET: string;
				AUTH_TRUST_HOST: string;
				DB_URL: string;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
