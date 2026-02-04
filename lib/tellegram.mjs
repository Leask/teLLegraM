import defaultHandlers from 'mdast-util-to-markdown/lib/handle/index.js';
import phrasing from 'mdast-util-to-markdown/lib/util/container-phrasing.js';
import { toMarkdown as gfmTableToMarkdown } from 'mdast-util-gfm-table';

import { wrap, isURL, escapeSymbols, processUnsupportedTags } from './utils.mjs';
import tableToList from './table-to-list.mjs';

const isSafeCodeLanguage = language => /^[A-Za-z0-9_+-]+$/.test(language);

/**
 * Creates custom `mdast-util-to-markdown` handlers that tailor the output for
 * Telegram Markdown.
 *
 * @param {Readonly<Record<string, { title: null | string, url: string }>>} definitions
 * Record of `Definition`s in the Markdown document, keyed by identifier.
 *
 * @returns {import('mdast-util-to-markdown').Handlers}
 */
const createHandlers = (definitions, unsupportedTagsStrategy, options) => ({
    heading: (node, _parent, context) => {
        // make headers to be just *strong*
        const marker = '*';

        const exit = context.enter('heading');
        const value = phrasing(node, context, { before: marker, after: marker });
        exit();

        return wrap(value, marker);
    },

    strong: (node, _parent, context) => {
        const marker = '*';

        const exit = context.enter('strong');
        const value = phrasing(node, context, { before: marker, after: marker });
        exit();

        return wrap(value, marker);
    },

    delete(node, _parent, context) {
        const marker = '~';

        const exit = context.enter('delete');
        const value = phrasing(node, context, { before: marker, after: marker });
        exit();

        return wrap(value, marker);
    },

    emphasis: (node, _parent, context) => {
        const marker = '_';

        const exit = context.enter('emphasis');
        const value = phrasing(node, context, { before: marker, after: marker });
        exit();

        return wrap(value, marker);
    },

    list: (...args) => defaultHandlers.list(...args).replace(/^(\d+)./gm, '$1\\.'),

    listItem: (...args) => defaultHandlers.listItem(...args).replace(/^\*/, '•'),

    code(node, _parent, context) {
        const exit = context.enter('code');
        // delete language prefix for deprecated markdown formatters (old Bitbucket Editor)
        const content = node.value.replace(/^#![a-z]+\n/, ''); // ```\n#!javascript\ncode block\n```
        exit();

        const rawLanguage = node.lang || '';
        const language = isSafeCodeLanguage(rawLanguage) ? rawLanguage : '';
        return `\`\`\`${language}\n${escapeSymbols(content, 'code')}\n\`\`\``;
    },

    inlineCode(node, _parent, context) {
        const exit = context.enter('inlineCode');
        const content = node.value || '';
        exit();

        // Telegram MarkdownV2 inline code is sensitive to embedded backticks.
        // Fallback to escaped plain text to avoid broken entities.
        if (content.includes('`') || content.includes('\n') || content.includes('\r')) {
            return escapeSymbols(content);
        }

        return `\`${escapeSymbols(content, 'code')}\``;
    },

    link: (node, _parent, context) => {
        const exit = context.enter('link');
        const text = phrasing(node, context, { before: '|', after: '>' }) || escapeSymbols(node.title);
        const isUrlEncoded = decodeURI(node.url) !== node.url;
        const url = isUrlEncoded ? node.url : encodeURI(node.url);
        exit();

        if (!isURL(url)) return escapeSymbols(text) || escapeSymbols(url);

        return text
            ? `[${text}](${escapeSymbols(url, 'link')})`
            : `[${escapeSymbols(url)}](${escapeSymbols(url, 'link')})`;
    },

    linkReference: (node, _parent, context) => {
        const exit = context.enter('linkReference');
        const definition = definitions[node.identifier];
        const text = phrasing(node, context, { before: '|', after: '>' }) || (definition ? definition.title : null);
        exit();

        if (!definition || !isURL(definition.url)) return escapeSymbols(text);

        return text
            ? `[${text}](${escapeSymbols(definition.url, 'link')})`
            : `[${escapeSymbols(definition.url)}](${escapeSymbols(definition.url, 'link')})`;
    },

    image: (node, _parent, context) => {
        const exit = context.enter('image');
        const text = node.alt || node.title;
        const url = node.url
        exit();

        if (!isURL(url)) return escapeSymbols(text) || escapeSymbols(url);

        return text
            ? `[${escapeSymbols(text)}](${escapeSymbols(url, 'link')})`
            : `[${escapeSymbols(url)}](${escapeSymbols(url, 'link')})`;
    },

    imageReference: (node, _parent, context) => {
        const exit = context.enter('imageReference');
        const definition = definitions[node.identifier];
        const text = node.alt || (definition ? definition.title : null);
        exit();

        if (!definition || !isURL(definition.url)) return escapeSymbols(text);

        return text
            ? `[${escapeSymbols(text)}](${escapeSymbols(definition.url, 'link')})`
            : `[${escapeSymbols(definition.url)}](${escapeSymbols(definition.url, 'link')})`;
    },

    text: (node, _parent, context) => {
        const exit = context.enter('text');
        const text = node.value;
        exit();

        return escapeSymbols(text);
    },

    blockquote: (node, _parent, context) =>
        processUnsupportedTags(defaultHandlers.blockquote(node, _parent, context), unsupportedTagsStrategy),
    html: (node, _parent, context) =>
        processUnsupportedTags(defaultHandlers.html(node, _parent, context), unsupportedTagsStrategy),
    table: (node, _parent, context) => {
        const tableMode = options.table || 'list';

        if (tableMode === 'list') {
            return tableToList(node, context);
        }

        return processUnsupportedTags(
            gfmTableToMarkdown().handlers.table(node, _parent, context),
            unsupportedTagsStrategy,
        );
    },
    thematicBreak: () =>
        processUnsupportedTags('---', unsupportedTagsStrategy),
});

/**
 * Creates options to be passed into a `remark-stringify` processor that tailor
 * the output for Telegram Markdown.
 *
 * @param {Readonly<Record<string, { title: null | string, url: string }>>} definitions
 * Record of `Definition`s in the Markdown document, keyed by identifier.
 *
 * @returns {import('remark-stringify').RemarkStringifyOptions}
 */
const createOptions = (definitions, unsupportedTagsStrategy, options = {}) => ({
    bullet: '*',
    tightDefinitions: true,
    handlers: createHandlers(definitions, unsupportedTagsStrategy, options),
});

export default createOptions;
