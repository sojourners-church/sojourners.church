import { z } from 'astro/zod';

export const TeamSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	image: z.string().optional(),
	position: z.string().optional(),
	email: z.email().optional(),
});
