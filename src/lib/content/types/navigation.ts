import type { InferEntrySchema } from 'astro:content';

export type NavigationEntry =
	InferEntrySchema<'nav'>['navigationEntries'][number];

export type NavigationPageEntry = Extract<
	NavigationEntry,
	{ navigationEntryType: 'page' }
>;
export type NavigationFeatureEntry = Extract<
	NavigationEntry,
	{ navigationEntryType: 'feature' }
>;
export type NavigationExternalEntry = Extract<
	NavigationEntry,
	{ navigationEntryType: 'external' }
>;
