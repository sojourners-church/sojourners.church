import { getCollection } from 'astro:content';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBlog, getTags } from '#/lib/content/getters';

vi.mock('astro:content', () => ({
	getCollection: vi.fn(),
}));

const mockGetCollection = vi.mocked(getCollection);

describe('blog content helpers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getBlog', () => {
		it('returns blog posts sorted by date descending', async () => {
			mockGetCollection.mockResolvedValue([
				{
					id: 'old-post',
					data: {
						date: new Date('2025-01-01'),
						tags: [],
					},
				},
				{
					id: 'new-post',
					data: {
						date: new Date('2025-06-01'),
						tags: [],
					},
				},
			] as never);

			const posts = await getBlog();

			expect(getCollection).toHaveBeenCalledWith('blog');
			expect(posts.map((post) => post.id)).toEqual(['new-post', 'old-post']);
		});
	});

	describe('getTags', () => {
		it('returns unique tags from all blog posts', async () => {
			mockGetCollection.mockResolvedValue([
				{
					id: 'post-1',
					data: {
						date: new Date(),
						tags: ['astro', 'typescript'],
					},
				},
				{
					id: 'post-2',
					data: {
						date: new Date(),
						tags: ['astro', 'testing'],
					},
				},
			] as never);

			const tags = await getTags();

			expect(getCollection).toHaveBeenCalledWith('blog');
			expect(tags).toEqual(['astro', 'testing', 'typescript']);
		});
	});
});
