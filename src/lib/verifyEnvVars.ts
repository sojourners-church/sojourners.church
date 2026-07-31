import 'dotenv/config';

import fs from 'node:fs';
import path from 'node:path';

import type { CollectionEntry } from 'astro:content';
import { parse } from 'yaml';

import type { ConfigCollection, ConfigName } from '#/lib/content/getters';
import type { NavigationFeatureEntry } from '#/lib/content/types/navigation';

export const requireEnv = (name: string) => {
	if (!process.env[name]) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
};

// Getters
export const getConfigFile = <C extends ConfigName>(
	id: C,
): CollectionEntry<ConfigCollection<C>>['data'] => {
	const siteConfigPath = path.resolve(`src/content/config/${id}.yaml`);

	const siteConfig = parse(fs.readFileSync(siteConfigPath, 'utf-8'));

	return siteConfig;
};

export const getFeature = <T extends NavigationFeatureEntry['featureType']>(
	type: T,
): NavigationFeatureEntry | undefined => {
	const navigationEntriesPath = path.resolve(
		'src/content/navigation/primary.yaml',
	);

	const { navigationEntries } = parse(
		fs.readFileSync(navigationEntriesPath, 'utf-8'),
	);

	for (const entry of navigationEntries) {
		if (entry.navigationEntryType === 'feature' && entry.featureType === type)
			return entry;

		if (entry.navigationEntryType === 'group') {
			for (const child of entry.children) {
				if (
					child.navigationEntryType === 'feature' &&
					child.featureType === type
				)
					return child;
			}
		}
	}

	return undefined;
};
