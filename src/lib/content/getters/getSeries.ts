import { getCollection } from 'astro:content';

export const getSeries = async () => {
	return (await getCollection('series')).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
};
