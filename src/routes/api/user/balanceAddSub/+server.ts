import { prisma } from '$lib/server/prisma';
import { AuthCheck } from '$lib/server/serverUtils.js';

export async function POST({ request, locals }) {
	const s = await AuthCheck(locals);
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
	const currentBalance = await prisma.user
		.findUnique({
			where: {
				id: s.userId
			},
			select: {
				balance: true
			}
		})
		.catch((err) => {
			console.log(`Error getting balance for user ${s.userId}: ${err}`);
			return new Response(err, {
				status: 500
			});
		})
		.catch((err) => {
			console.log(`Error getting balance for user ${s.userId}: ${err}`);
			new Response(err, {
				status: 500
			});
		});
	const res = await prisma.user
		.update({
			where: {
				id: s.userId
			},
			data: {
				balance: currentBalance
					? type === 'add'
						? currentBalance.balance + amount
						: currentBalance.balance - amount
					: amount
			}
		})
		.catch((err) => {
			console.log(`Error updating balance for user ${s.userId}: ${err}`);
			return new Response(err, {
				status: 500
			});
		});
	return new Response(
		JSON.stringify({
			balance: res.balance
		}),
		{
			status: 200
		}
	);
}
