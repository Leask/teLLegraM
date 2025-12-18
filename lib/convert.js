import gfm from 'remark-gfm';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import removeComments from 'remark-remove-comments';
import unified from 'unified';

import { collectDefinitions, removeDefinitions } from './definitions.js';
import createTellegramOptions from './tellegram.js';

export default (markdown, unsupportedTagsStrategy) => {
	const definitions = {};

	const tellegramOptions = createTellegramOptions(definitions, unsupportedTagsStrategy);

	return unified()
		.use(parse)
		.use(gfm)
		.use(removeComments)
		.use(collectDefinitions, definitions)
		.use(removeDefinitions)
		.use(stringify, tellegramOptions)
		.processSync(markdown)
		.toString()
		.replace(/<!---->\n/gi, '');
};
