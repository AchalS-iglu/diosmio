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
				AUTH_SECRET: string;
				GITHUB_ID: string;
				GITHUB_SECRET: string;
				AUTH_TRUST_HOST: boolean;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
