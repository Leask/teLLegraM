# teLLegraM

[![Build](https://img.shields.io/github/actions/workflow/status/leask/tellegram/release.yml?branch=master)](https://github.com/leask/tellegram/actions)
[![codecov](https://codecov.io/gh/leask/tellegram/branch/master/graph/badge.svg?token=LxCmgGNUHl)](https://codecov.io/gh/leask/tellegram)
![License](https://img.shields.io/github/license/leask/tellegram)

teLLegraM is a library designed to format LLM (Large Language Model) generated text into [Telegram-specific-markdown (MarkdownV2)](https://core.telegram.org/bots/api#formatting-options), based on [Unified](https://github.com/unifiedjs/unified) and [Remark](https://github.com/remarkjs/remark/). It ensures that complex markdown from AI responses is perfectly interpreted by Telegram clients. teLLegraM also supports a syntax-aware and lossless Markdown pagination.

## Acknowledgements

This project is based on [telegramify-markdown](https://github.com/skoropadas/telegramify-markdown) but has been evolved to specifically address the needs of LLM-generated content.

## Why teLLegraM?

While the original library provided a solid foundation, teLLegraM introduces several key optimizations for the "LLM to Telegram" workflow:

1.  **LLM-Specific Optimizations**: Tailored handling of common artifacts found in AI responses, ensuring cleaner output.
2.  **Lossless Pagination**: Telegram has strict message length limits. teLLegraM includes a smart pagination feature that splits long text into multiple messages *without* breaking MarkdownV2 syntax. It ensures bold, italic, or code blocks are correctly closed in one message and reopened in the next, preventing "unclosed entity" errors.
3.  **Strict MarkdownV2 Compliance**: Enhanced escaping rules to handle edge cases often produced by generative models.

## Install

```bash
npm install tellegram
```

## Usage

### Basic Conversion

```js
import { convert } from 'tellegram';

const markdown = `
# Header
## Subheader

[1.0.0](http://version.com)

* item 1
* item 2
* item 3

And simple text with + some - symbols.
`;

const result = convert(markdown);
console.log(result);
/*
 *Header*
 *Subheader*

[1\.0\.0](http://version.com)

 • item 1
 • item 2
 • item 3

And simple text with \+ some \- symbols\.
*/
```

### Pagination (Handling Long Messages)

When dealing with verbose LLM outputs, use the `paginate` function to safely split text into chunks that respect Telegram's limits (4096 characters) while preserving formatting context.

```js
import { paginate } from 'tellegram';

const longLlmOutput = `... extremely long text with **markdown** ...`;

// Split into an array of strings, each safe to send
const messages = paginate(longLlmOutput);

for (const msg of messages) {
    // Send each part sequentially
    await bot.sendMessage(chatId, msg, { parse_mode: 'MarkdownV2' });
}
```

## Possible options

You can also add unsupported tags strategy as a second argument, which can be one of the following:

- `escape` - escape unsupported symbols for unsupported tags (default)
- `remove` - remove unsupported tags
- `keep` - ignore unsupported tags

```js
import { convert } from 'tellegram';
const markdown = `
# Header

> Blockquote

<div>Text in div</div>
`;

convert(markdown, 'escape');
/*
*Header*

\> Blockquote

<div\>Text in div</div\>
*/

convert(markdown, 'remove');
/*
*Header*
 */
```

[MIT Licence](LICENSE)
