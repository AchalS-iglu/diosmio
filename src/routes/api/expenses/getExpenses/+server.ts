import { USER } from '$env/static/private';
import { prisma } from '$lib/server/prisma.js';

export async function GET(request) {
	const sessionToken = request.cookies.get('next-auth.session-token');
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
	const start = new Date(
		request.url.searchParams.get('start') || new Date().toISOString().split('T')[0]
	);
	const end = new Date(
		request.url.searchParams.get('end') || new Date().toISOString().split('T')[0]
	);
	const expenses = await prisma.expense.findMany({
		where: {
			userId: session.userId,
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
