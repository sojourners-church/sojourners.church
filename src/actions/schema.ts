import { z } from 'astro/zod';

export const SubscribeSchema = z.object({
	firstName: z.preprocess(
		(value) => (value === null ? '' : value),
		z.string().trim().min(2, 'Must be at least 2 characters.'),
	),
	lastName: z.preprocess(
		(value) => (value === null ? '' : value),
		z.string().trim().min(2, 'Must be at least 2 characters.'),
	),
	email: z.preprocess(
		(value) => (value === null ? '' : value),
		z.email('Enter a valid email address.'),
	),
	_gotcha: z.string().optional(),
});

export type SubscribeSchemaType = z.infer<typeof SubscribeSchema>;
