import { prisma } from '$lib/server/prisma';
import { PostAuth } from '$lib/server/serverUtils.js';

export async function POST({ request }) {
	const s = await PostAuth(request);
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
	const currentTotal = await prisma.user.findUnique({
		where: {
			id: s.userId
		},
		select: {
			totalExpenses: true
		}
	});
	const res = await prisma.user
		.update({
			where: {
				id: s.userId
			},
			data: {
				totalExpenses: currentTotal
					? type === 'add'
						? currentTotal.totalExpenses + amount
						: currentTotal.totalExpenses - amount
					: amount
			}
		})
		.catch((err) => {
			console.log(`Error updating totalExpenses for user ${s.userId}: ${err}`);
			return new Response(err, {
				status: 500
			});
		});
	if (!res)
		return new Response('Not Found', {
			status: 404
		});

	return new Response(
		JSON.stringify({
			balance: res.totalExpenses
		}),
		{
			status: 200
		}
	);
}
