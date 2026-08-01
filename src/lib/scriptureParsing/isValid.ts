import { parser } from './parser';

export const isValidScriptureRef = (input: string): boolean => {
	return Boolean(parser.parse(input).osis());
};
