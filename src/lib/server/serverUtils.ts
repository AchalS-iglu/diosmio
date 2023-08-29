import type { Cookies } from "@sveltejs/kit";
import { prisma } from "./prisma";

export const PostAuth = async (request: Request) => {
	const sessionToken = request.headers.get('Authorization')?.split(' ')[1];
	const session = await prisma.session.findUnique({
		where: {
			sessionToken: sessionToken
		}
	});
	if (!session || session.expires < new Date()) {
		return false;
	}
	return session;
};

export const GetAuth = async (cookies: Cookies) => {
	const sessionToken = cookies.get('next-auth.session-token');
	const session = await prisma.session.findUnique({
		where: {
			sessionToken: sessionToken
		}
	});
	if (!session || session.expires < new Date()) {
		return false;
	}
	return session;
};
