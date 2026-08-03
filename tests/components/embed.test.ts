import { describe, expect, it } from 'vitest';

import { parseEmbed } from '#/components/embed/parser';
import { providers } from '#/components/embed/providers';

describe('parseEmbed', () => {
	describe('youtube', () => {
		it('parses youtube.com watch URLs', () => {
			expect(parseEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual(
				{
					type: 'youtube',
					uri: 'dQw4w9WgXcQ',
				},
			);
		});

		it('parses youtu.be URLs', () => {
			expect(parseEmbed('https://youtu.be/dQw4w9WgXcQ')).toEqual({
				type: 'youtube',
				uri: 'dQw4w9WgXcQ',
			});
		});

		it('parses youtube live URLs', () => {
			expect(parseEmbed('https://www.youtube.com/live/dQw4w9WgXcQ')).toEqual({
				type: 'youtube',
				uri: 'dQw4w9WgXcQ',
			});
		});

		it('returns null when youtube URL has no video id', () => {
			expect(parseEmbed('https://www.youtube.com/watch')).toBeNull();
		});
	});

	describe('spotify', () => {
		it('parses spotify episode URLs', () => {
			expect(
				parseEmbed('https://open.spotify.com/episode/1234567890123456789012'),
			).toEqual({
				type: 'spotify',
				uri: '1234567890123456789012',
			});
		});

		it('parses spotify track URLs', () => {
			expect(
				parseEmbed('https://open.spotify.com/track/1234567890123456789012'),
			).toEqual({
				type: 'spotify',
				uri: '1234567890123456789012',
			});
		});

		it('parses spotify playlist URLs', () => {
			expect(
				parseEmbed('https://open.spotify.com/playlist/1234567890123456789012'),
			).toEqual({
				type: 'spotify',
				uri: '1234567890123456789012',
			});
		});

		it('returns null when spotify URL has no id', () => {
			expect(parseEmbed('https://open.spotify.com/episode')).toBeNull();
		});
	});

	describe('empty or invalid', () => {
		it('return null on an empty url', () => {
			expect(parseEmbed('')).toBeNull();
		});
		it('return null on an invalid url', () => {
			expect(parseEmbed('123zyx')).toBeNull();
		});
	});

	describe('unsupported providers', () => {
		it('returns null for unsupported URLs', () => {
			expect(parseEmbed('https://vimeo.com/123456')).toBeNull();
		});
	});
});

describe('providers', () => {
	it('provides correct youtube url', () => {
		expect(providers.youtube.getUrl('abc12345678')).toBe(
			'https://www.youtube.com/embed/abc12345678',
		);
	});

	it('provides correct spotify full url', () => {
		expect(providers.spotify.getUrl('123')).toBe(
			'https://open.spotify.com/embed/episode/123/video',
		);
	});

	it('provides correct spotify compact url', () => {
		expect(providers.spotify.getUrl('123', true)).toBe(
			'https://open.spotify.com/embed/episode/123',
		);
	});
});
