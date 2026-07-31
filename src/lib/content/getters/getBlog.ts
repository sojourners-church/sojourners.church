import { getCollection } from 'astro:content';

export const getBlog = async () => {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
};

export const getTags = async () => {
	const allTags = new Set<string>();

	const allPosts = await getCollection('blog');

	allPosts.forEach((post) => {
		post.data.tags.forEach((tag) => {
			allTags.add(tag);
		});
	});

	return Array.from(allTags);
};
