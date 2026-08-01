import type { CollectionEntry } from 'astro:content';

type Sermon = CollectionEntry<'sermons'>;
type Preacher = CollectionEntry<'people'>;
type Series = CollectionEntry<'series'>;

export type HydratedSermon = Sermon & { series: Series; preacher: Preacher };

export const isSermon = (
	entry: HydratedSermon | CollectionEntry<'blog'>,
): entry is HydratedSermon => {
	return entry.collection === 'sermons';
};
