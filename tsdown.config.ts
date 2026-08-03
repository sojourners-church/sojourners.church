import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: './src/lib/scriptureParsing/isValid.ts',
	outDir: './public/cms/scripts',
	format: 'esm',
	clean: false,
	unbundle: false, // bundle dependencies
	deps: {
		alwaysBundle: [
			'bible-passage-reference-parser/esm/bcv_parser.js',
			'bible-passage-reference-parser/esm/lang/en.js',
		],
		onlyBundle: false,
	},
});
