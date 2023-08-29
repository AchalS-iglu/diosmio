import { prisma } from "$lib/server/prisma";

async function DELETE({ params, headers }) {
	try {
		const expense = await prisma.expense.delete({
			where: {
				id: params.id
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
}
