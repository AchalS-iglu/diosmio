import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export async function POST({ request }) {
	// const sessionToken = req.cookies['next-auth.session-token'];
	const sessionToken = request.headers.get('Authorization')?.split(' ')[1];
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
	const { amount, type } = await request.json();
	if (isNaN(amount)) {
		return new Response('Amount is not a number', {
			status: 400
		});
	} else if (amount < 0) {
		return new Response('Amount is negative', {
			status: 400
		});
	}
	if (type == 'add') {
		await prisma.user
			.update({
				where: {
					id: session.userId
				},
				data: {
					balance: {
						increment: amount
					}
				}
			})
			.then(() => {
				return new Response('OK', {
					status: 200
				});
			})
			.catch((err) => {
				console.log(err);
				return new Response(err, {
					status: 500
				});
			});
	} else if (type == 'sub') {
		await prisma.user
			.update({
				where: {
					id: session.userId
				},
				data: {
					balance: {
						decrement: amount
					}
				}
			})
			.then(() => {
				return new Response('OK', {
					status: 200
				});
			})
			.catch((err) => {
				console.log(err);
				return new Response(err, {
					status: 500
				});
			});
	}
	return new Response('Invalid type', {
		status: 400
	});
}
