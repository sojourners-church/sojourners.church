import { parser } from '#/lib/scriptureParsing/';

import { fuse } from './init';

export const getMatches = (query: string) => {
	if (!fuse) return;
	const osis = parser.parse(query).osis();

	const searchTerm = osis ? `^${osis}` : query;

	return new Set(fuse.search(searchTerm).map(({ item }) => item.element));
};
