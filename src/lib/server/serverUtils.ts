import type { Cookies } from '@sveltejs/kit';
import { prisma } from './prisma';

export const AuthCheck = async (locals: App.Locals) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return false;
	}
	return session?.user;
};
