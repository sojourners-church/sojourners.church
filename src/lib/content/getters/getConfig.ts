import { type CollectionEntry, getEntry } from 'astro:content';
import { AstroError } from 'astro/errors';

// Map collection name to filename
const collectionMap = {
	site: 'config:site',
	homepage: 'config:homepage',
	footer: 'config:footer',
	team: 'config:team',
	theme: 'config:theme',
	navigation: 'config:nav',
} as const;

export type ConfigFileName = keyof typeof collectionMap;

export type ConfigCollection<C extends ConfigFileName> =
	(typeof collectionMap)[C];

export const getConfig = async <C extends ConfigFileName>(
	filename: C,
): Promise<CollectionEntry<ConfigCollection<C>>['data']> => {
	const collection = collectionMap[filename];

	const res = await getEntry(collection, filename);

	if (!res) {
		throw new AstroError(`Error retrieving ${filename} collection.`);
	}

	return res.data;
};
