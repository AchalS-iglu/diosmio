import { prisma } from '$lib/server/prisma.js';
import type { Expense_t } from '$lib/types.js';
import { getSession } from '@auth/sveltekit';
import { error } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();
	if (isDataValid(data)) {
		try {
			const expense = await prisma.expense.create({
				data: {
					title: data.title,
					amount: data.amount,
					date: data.date,
					tags: data.tags,
					userId: data.userId
				}
			});
			return new Response(JSON.stringify(expense), { status: 200 });
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
	return data.title && data.amount && data.date && data.tags && data.userId;
}
