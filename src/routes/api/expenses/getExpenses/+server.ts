import { USER } from '$env/static/private';
import { prisma } from '$lib/server/prisma.js';
import { GetAuth } from '$lib/server/serverUtils.js';

export async function GET({ cookies, url }) {
	const s = await GetAuth(cookies);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const start = new Date(url.searchParams.get('start') || new Date().toISOString().split('T')[0]);
	const end = new Date(url.searchParams.get('end') || new Date().toISOString().split('T')[0]);
	const expenses = await prisma.expense.findMany({
		where: {
			userId: s.userId,
			date: {
				gte: start,
				lte: end
			}
		},
		orderBy: {
			date: 'desc'
		}
	});

	if (!expenses) {
		return new Response('No expenses found', {
			status: 404
		});
	}

	return new Response(JSON.stringify(expenses), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
