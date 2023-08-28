import { DATABASE_URL } from '$env/static/private';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
