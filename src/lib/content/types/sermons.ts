import type { CollectionEntry } from 'astro:content';

type Sermon = CollectionEntry<'sermons'>;
type Preacher = CollectionEntry<'preachers'>;
type Series = CollectionEntry<'series'>;

// export type HydratedSermon = Omit<Sermon, 'data'> & {
// 	data: Omit<Sermon['data'], 'preacher' | 'series'> & {
// 		preacher?: Preacher;
// 		series?: Series;
// 	};
// };

export type HydratedSermon = Sermon & { series: Series; preacher: Preacher };

export const isSermon = (
	entry: HydratedSermon | CollectionEntry<'blog'>,
): entry is HydratedSermon => {
	return entry.collection === 'sermons';
};
