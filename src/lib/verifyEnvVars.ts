import 'dotenv/config';

import fs from 'node:fs';
import path from 'node:path';

import type { CollectionEntry } from 'astro:content';
import { parse } from 'yaml';

import type { ConfigCollection, ConfigFileName } from './content/getters';
import type { NavigationFeatureEntry } from './content/types/navigation';

export const verifyRequiredEnvVars = () => {
	if (getConfigFile('footer').subscribe?.isActive) {
		requireEnv('RESEND_API_KEY');
		requireEnv('RESEND_SEGMENT_ID');
	}
	if (navigationFeatureIsActive('calendar')) {
		requireEnv('PUBLIC_GOOGLE_CALENDAR_API_KEY');
		requireEnv('PUBLIC_GOOGLE_CALENDAR_ID');
	}
};

const requireEnv = (name: string) => {
	if (!process.env[name]) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
};

const getConfigFile = <C extends ConfigFileName>(
	filename: C,
): CollectionEntry<ConfigCollection<C>>['data'] => {
	const siteConfigPath = path.resolve(`src/content/config/${filename}.yaml`);

	const siteConfig = parse(fs.readFileSync(siteConfigPath, 'utf-8'));

	return siteConfig;
};

const navigationFeatureIsActive = <
	T extends NavigationFeatureEntry['featureType'],
>(
	type: T,
): boolean => {
	const { navigationEntries } = getConfigFile('navigation');

	for (const entry of navigationEntries) {
		if (entry.navigationEntryType === 'feature' && entry.featureType === type)
			return true;

		if (entry.navigationEntryType === 'group') {
			for (const child of entry.children) {
				if (
					child.navigationEntryType === 'feature' &&
					child.featureType === type
				)
					return true;
			}
		}
	}

	return false;
};
