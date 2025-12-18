# teLLegraM

[![Build](https://img.shields.io/github/actions/workflow/status/skoropadas/telegramify-markdown/release.yml?branch=master)](https://github.com/skoropadas/telegramify-markdown/actions)
[![codecov](https://codecov.io/gh/skoropadas/telegramify-markdown/branch/master/graph/badge.svg?token=LxCmgGNUHl)](https://codecov.io/gh/skoropadas/telegramify-markdown)
![License](https://img.shields.io/github/license/skoropadas/telegramify-markdown)

teLLegraM is a library designed to format LLM (Large Language Model) generated text into [Telegram-specific-markdown (MarkdownV2)](https://core.telegram.org/bots/api#formatting-options), based on [Unified](https://github.com/unifiedjs/unified) and [Remark](https://github.com/remarkjs/remark/). It ensures that complex markdown from AI responses is perfectly interpreted by Telegram clients.

## Install

```bash
npm install tellegram
```

## Usage

```js
const teLLegraM = require('tellegram');
const markdown = `
# Header
## Subheader

[1.0.0](http://version.com)

* item 1
* item 2
* item 3

And simple text with + some - symbols.
`;

teLLegraM(markdown);
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

## Possible options

You can also add unsupported tags strategy as a second argument, which can be one of the following:

- `escape` - escape unsupported symbols for unsupported tags
- `remove` - remove unsupported tags
- `keep` - ignore unsupported tags (default)

```js
const teLLegraM = require('teLLegraM');
const markdown = `
# Header

> Blockquote

<div>Text in div</div>
`;

teLLegraM(markdown, 'escape');
/*
*Header*

\> Blockquote

<div\>Text in div</div\>
*/

teLLegraM(markdown, 'remove');
/*
*Header*
 */
```

[MIT Licence](LICENSE)
