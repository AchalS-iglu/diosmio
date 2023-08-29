import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const sessionToken = cookies.get('next-auth.session-token');
	const session = await prisma.session.findUnique({
		where: {
			sessionToken: sessionToken
		}
	});
	if (!session || session.expires < new Date()) {
		return new Response('Unauthorized', {
			status: 401
		});
	}
	const payload = await prisma.user.findUnique({
		where: {
			id: session.userId
		},
		select: {
			yearlyExpenses: true,
			totalExpenses: true
		}
	});
	if (!payload) {
		return new Response('No expenses found', {
			status: 404
		});
	}
	return new Response(
		JSON.stringify({
			yearlyExpenses: payload?.yearlyExpenses ?? {},
			totalExpenses: payload?.totalExpenses ?? 0
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
