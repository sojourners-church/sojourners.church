import { reference } from 'astro:content';
import { z } from 'astro/zod';

const BaseSectionSchema = z.object({
	heading: z.string(),
	content: z.string(),
});

export const ConfigSiteSchema = z.object({
	churchName: z.object({
		name: z.string(),
		showInHeader: z.boolean().default(true),
	}),
	churchDescription: z.string(),
	churchLogo: z
		.object({
			image: z.string(),
			showInHeader: z.boolean().default(true),
		})
		.optional(),
	socials: z
		.array(
			z.object({
				name: z.string(),
				icon: z.string(),
				link: z.url(),
				tooltip: z.string().optional(),
				showInFooter: z.boolean().default(true),
			}),
		)
		.optional(),
});

export const ConfigHomepageSchema = z.object({
	hero: z
		.object({
			text: z.object({
				code: z.string(),
			}),
			bgImage: z.string().optional(),
		})
		.optional(),
	cta: z
		.object({
			text: z.object({
				code: z.string(),
			}),
			link: z.url().optional(),
		})
		.optional(),
});

export const ConfigFooterSchema = z.object({
	sections: z.array(BaseSectionSchema).optional(),
	subscribe: BaseSectionSchema.extend({
		isActive: z.boolean().default(true),
	}).optional(),
	giving: BaseSectionSchema.extend({
		isActive: z.boolean().default(true),
		link: z.url(),
	}).optional(),
});

export const ConfigTeamSchema = z.object({
	pageTitle: z.string(),
	pageDescription: z.string(),
	sections: z
		.array(
			z.object({
				name: z.string(),
				description: z.string().optional(),
				entries: z.array(reference('team')),
			}),
		)
		.optional(),
});

export const ConfigThemeSchema = z.object({
	customCss: z.object({
		code: z.string(),
	}),
});
