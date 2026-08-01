import brf_parser from 'bible-reference-formatter';
import { describe, expect, it } from 'vitest';

import { parser, parseScriptureRef } from '#/lib/scriptureParsing/';

describe('parseScriptureRef function works correctly', () => {
	it.each([
		'John 121',
		'Bob',
		'jamez1',
	])('returns false when passed an invalid scripture reference', (ref) => {
		const result = parseScriptureRef(ref);

		expect(result.ok).toBe(false);
	});
	it.each([
		'John 1',
		'james 1:3',
		'1 tim 1:2-4:1',
	])('returns true when passed a valid scripture reference', (ref) => {
		const result = parseScriptureRef(ref);

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.osis).toBe(parser.parse(ref).osis());
			expect(result.ref).toBe(brf_parser('esv-long', parser.parse(ref).osis()));
			expect(result.shortRef).toBe(
				brf_parser('esv-short', parser.parse(ref).osis()),
			);
		}
	});
});
