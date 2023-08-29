import { prisma } from '$lib/server/prisma';
import { GetAuth } from '$lib/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const s = await GetAuth(cookies);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const payload = await prisma.user.findUnique({
		where: {
			id: s.userId
		},
		select: {
			yearlyExpenses: true,
			totalExpenses: true,
			balance: true
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
			totalExpenses: payload?.totalExpenses ?? 0,
			balance: payload?.balance ?? 0
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
