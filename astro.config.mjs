// @ts-check
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import resendRouter from "astro-resend-router";

import { verifyRequiredEnvVars } from './src/lib/verifyEnvVars';


// Verify env variables set for active features
verifyRequiredEnvVars();

const { AUTHORIZED_SENDERS } = process.env

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

  integrations: [icon(), sitemap(), resendRouter({
    segments: [
      {
        segmentName: "Sojourners Church",
        segmentSlug: "all",
        segmentId: "5e359778-9923-441e-9d7b-956edd8ebb5e",
        sendFromEmail: {
          name: "Sojourners Church",
          email: "hello@updates.sojourners.church",
        },
        allowPublicJoin: true,
        authorizedSenders:
          AUTHORIZED_SENDERS?.split(",").map((e) => e.trim()) ?? [],
        syncContactsProviders: ["pco"],
      },
      {
        segmentName: "TEST Group",
        segmentSlug: "test",
        segmentId: "720e6fd0-85d1-4745-af43-e6c7e2851b4d",
        sendFromEmail: {
          name: "Sojourners Church",
          email: "hello@updates.sojourners.church",
        },
        allowPublicJoin: true,
        authorizedSenders:
          AUTHORIZED_SENDERS?.split(",").map((e) => e.trim()) ?? [],
      },
    ],
  })],

  adapter: netlify({
    imageCDN: false,
  }),
});
