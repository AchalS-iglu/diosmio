import { prisma } from '$lib/server/prisma';
import { GetAuth } from '$lib/server/serverUtils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const s = await GetAuth(cookies);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const payload = await prisma.user
		.findUnique({
			where: {
				id: s.userId
			},
			select: {
				balance: true,
				totalExpenses: true
			}
		})
		.catch((err) => {
			console.log(`Error getting user data for user ${s.userId}: ${err}`);
			return new Response(err, { status: 500 });
		});
	if (!payload) {
		return new Response('No expenses found', {
			status: 404
		});
	}
	return new Response(
		JSON.stringify({
			balance: payload?.balance ?? 0,
			totalExpenses: payload?.totalExpenses ?? 0
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
