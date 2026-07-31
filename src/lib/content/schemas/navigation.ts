import { reference } from 'astro:content';
import { z } from 'astro/zod';

const BaseEntrySchema = z.object({
	label: z.string(),
});

const PageEntrySchema = BaseEntrySchema.extend({
	navigationEntryType: z.literal('page'),
	page: reference('pages'),
});

const FeatureEntrySchema = BaseEntrySchema.extend({
	navigationEntryType: z.literal('feature'),
	featureType: z.enum(['blog', 'calendar', 'sermons', 'team']),
	customSlug: z.string().slugify().optional(),
});

const ExternalEntrySchema = BaseEntrySchema.extend({
	navigationEntryType: z.literal('external'),
	url: z.url(),
});

const GroupEntrySchema = BaseEntrySchema.extend({
	navigationEntryType: z.literal('group'),
	children: z.array(
		z.discriminatedUnion('navigationEntryType', [
			PageEntrySchema,
			FeatureEntrySchema,
			ExternalEntrySchema,
		]),
	),
});

export const NavigationEntrySchema = z.object({
	navigationEntries: z.array(
		z.discriminatedUnion('navigationEntryType', [
			PageEntrySchema,
			FeatureEntrySchema,
			ExternalEntrySchema,
			GroupEntrySchema,
		]),
	),
});
