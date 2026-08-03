// @ts-check
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';
import icon from 'astro-icon';

import { verifyRequiredEnvVars } from './src/lib/verifyEnvVars';

// Verify env variables set for active features
verifyRequiredEnvVars();

//biome-ignore-start lint/complexity/useLiteralKeys: fine here
const SITE_URL =
	process.env['CONTEXT'] === 'production'
		? process.env['URL']
		: process.env['DEPLOY_PRIME_URL'];
//biome-ignore-end lint/complexity/useLiteralKeys: fine here

// https://astro.build/config
export default defineConfig({
	site: SITE_URL ?? 'http://localhost:4321',
	trailingSlash: 'ignore',
	base: '/',

	build: {
		format: 'directory',
	},

	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Poppins',
			cssVariable: '--font-sans',
			subsets: ['latin'],
		},
	],

	env: {
		schema: {
			RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
			RESEND_SEGMENT_ID: envField.string({
				context: 'server',
				access: 'secret',
			}),
			PUBLIC_GOOGLE_CALENDAR_ID: envField.string({
				context: 'client',
				access: 'public',
			}),
			PUBLIC_GOOGLE_CALENDAR_API_KEY: envField.string({
				context: 'client',
				access: 'public',
			}),
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [icon(), sitemap()],

	// image: {
	//   layout: 'constrained',
	// },

	adapter: netlify({
		imageCDN: false,
	}),
});
