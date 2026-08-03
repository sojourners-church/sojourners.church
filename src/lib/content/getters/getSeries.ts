import { getSermons } from './getSermons';

export const getSeries = async () => {
	const allSermons = await getSermons();

	return [
		...new Map(
			allSermons.map((sermon) => [sermon.series.id, sermon.series]),
		).values(),
	].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
};
