import assert from 'assert';
import convert from './convert.mjs';

const MESSAGE_LENGTH_LIMIT = parseInt(4096 * 0.9);   // ~= 3680
const clarify = str => str.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(x => x);
const lines = (arr, sep = '\n') => arr.join(sep);
const extError = (err, status, opt = {}) => Object.assign(err, { status }, opt);
const newError = (msg, status, opt) => extError(new Error(msg), status, opt);
const throwError = (msg, status, opt) => { throw newError(msg, status, opt); };
const trim = (str, opts) => ensureString(str, { trim: true, ...opts || {} });

// Is
const _is = (type, value) => value?.constructor === type;
const _type = (any) => typeof any === 'undefined' ? 'Undefined'
    : Object.prototype.toString.call(any).replace(/^\[[^ ]* (.*)\]$/, '$1');
[
    ArrayBuffer, BigInt, Boolean, Error, Number, Object, Set, String, Uint8Array
].map(type => {
    const name = `is${type.name}`;
    type[name] = type[name] || (value => _is(type, value));
});
Date.isDate = Date.isDate || ((value, strict) => _is(Date, value) ? (
    strict ? value.toTimeString().toLowerCase() !== 'invalid date' : true
) : false);
Function.isFunction = Function.isFunction
    || (value => ['Function', 'AsyncFunction'].includes(_type(value)));

const toString = (any, options) => {
    if (Object.isObject(any)) { return JSON.stringify(any); }
    else if (Date.isDate(any)) { return any.toISOString(); }
    else if (Error.isError(any)) { return options?.trace ? any.stack : any.message; }
    return String(any ?? '');
};

const ensureString = (str, options) => {
    str = toString(str, options);
    if (options?.case) {
        switch (toString(options?.case).trim().toUpperCase()) {
            case 'UP':
                str = str.toUpperCase();
                break;
            case 'LOW':
                str = str.toLowerCase();
                break;
            case 'CAP': // capitalize
                str = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
                break;
            case 'CAMEL':
                str = clarify(str).map((x, i) => i ? `${x.charAt(0).toUpperCase()}${x.slice(1)}` : x).join('');
                break;
            case 'SNAKE':
                str = clarify(str).join('_');
                assert(str, 'String can not convert to snake case.', 500);
                break;
            default:
                throwError(`Invalid case option: '${options?.case}'.`, 500);
        }
    }
    options?.trim && (str = str.trim());
    options?.compact && (str = str.replace(/\s+/g, ' ').trim());
    options?.limit && (str = str.trim()) && str.length > options.limit
        && (str = `${str.slice(0, options.limit).trim()}...`);
    return str;
};

export default (message, options) => {
    let [pages, page, size, codeMark, concat, prefix] =
        [[], [], ~~options?.size || MESSAGE_LENGTH_LIMIT, '', '', ''];
    const countLength = pos => {
        const str = prefix + lines(page) + message.substring(0, pos + 1);
        return Math.max(str.length, convert(str).length);
    };
    const submit = () => {
        const content = trim(lines(page));
        content && pages.push(prefix + content + concat + (codeMark ? '\n```' : ''));
        page.length = 0;
        prefix = '';
        if (codeMark) {
            prefix += `${codeMark}\n`;
        }
        if (concat) {
            prefix += concat;
            concat = '';
        }
    };
    while ((message || '').length) {
        let nextN = message.indexOf('\n');                    // 獲得下一個換行
        nextN === -1 && (nextN = message.length);             // 剩下只有一行
        let cut = nextN;                                      // 初始化當前預測裁切
        if (countLength(cut) > size && page.length) { submit(); continue; }
        // cut = Math.min(cut, size);
        // while (countLength(cut) > size) { cut--; }
        if (countLength(cut) > size) {
            let high = Math.min(cut, size);
            cut = 0;
            while (cut < high) {
                let mid = Math.ceil((cut + high) / 2);
                if (countLength(mid) <= size) {
                    cut = mid;
                } else {
                    high = mid - 1;
                }
            }
        }
        concat = cut < nextN ? '...' : '';
        const line = message.substring(0, cut + 1).trimEnd();
        page.push(line);
        /^```.{0,20}$/.test(line) && (codeMark = codeMark ? '' : line);
        if (concat) {
            submit();
        }
        message = message.substring(cut + 1);
    }
    submit();
    return pages.map((p, i) => convert((
        pages.length > 1 && !options?.noPageNum
            ? `📃 PAGE ${i + 1} / ${pages.length}:\n\n` : ''
    ) + p));
};

export { MESSAGE_LENGTH_LIMIT };
