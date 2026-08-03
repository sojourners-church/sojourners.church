import { getEntry } from 'astro:content';
import { AstroError } from 'astro/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getConfig } from '#/lib/content/getters';

vi.mock('astro:content', () => ({
	getEntry: vi.fn(),
}));

const mockGetEntry = vi.mocked(getEntry);

describe('getConfig', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns config data', async () => {
		const data = {
			title: 'My Title',
		};

		mockGetEntry.mockResolvedValue({ data });

		await expect(getConfig('site')).resolves.toEqual(data);
		expect(mockGetEntry).toHaveBeenCalledWith('config:site', 'site');
	});

	it.each([
		['site', 'config:site'],
		['homepage', 'config:homepage'],
		['footer', 'config:footer'],
		['team', 'config:team'],
		['theme', 'config:theme'],
		['navigation', 'config:nav'],
	] as const)('uses the correct collection for %s', async (filename, collection) => {
		mockGetEntry.mockResolvedValue({ data: {} });

		await getConfig(filename);

		expect(mockGetEntry).toHaveBeenCalledWith(collection, filename);
	});

	it('throws when the config entry is missing', async () => {
		mockGetEntry.mockResolvedValue(undefined);

		await expect(getConfig('site')).rejects.toThrow(AstroError);
		await expect(getConfig('site')).rejects.toThrow(
			'Error retrieving site collection.',
		);
	});
});
