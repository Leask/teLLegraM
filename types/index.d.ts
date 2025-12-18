type UnsupportedTagsStrategy = 'escape' | 'remove' | 'keep'

declare module 'tellegram' {
  /**
   * Converts markdown to Telegram's format.
   * @param markdown The markdown to convert.
   * @param unsupportedTagsStrategy The strategy to use for unsupported tags.
   */
  export function convert(markdown: string, unsupportedTagsStrategy?: UnsupportedTagsStrategy): string;

  /**
   * Paginates text (placeholder).
   * @param text The text to paginate.
   */
  export function paginate(text: string): string;

  const defaultExport: typeof convert;
  export default defaultExport;
}