import { prisma } from '$lib/server/prisma.js';
import type { Expense_t } from '$lib/types.js';
import { PostAuth } from '$lib/utils.js';

export async function POST({ request }) {
	const s = await PostAuth(request);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const data = await request.json();
	if (isDataValid(data)) {
		try {
			const payload = {
				title: data.title,
				amount: data.amount,
				date: data.date,
				tags: data.tags,
				userId: s.userId
			};
			const user = await prisma.user.findUnique({
				where: {
					id: s.userId
				},
				select: {
					yearlyExpenses: true,
					totalExpenses: true
				}
			});
			if (!user) {
				return new Response('User not found', { status: 404 });
			}
			const expense = await prisma.$transaction([
				prisma.expense.create({
					data: payload
				}),
				prisma.user.update({
					where: {
						id: s.userId
					},
					data: {
						yearlyExpenses: {
							...user?.yearlyExpenses,
							[`${new Date(data.date).getFullYear()}`]: user?.yearlyExpenses?.[
								`${new Date(data.date).getFullYear()}`
							]
								? user?.yearlyExpenses?.[`year${new Date(data.date).getFullYear()}`] + data.amount
								: data.amount
						},
						totalExpenses: user?.totalExpenses ? user?.totalExpenses + data.amount : data.amount
					}
				})
			]);
			return new Response(JSON.stringify(expense[0]), { status: 200 });
		} catch (err) {
			if (err instanceof Error) {
				return new Response(err.message, { status: 500 });
			} else {
				return new Response('Internal Server Error', { status: 500 });
			}
		}
	} else {
		return new Response('Missing required fields', { status: 400 });
	}
}

function isDataValid(data: Expense_t) {
	return data.title && data.amount && data.date && data.tags;
}
