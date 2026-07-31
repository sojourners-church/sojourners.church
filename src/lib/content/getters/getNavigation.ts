import type { NavigationFeatureEntry } from '#/lib/content/types/navigation';

import { getConfig } from './getConfig';

export const getPageNavigationEntries = async () => {
	const { navigationEntries } = await getConfig('navigation');

	const pageEntries = [];

	for (const entry of navigationEntries) {
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
	const { navigationEntries } = await getConfig('navigation');

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
