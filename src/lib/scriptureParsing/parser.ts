import { bcv_parser } from 'bible-passage-reference-parser/esm/bcv_parser';
import * as lang from 'bible-passage-reference-parser/esm/lang/en';

export const parser = new bcv_parser(lang);
parser.set_options({ book_alone_strategy: 'full' });
