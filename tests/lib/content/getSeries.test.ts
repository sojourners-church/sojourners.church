import { getCollection } from 'astro:content';
import { describe, expect, it, vi } from 'vitest';

import { getSeries } from '#/lib/content/getters';

vi.mock('astro:content', () => ({
	getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

describe('getSeries', () => {
	it('returns series entries sorted by date descending', async () => {
		mockGetCollection.mockResolvedValue([
			{
				id: 'old-series',
				data: {
					date: new Date('2025-01-01'),
				},
			},
			{
				id: 'new-series',
				data: {
					date: new Date('2025-06-01'),
				},
			},
		] as never);

		const series = await getSeries();

		expect(getCollection).toHaveBeenCalledWith('series');

		expect(series.map((entry) => entry.id)).toEqual([
			'new-series',
			'old-series',
		]);
	});
});
