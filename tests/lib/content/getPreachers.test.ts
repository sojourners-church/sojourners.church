import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('#/lib/content/getters/getSermons', () => ({
	getSermons: vi.fn(),
}));

import { getPreachers } from '#/lib/content/getters/getPreachers';
import { getSermons } from '#/lib/content/getters/getSermons';

const mockGetSermons = vi.mocked(getSermons);

describe('getPreachers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('removes duplicate preachers by id', async () => {
		mockGetSermons.mockResolvedValue([
			{
				preacher: {
					id: '1',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: '1',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: '2',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
		] as never);

		const preachers = await getPreachers();

		expect(preachers).toHaveLength(2);
		expect(preachers.map((p) => p.id)).toEqual(['1', '2']);
	});

	it('places non-guest preachers before guests', async () => {
		mockGetSermons.mockResolvedValue([
			{
				preacher: {
					id: '1',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: true,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: '2',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: true,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: '3',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
		] as never);

		const preachers = await getPreachers();

		expect(preachers.map((p) => p.id)).toEqual(['3', '1', '2']);
	});

	it('sorts by sortPriority', async () => {
		mockGetSermons.mockResolvedValue([
			{
				preacher: {
					id: '1',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: '2',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 10,
					},
				},
			},
			{
				preacher: {
					id: '3',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 1,
					},
				},
			},
		] as never);

		const preachers = await getPreachers();

		expect(preachers.map((p) => p.id)).toEqual(['3', '2', '1']);
	});

	it('sorts by last name then first name when priorities are equal', async () => {
		mockGetSermons.mockResolvedValue([
			{
				preacher: {
					id: 'johnny',
					data: {
						firstName: 'John',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: 'james',
					data: {
						firstName: 'James',
						lastName: 'Smith',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
			{
				preacher: {
					id: 'john',
					data: {
						firstName: 'john',
						lastName: 'Adams',
						isGuest: false,
						sortPriority: 0,
					},
				},
			},
		] as never);

		const preachers = await getPreachers();

		expect(preachers.map((p) => p.id)).toEqual(['john', 'james', 'johnny']);
	});
});
