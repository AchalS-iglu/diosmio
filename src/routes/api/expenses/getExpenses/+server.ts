import { USER } from '$env/static/private';
import { prisma } from '$lib/server/prisma.js';
import { AuthCheck } from '$lib/server/serverUtils.js';

export async function GET({ locals, url }) {
	const s = await AuthCheck(locals);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const start = new Date(url.searchParams.get('start'));
	const end = new Date(url.searchParams.get('end'));
	console.log(start, end);
	if (isNaN(start.getTime()) || isNaN(end.getTime())) {
		return new Response('Invalid date', {
			status: 400
		});
	}
	const expenses = await prisma.expense
		.findMany({
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
		})
		.catch((err) => {
			return new Response(err, {
				status: 500
			});
		});

	if (!expenses) {
		return new Response('No expenses found', {
			status: 404
		});
	}

	return new Response(JSON.stringify(expenses), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
