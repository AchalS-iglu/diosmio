import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {
	AUTH_SECRET,
	AUTH_TRUST_HOST,
	GITHUB_ID,
	GITHUB_SECRET,
	GOOGLE_ID,
	GOOGLE_SECRET
} from '$env/static/private';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '$lib/server/prisma';

async function authorization({ event, resolve }) {
	// Protect any routes under /authenticated
	if (event.url.pathname == '/home') {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/welcome');
		}
	} else if (event.url.pathname == '/welcome') {
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
			}),
			Google({
				clientId: GOOGLE_ID,
				clientSecret: GOOGLE_SECRET
			})
		],
		secret: AUTH_SECRET,
		trustHost: AUTH_TRUST_HOST == 'true' ? true : false,
		adapter: PrismaAdapter(prisma),
		callbacks: {
			session: async ({ session, token, user }) => {
				if (session?.user) {
					session.user.userId = user.id;
				}
				return session;
			}
		}
	}),
	authorization
);
