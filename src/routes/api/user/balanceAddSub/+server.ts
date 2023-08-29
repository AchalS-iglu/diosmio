import { prisma } from '$lib/server/prisma';
import { PostAuth } from '$lib/utils.js';

export async function POST({ request, cookies }) {
	const s = await PostAuth(cookies);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const { amount, type } = await request.json();
	if (isNaN(amount)) {
		return new Response('Amount is not a number', {
			status: 400
		});
	} else if (amount < 0) {
		return new Response('Amount is negative', {
			status: 400
		});
	} else if (type !== 'add' && type !== 'sub') {
		return new Response('Type is not add or sub', {
			status: 400
		});
	}
	const res = await prisma.user
		.update({
			where: {
				id: s.userId
			},
			data: {
				balance: {
					[type === 'add' ? 'increment' : 'decrement']: amount
				}
			}
		})
		.catch((err) => {
			console.log(err);
			return new Response(err, {
				status: 500
			});
		});
	return new Response(JSON.stringify(res), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
