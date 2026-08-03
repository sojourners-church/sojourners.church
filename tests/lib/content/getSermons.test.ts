import { getCollection, getEntry } from 'astro:content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSermons } from '#/lib/content/getters';

vi.mock('astro:content', () => ({
	getCollection: vi.fn(),
	getEntry: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);
const mockGetEntry = vi.mocked(getEntry);

describe('getSermons', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('returns sermons sorted by date', async () => {
		mockGetCollection.mockResolvedValue([
			createSermon('old', '2024-01-01'),
			createSermon('new', '2026-05-01'),
		] as never);

		const sermons = await getSermons();

		expect(sermons.map((s) => s.id)).toEqual(['new', 'old']);
	});

	it('hydrates the series and preacher references using getEntry', async () => {
		const series = { id: 'series-ref', title: 'Romans' };
		const preacher = {
			id: 'preacher-ref',
			name: 'John Doe',
		};

		mockGetCollection.mockResolvedValue([
			createSermon('sermon-1', '2026-01-01', 'series-ref', 'preacher-ref'),
		] as never);

		mockGetEntry.mockResolvedValueOnce(series);
		mockGetEntry.mockResolvedValueOnce(preacher);

		const [result] = await getSermons();

		expect(result.series).toEqual(series);
		expect(result.preacher).toEqual(preacher);
	});

	it('calls getEntry with the correct references', async () => {
		mockGetCollection.mockResolvedValue([
			createSermon('sermon-1', '2026-01-01', 'series-ref', 'preacher-ref'),
		] as never);

		mockGetEntry.mockResolvedValue({});

		await getSermons();

		expect(getEntry).toHaveBeenCalledTimes(2);
		expect(getEntry).toHaveBeenNthCalledWith(1, 'series-ref');
		expect(getEntry).toHaveBeenNthCalledWith(2, 'preacher-ref');
	});
});

const createSermon = (
	id: string,
	date: string,
	series?: string,
	preacher?: string,
) => ({
	id,
	data: {
		date: new Date(date),
		series,
		preacher,
	},
});
