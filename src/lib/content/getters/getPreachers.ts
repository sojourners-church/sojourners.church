import { getSermons } from './getSermons';

export const getPreachers = async () => {
	const allSermons = await getSermons();

	return [
		...new Map(
			allSermons.map((sermon) => [sermon.preacher.id, sermon.preacher]),
		).values(),
	].sort((a, b) => {
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
