type UnsupportedTagsStrategy = 'escape' | 'remove' | 'keep'
type TableStrategy = 'list' | 'unsupported'

interface ConvertOptions {
  /** Table conversion mode. Default: 'list' */
  table?: TableStrategy
}

declare module 'tellegram' {
  /**
   * Converts markdown to Telegram's format.
   * @param markdown The markdown to convert.
   * @param unsupportedTagsStrategy The strategy to use for unsupported tags.
   * @param options Additional conversion options.
   */
  export function convert(
    markdown: string,
    unsupportedTagsStrategy?: UnsupportedTagsStrategy,
    options?: ConvertOptions
  ): string;

  /**
   * Paginates text (placeholder).
   * @param text The text to paginate.
   */
  export function paginate(text: string): string;

  const defaultExport: typeof convert;
  export default defaultExport;
}
