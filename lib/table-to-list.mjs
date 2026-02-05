import phrasing from 'mdast-util-to-markdown/lib/util/container-phrasing.js';

import { escapeSymbols } from './utils.mjs';

const EMPTY_VALUE = escapeSymbols('-');
const FALLBACK_HEADER = escapeSymbols('- ');

const normalizeCell = (node, context) => {
    if (!node) {
        return '';
    }

    const value = phrasing(node, context, { before: '', after: '' });
    return value.replace(/\n/g, ' ').trim();
};

const normalizeHeader = (cell, index, context) => {
    const value = normalizeCell(cell, context);
    return value || `${FALLBACK_HEADER}`;
};

const normalizeValue = (cell, context) => {
    const value = normalizeCell(cell, context);
    return value || EMPTY_VALUE;
};

const pairToLine = (pair, rowIndex, isNested) => {
    if (isNested) {
        return `\\- ${pair.header}: ${pair.value}`;
    }

    return `${rowIndex + 1}\\. ${pair.header}: ${pair.value}`;
};

export default (node, context) => {
    if (!node.children.length) {
        return '';
    }

    const [headerRow, ...rows] = node.children;
    if (!headerRow || !rows.length) {
        return '';
    }

    const headers = headerRow.children.map((cell, index) =>
        normalizeHeader(cell, index, context));

    const listRows = rows
        .map((row, rowIndex) => {
            const columnCount = Math.max(headers.length, row.children.length);
            const pairs = Array.from({ length: columnCount }, (_, index) => {
                const header = headers[index] || FALLBACK_HEADER;
                const value = normalizeValue(row.children[index], context);
                return { header, value };
            });

            if (!pairs.length) {
                return `${rowIndex + 1}\\. Item ${rowIndex + 1}: ${EMPTY_VALUE}`;
            }

            const [first, ...rest] = pairs;
            return [
                pairToLine(first, rowIndex, false),
                ...rest.map(pair => pairToLine(pair, rowIndex, true)),
            ].join('\n');
        });

    return listRows.join('\n\n');
};
