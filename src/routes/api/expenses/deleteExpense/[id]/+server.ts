import { prisma } from '$lib/server/prisma';
import { PostAuth } from '$lib/server/serverUtils.js';

export async function DELETE({ params, request }) {
	console.log(JSON.stringify(request.headers));
	const s = await PostAuth(request);
	if (!s) return new Response('Unauthorized', { status: 401 });
	// const expense = await prisma.expense
	// 	.delete({
	// 		where: {
	// 			id: params.id
	// 		}
	// 	})
	// 	.catch((err) => {
	// 		return new Response(err, { status: 500 });
	// 	});
	const expense = await prisma.expense.findUnique({
		where: {
			id: params.id
		},
		select: {
			amount: true,
			id: true
		}
	});
	if (!expense) return new Response('Not Found', { status: 404 });
	const res = await prisma.$transaction([
		prisma.expense.delete({
			where: {
				id: params.id
			}
		}),
		prisma.user.update({
			where: {
				id: s.userId
			},
			data: {
				totalExpenses: {
					decrement: expense.amount
				},
				balance: {
					increment: expense.amount
				}
			}
		})
	]);
	if (!res) return new Response('Not Found', { status: 404 });
	return new Response(JSON.stringify(expense), { status: 200 });
}
