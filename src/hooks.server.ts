import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '$lib/server/prisma';
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private';

async function authorization({ event, resolve }) {
	// Protect any routes under /authenticated
	if (event.url.pathname == '/home') {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/login');
		}
	} else if (
		event.url.pathname == '/login' ||
		event.url.pathname == '/register' ||
		event.url.pathname == '/welcome'
	) {
		const session = await event.locals.getSession();
		if (session) {
			throw redirect(303, '/home');
		}
	}
	// If the request is still here, just proceed as normally
	return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [
			GitHub({
				clientId: GITHUB_ID,
				clientSecret: GITHUB_SECRET
			})
		],
		secret: AUTH_SECRET,
		adapter: PrismaAdapter(prisma),
		trustHost: true,
		debug: true
	}),
	authorization
);
