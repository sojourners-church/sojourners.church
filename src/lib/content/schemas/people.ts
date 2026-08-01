import { z } from 'astro/zod';

export const PeopleSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	image: z.string().optional(),
	position: z.string().optional(),
	email: z.email().optional(),
	isGuest: z.boolean(),
	sortPriority: z.number(),
});
