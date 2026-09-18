const ESCAPED_CRLF = "\\r\\n";
const ESCAPED_NEWLINE = "\\n";
const ESCAPED_CR = "\\r";

/**
 * Turns two-character `\\n` / `\\r\\n` / `\\r` sequences into real line breaks.
 *
 * CMS agents and JSON APIs often store `snippet.contents.code` (and similar
 * fields) with escaped newlines instead of actual line feeds. Real line
 * breaks already in the string are preserved.
 */
export const normalizeEscapedNewlines = (value: string): string => {
  if (!value.includes("\\")) {
    return value;
  }

  return value
    .replaceAll(ESCAPED_CRLF, "\n")
    .replaceAll(ESCAPED_NEWLINE, "\n")
    .replaceAll(ESCAPED_CR, "\n");
};
