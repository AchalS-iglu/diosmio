import type { Cookies } from '@sveltejs/kit';
import { prisma } from './prisma';

export const AuthCheck = async (cookies: Cookies) => {
	const sessionToken = cookies.get('next-auth.session-token');
	console.log(sessionToken);
	const session = await prisma.session.findUnique({ where: { sessionToken } }).catch((err) => {
		console.log(`Error getting session: ${err}`);
		return false;
	});
	if (!session || session.expires < new Date()) {
		return false;
	}
	return session;
};
