'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function sampleServerAction() {
	console.log('Creating User');
	await prisma.user.create({
		data: {}
	});

	revalidatePath('/');
}
