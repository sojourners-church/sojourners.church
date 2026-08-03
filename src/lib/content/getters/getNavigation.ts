import type {
	NavigationEntry,
	NavigationFeatureEntry,
} from '#/lib/content/types/navigation';

import { getConfig } from './getConfig';

export const getPageNavigationEntries = async () => {
	const { navigationEntries } = await getConfig('navigation');

	const pageEntries = [];

	for (const entry of walkNavigation(navigationEntries)) {
		if (entry.navigationEntryType === 'page') {
			pageEntries.push(entry);
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

	for (const entry of walkNavigation(navigationEntries)) {
		if (entry.navigationEntryType === 'feature' && entry.featureType === type) {
			return entry;
		}
	}

	return undefined;
};

function* walkNavigation(
	entries: readonly NavigationEntry[],
): IterableIterator<NavigationEntry> {
	for (const entry of entries) {
		yield entry;

		if (entry.navigationEntryType === 'group') {
			yield* walkNavigation(entry.children);
		}
	}
}
