import { describe, expect, it } from 'vitest';

import { getImage } from '#/lib/getImage';

const mockImages: Record<string, ImageMetadata> = {
	'/src/assets/test.jpeg': {
		src: '/test.jpeg',
		width: 100,
		height: 100,
		format: 'jpeg',
	},
};

describe('getImage', () => {
	it('returns an image for a valid path', () => {
		const image = getImage('/src/assets/test.jpeg', mockImages);

		expect(image).toEqual(mockImages['/src/assets/test.jpeg']);
	});

	it('returns undefined for an invalid path', () => {
		expect(
			getImage('/src/assets/does-not-exist.svg', mockImages),
		).toBeUndefined();
	});

	it('returns undefined when path is undefined', () => {
		expect(getImage(undefined, mockImages)).toBeUndefined();
	});
});
