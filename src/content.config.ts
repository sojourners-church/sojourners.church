import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { BlogSchema } from './lib/content/schemas/blog';
import {
	ConfigFooterSchema,
	ConfigHomepageSchema,
	ConfigSiteSchema,
	ConfigTeamSchema,
	ConfigThemeSchema,
} from './lib/content/schemas/config';
import { NavigationEntrySchema } from './lib/content/schemas/navigation';
import { PeopleSchema } from './lib/content/schemas/people';
import { SeriesSchema } from './lib/content/schemas/series';
import { SermonSchema } from './lib/content/schemas/sermon';

const configSite = defineCollection({
	loader: glob({ pattern: 'site.yaml', base: './src/content/config' }),
	schema: ConfigSiteSchema,
});

const configHomepage = defineCollection({
	loader: glob({ pattern: 'homepage.yaml', base: './src/content/config' }),
	schema: ConfigHomepageSchema,
});

const configFooter = defineCollection({
	loader: glob({ pattern: 'footer.yaml', base: './src/content/config' }),
	schema: ConfigFooterSchema,
});

const configTeam = defineCollection({
	loader: glob({ pattern: 'team.yaml', base: './src/content/config' }),
	schema: ConfigTeamSchema,
});

const configTheme = defineCollection({
	loader: glob({ pattern: 'theme.yaml', base: './src/content/config' }),
	schema: ConfigThemeSchema,
});

const configNavigation = defineCollection({
	loader: glob({ pattern: 'navigation.yaml', base: './src/content/config' }),
	schema: NavigationEntrySchema,
});

const pagesCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
	schema: z.object({
		title: z.string(),
		type: z.enum(['blog', 'events', 'sermons']).optional(),
	}),
});

const peopleCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
	schema: PeopleSchema,
});

const seriesCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
	schema: SeriesSchema,
});

const sermonCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/sermons' }),
	schema: SermonSchema,
});

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: BlogSchema,
});

export const collections = {
	'config:site': configSite,
	'config:homepage': configHomepage,
	'config:footer': configFooter,
	'config:team': configTeam,
	'config:theme': configTheme,
	'config:nav': configNavigation,
	pages: pagesCollection,
	people: peopleCollection,
	series: seriesCollection,
	sermons: sermonCollection,
	blog: blogCollection,
};
