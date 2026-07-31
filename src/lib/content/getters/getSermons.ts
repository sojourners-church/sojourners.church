import { getCollection, getEntry } from 'astro:content';

import type { HydratedSermon } from '#/lib/content/types/sermons';

export const getSermons = async (): Promise<HydratedSermon[]> => {
	const allSermons = (await getCollection('sermons')).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);

	const promises = allSermons.map(async (sermon) => {
		return {
			...sermon,
			series: await getEntry(sermon.data.series),
			preacher: await getEntry(sermon.data.preacher),
		};
	});

	return Promise.all(promises);
};
