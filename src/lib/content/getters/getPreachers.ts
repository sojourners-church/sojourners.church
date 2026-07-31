import { getCollection } from 'astro:content';

export const getPreachers = async () => {
	return (await getCollection('preachers')).sort((a, b) => {
		const aPriority = a.data.sortPriority || Number.POSITIVE_INFINITY;
		const bPriority = b.data.sortPriority || Number.POSITIVE_INFINITY;

		return (
			Number(a.data.isGuest) - Number(b.data.isGuest) ||
			aPriority - bPriority ||
			a.data.lastName.localeCompare(b.data.lastName) ||
			a.data.firstName.localeCompare(b.data.firstName)
		);
	});
};
