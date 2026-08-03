import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSeries } from '#/lib/content/getters/getSeries';
import { getSermons } from '#/lib/content/getters/getSermons';

vi.mock('#/lib/content/getters/getSermons', () => ({
	getSermons: vi.fn(),
}));

const mockGetSermons = vi.mocked(getSermons);

describe('getSeries', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('removes duplicate series by id', async () => {
		mockGetSermons.mockResolvedValue([
			{
				series: {
					id: '1',
					data: {
						date: new Date('2025-01-01'),
					},
				},
			},
			{
				series: {
					id: '1',
					data: {
						date: new Date('2025-01-01'),
					},
				},
			},
			{
				series: {
					id: '2',
					data: {
						date: new Date('2025-06-01'),
					},
				},
			},
		] as never);

		const series = await getSeries();

		expect(series).toHaveLength(2);
		expect(series.map((s) => s.id)).toEqual(['2', '1']);
	});

	it('returns series entries sorted by date descending', async () => {
		mockGetSermons.mockResolvedValue([
			{
				series: {
					id: 'old-series',
					data: {
						date: new Date('2025-01-01'),
					},
				},
			},
			{
				series: {
					id: 'new-series',
					data: {
						date: new Date('2025-06-01'),
					},
				},
			},
		] as never);

		const series = await getSeries();

		expect(series.map((entry) => entry.id)).toEqual([
			'new-series',
			'old-series',
		]);
	});
});
