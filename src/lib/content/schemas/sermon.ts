import { reference } from 'astro:content';
import { z } from 'astro/zod';

import type { ParseScriptureRefSuccess } from '#/lib/scriptureParsing';
import { parseScriptureRef } from '#/lib/scriptureParsing/parse';

// TODO: Add parsing for verse reference
// TODO: Double check date parsing

export const SermonSchema = z.object({
	title: z.string(),
	date: z.date(),
	series: reference('series'),
	scriptures: z
		.array(z.string())
		.optional()
		.transform((refs, ctx) => {
			if (!refs) return undefined;

			const results: ParseScriptureRefSuccess[] = [];

			const parsed = refs.map(parseScriptureRef);

			parsed.forEach((result, index) => {
				if (!result.ok) {
					ctx.addIssue({
						code: 'custom',
						message: result.error,
						path: [index],
					});
					return;
				}

				results.push(result);
			});

			return ctx.issues.length ? z.NEVER : results;
		}),
	preacher: reference('preachers'),
	mediaURL: z.string().optional(),
	bulletinURL: z.string().optional(),
});
