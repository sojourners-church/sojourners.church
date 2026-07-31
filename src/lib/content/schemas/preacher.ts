import { z } from 'astro/zod';

export const PreacherSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	isGuest: z.boolean(),
	sortPriority: z.number(),
	image: z.string().optional(),
});
