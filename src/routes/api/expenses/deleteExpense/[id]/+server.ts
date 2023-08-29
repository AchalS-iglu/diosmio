import { prisma } from '$lib/server/prisma';
import { PostAuth } from '$lib/server/serverUtils.js';

export async function DELETE({ params, request }) {
	console.log(JSON.stringify(request.headers));
	const s = await PostAuth(request);
	if (!s) return new Response('Unauthorized', { status: 401 });
	const expense = await prisma.expense
		.delete({
			where: {
				id: params.id
			}
		})
		.catch((err) => {
			return new Response(err, { status: 500 });
		});
	if (!expense) return new Response('Not Found', { status: 404 });
	return new Response(JSON.stringify(expense), { status: 200 });
}
