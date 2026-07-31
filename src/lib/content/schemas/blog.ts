import { z } from 'astro/zod';

export const BlogSchema = z.object({
	title: z.string(),
	date: z.date(),
	tags: z.array(z.string()).min(1),
});
