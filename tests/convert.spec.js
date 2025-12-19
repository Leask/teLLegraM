import convert from '../lib/convert.js';

describe('Test convert method', () => {
    it('Text', () => {
        const markdown = 'Hello world!';
        const tgMarkdown = 'Hello world\\!';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Escaped text', () => {
        const markdown = 'Simple t`ext 2 + 2 * (32 / 32) = 4';
        const tgMarkdown = 'Simple t\\`ext 2 \\+ 2 \\* \\(32 / 32\\) \\= 4';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Headings', () => {
        const markdown = '# heading 1\n## heading 2\n### heading 3';
        const tgMarkdown = '*heading 1*\n\n*heading 2*\n\n*heading 3*';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Thematic break', () => {
        const markdown = '---';
        const tgMarkdown = '\\-\\-\\-';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Bold', () => {
        const markdown = '**bold text**';
        const tgMarkdown = `*bold text*`;
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Bold character in word', () => {
        expect(convert('he**l**lo')).toBe(`he*l*lo`);
    });

    it('Italic', () => {
        const markdown = '*italic text*';
        const tgMarkdown = `_italic text_`;
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Bold+Italic', () => {
        const markdown = '***bold+italic***';
        const tgMarkdown = `_*bold\\+italic*_`;
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Strike', () => {
        const markdown = '~~strike text~~';
        const tgMarkdown = `~strike text~`;
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Unordered list', () => {
        const markdown = '* list\n* list\n* list';
        const tgMarkdown = '•   list\n•   list\n•   list';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Ordered list', () => {
        const markdown = '1. list\n2. list\n3. list';
        const tgMarkdown = '1\\.  list\n2\\.  list\n3\\.  list';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with title', () => {
        const markdown = '[](http://atlassian.com "Atlas+sian")';
        const tgMarkdown = '[Atlas\\+sian](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with alt', () => {
        const markdown = '[t.e.s+t](http://atlassian.com)';
        const tgMarkdown = '[t\\.e\\.s\\+t](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with alt and title', () => {
        const markdown = '[test](http://atlassian.com "Atlassian")';
        const tgMarkdown = '[test](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with no alt nor title', () => {
        const markdown = '[](http://atlassian.com)';
        const tgMarkdown = '[http://atlassian\\.com](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with invalid URL', () => {
        const markdown = '[test](/atlassian)';
        const tgMarkdown = 'test';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with invalid URL', () => {
        const markdown = '[test](/atlassian)';
        const tgMarkdown = 'test';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link with parentheses', () => {
        const markdown = '[Atlassian](http://atlas()sian.com)';
        const tgMarkdown = '[Atlassian](http://atlas\\(\\)sian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link in reference style with alt', () => {
        const markdown = '[Atlassian]\n\n[atlassian]: http://atlassian.com';
        const tgMarkdown = '[Atlassian](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link in reference style with alt and custom label', () => {
        const markdown = '[Atlassian][test]\n\n[test]: http://atlassian.com';
        const tgMarkdown = '[Atlassian](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link in reference style with title', () => {
        const markdown = '[][test]\n\n[test]: http://atlassian.com "Title"';
        const tgMarkdown = '[Title](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link in reference style with alt and title', () => {
        const markdown = '[Atlassian]\n\n[atlassian]: http://atlassian.com "Title"';
        const tgMarkdown = '[Atlassian](http://atlassian.com)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Link in reference style with invalid definition', () => {
        const markdown = '[Atlassian][test]\n\n[test]: /atlassian';
        const tgMarkdown = 'Atlassian';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image with title', () => {
        const markdown = '![](https://bitbucket.org/repo/123/images/logo.png "test")';
        const tgMarkdown = '[test](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image with alt', () => {
        const markdown = '![logo.png](https://bitbucket.org/repo/123/images/logo.png)';
        const tgMarkdown = '[logo\\.png](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image with alt and title', () => {
        const markdown = "![logo.png](https://bitbucket.org/repo/123/images/logo.png 'test')";
        const tgMarkdown = '[logo\\.png](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image with invalid URL', () => {
        const markdown = "![logo.png](/relative-path-logo.png 'test')";
        const tgMarkdown = 'logo\\.png';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image in reference style with alt', () => {
        const markdown = '![Atlassian]\n\n[atlassian]: https://bitbucket.org/repo/123/images/logo.png';
        const tgMarkdown = '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image in reference style with alt and custom label', () => {
        const markdown = '![Atlassian][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png';
        const tgMarkdown = '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image in reference style with title', () => {
        const markdown = '![][test]\n\n[test]: https://bitbucket.org/repo/123/images/logo.png "Title"';
        const tgMarkdown = '[Title](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image in reference style with alt and title', () => {
        const markdown = '![Atlassian]\n\n[atlassian]: https://bitbucket.org/repo/123/images/logo.png "Title"';
        const tgMarkdown = '[Atlassian](https://bitbucket.org/repo/123/images/logo.png)';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Image in reference style with invalid definition', () => {
        const markdown = '![Atlassian][test]\n\n[test]: /relative-path-logo.png';
        const tgMarkdown = 'Atlassian';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Inline code', () => {
        const markdown = 'hello `world`';
        const tgMarkdown = 'hello `world`';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Code block', () => {
        const markdown = '```\ncode block\n```';
        const tgMarkdown = '```\ncode block\n```';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Code block with newlines', () => {
        const markdown = '```\ncode\n\n\nblock\n```';
        const tgMarkdown = '```\ncode\n\n\nblock\n```';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Code block with language', () => {
        const markdown = '```javascript\ncode block\n```';
        const tgMarkdown = '```javascript\ncode block\n```';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Code block with deprecated language declaration', () => {
        const markdown = '```\n#!javascript\ncode block\n```';
        const tgMarkdown = '```\ncode block\n```';
        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('User mention', () => {
        const markdown = '<@UPXGB22A2>';
        const tgMarkdown = '<@UPXGB22A2\\>';

        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('HTML Comment', () => {
        const markdown = '<!-- Comment -->';
        const tgMarkdown = '';

        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Bold text in lists', () => {
        const markdown = '- To make text **bold**, surround it with double asterisks (`**`): `**This text is bold.**`';
        const tgMarkdown = '•   To make text *bold*, surround it with double asterisks \\(`**`\\): `**This text is bold.**`';

        expect(convert(markdown)).toBe(tgMarkdown);
    });

    it('Code after list', () => {
        const markdown = `1. Foo:\n\n\`\`\`\nBar\n\`\`\``;
        const tgMarkdown = `1\\.  Foo:\n\n\n\`\`\`\nBar\n\`\`\``;

        expect(convert(markdown)).toBe(tgMarkdown);
    })

    it(`Multiple code blocks and lists`, () => {
        const markdown = `1. Foo:\n\n\`\`\`\nBar\n\`\`\`\n\n2. Baz:\n\n\`\`\`\nQux\n\`\`\``;
        const tgMarkdown = `1\\.  Foo:\n\n\n\`\`\`\nBar\n\`\`\`\n\n2\\.  Baz:\n\n\n\`\`\`\nQux\n\`\`\``;

        expect(convert(markdown)).toBe(tgMarkdown);
    })

    it('should nested codeblocks', () => {
        const markdown = `
\`\`\`\`markdown

\`\`\`python
foo = 'bar'
\`\`\`

\`\`\`\`

		`;
        const tgMarkdown = `\`\`\`markdown

\\\`\\\`\\\`python
foo = 'bar'
\\\`\\\`\\\`

\`\`\``;

        expect(convert(markdown)).toBe(tgMarkdown);
    })

    describe('escape unsupported tags', () => {
        it('should escape blockquote', () => {
            const markdown = '> test';
            const tgMarkdown = '\\> test';

            expect(convert(markdown, 'escape')).toBe(tgMarkdown);
        });

        it('should escape html', () => {
            const markdown = '<div></div>';
            const tgMarkdown = '<div\\></div\\>';

            expect(convert(markdown, 'escape')).toBe(tgMarkdown);
        });

        it('should escape table', () => {
            const markdown = `| a | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |`;
            const tgMarkdown = `\\| a \\| b  \\|  c \\|  d  \\|   \\|
\\| \\- \\| :\\- \\| \\-: \\| :\\-: \\| \\- \\|
\\| e \\| f  \\|    \\|     \\|   \\|
\\| g \\| h  \\|  i \\|  j  \\| k \\|`;

            expect(convert(markdown, 'escape')).toBe(tgMarkdown);
        });

        it('should escape table with parentheses', () => {
            const markdown = `| Column |
| - |
| (text) |`;
            const tgMarkdown = [
                '\\| Column   \\|',
                '\\| ' + '\\-'.repeat(8) + ' \\|',
                '\\| \\(text\\) \\|'
            ].join('\n');
            expect(convert(markdown, 'escape')).toBe(tgMarkdown);
        });

        it('should escape thematic break', () => {
            const markdown = '---';
            const tgMarkdown = '\\-\\-\\-';

            expect(convert(markdown, 'escape')).toBe(tgMarkdown);
        });
    })

    describe('remove unsupported tags', () => {
        it('should remove blockquote', () => {
            const markdown = '> test';
            const tgMarkdown = '';

            expect(convert(markdown, 'remove')).toBe(tgMarkdown);
        });

        it('should remove html', () => {
            const markdown = '<div></div>';
            const tgMarkdown = '';

            expect(convert(markdown, 'remove')).toBe(tgMarkdown);
        });

        it('should remove table', () => {
            const markdown = `| a | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |`;
            const tgMarkdown = '';

            expect(convert(markdown, 'remove')).toBe(tgMarkdown);
        });

        it('should remove thematic break', () => {
            const markdown = '---';
            const tgMarkdown = '';

            expect(convert(markdown, 'remove')).toBe(tgMarkdown);
        });
    })
});
