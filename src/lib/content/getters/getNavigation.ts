import { type CollectionEntry, getEntry } from 'astro:content';

import type { NavigationFeatureEntry } from '#/lib/content/types/navigation';

export const getNavigation = async (
	id: string,
): Promise<CollectionEntry<'nav'>['data']['navigationEntries']> => {
	const res = await getEntry('nav', id);

	if (!res) {
		throw new Error(`Missing required entry "${String(id)}" in "nav".`);
	}

	return res.data.navigationEntries;
};

export const getPageNavigationEntries = async () => {
	const entries = await getNavigation('primary');

	const pageEntries = [];

	for (const entry of entries) {
		if (entry.navigationEntryType === 'page') pageEntries.push(entry);

		if (entry.navigationEntryType === 'group') {
			for (const child of entry.children) {
				if (child.navigationEntryType === 'page') pageEntries.push(child);
			}
		}
	}

	return pageEntries;
};

export const getFeatureNavigationEntry = async <
	T extends NavigationFeatureEntry['featureType'],
>(
	type: T,
): Promise<NavigationFeatureEntry | undefined> => {
	const entries = await getNavigation('primary');

	for (const entry of entries) {
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
