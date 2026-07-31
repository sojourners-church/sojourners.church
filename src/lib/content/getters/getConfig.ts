import { type CollectionEntry, getEntry } from 'astro:content';
import { AstroError } from 'astro/errors';

const collectionMap = {
	site: 'config:site',
	homepage: 'config:homepage',
	footer: 'config:footer',
	team: 'config:team',
	theme: 'config:theme',
} as const;

export type ConfigName = keyof typeof collectionMap;

export type ConfigCollection<C extends ConfigName> = (typeof collectionMap)[C];

export const getConfig = async <C extends ConfigName>(
	collection: C,
): Promise<CollectionEntry<ConfigCollection<C>>['data']> => {
	const target = collectionMap[collection];

	const res = await getEntry(target, collection);

	if (!res) {
		throw new AstroError(`Error retrieving collection: ${collection}`);
	}

	return res.data;
};
