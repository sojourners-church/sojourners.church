import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getConfig } from '#/lib/content/getters/getConfig';
import {
	getFeatureNavigationEntry,
	getPageNavigationEntries,
} from '#/lib/content/getters/getNavigation';

vi.mock('#/lib/content/getters/getConfig', () => ({
	getConfig: vi.fn(),
}));

const mockGetConfig = vi.mocked(getConfig);

describe('getPageNavigationEntries', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('returns top level page entries', async () => {
		const page = {
			navigationEntryType: 'page',
			label: 'Home',
		};

		mockGetConfig.mockResolvedValue({
			navigationEntries: [page],
		});

		await expect(getPageNavigationEntries()).resolves.toEqual([page]);
	});

	it('includes page entries inside groups', async () => {
		const page = {
			navigationEntryType: 'page',
			label: 'Home',
		};

		mockGetConfig.mockResolvedValue({
			navigationEntries: [
				{
					navigationEntryType: 'group',
					children: [
						page,
						{
							navigationEntryType: 'feature',
							featureType: 'blog',
						},
					],
				},
			],
		});

		await expect(getPageNavigationEntries()).resolves.toEqual([page]);
	});

	it('ignores non-page entries', async () => {
		mockGetConfig.mockResolvedValue({
			navigationEntries: [
				{
					navigationEntryType: 'feature',
					featureType: 'blog',
				},
			],
		});

		await expect(getPageNavigationEntries()).resolves.toEqual([]);
	});

	it('returns an empty array when no page entries exist', async () => {
		mockGetConfig.mockResolvedValue({
			navigationEntries: [],
		});

		await expect(getPageNavigationEntries()).resolves.toEqual([]);
	});
});

describe('getFeatureNavigationEntries', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('finds a top-level feature', async () => {
		const feature = {
			navigationEntryType: 'feature',
			featureType: 'blog',
		};

		mockGetConfig.mockResolvedValue({
			navigationEntries: [feature],
		});

		await expect(getFeatureNavigationEntry('blog')).resolves.toBe(feature);
	});

	it('finds a feature inside a group', async () => {
		const feature = {
			navigationEntryType: 'feature',
			featureType: 'calendar',
		};

		mockGetConfig.mockResolvedValue({
			navigationEntries: [
				{
					navigationEntryType: 'group',
					children: [feature],
				},
			],
		});

		await expect(getFeatureNavigationEntry('calendar')).resolves.toBe(feature);
	});

	it('returns undefined when no matching feature exists', async () => {
		mockGetConfig.mockResolvedValue({
			navigationEntries: [],
		});

		await expect(getFeatureNavigationEntry('blog')).resolves.toBeUndefined();
	});

	it('returns the first matching feature', async () => {
		const first = {
			navigationEntryType: 'feature',
			featureType: 'blog',
			id: 1,
		};

		const second = {
			navigationEntryType: 'feature',
			featureType: 'blog',
			id: 2,
		};

		mockGetConfig.mockResolvedValue({
			navigationEntries: [first, second],
		});

		await expect(getFeatureNavigationEntry('blog')).resolves.toBe(first);
	});
});
