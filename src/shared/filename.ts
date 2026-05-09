// iOS ショートカットの構文チェッカが regex 内の `"` を文字列開始と誤認するため hex escape
const FORBIDDEN_FILENAME_CHARS = /[\x5C/:*?\x22<>|]/g

export const sanitizeFilename = (title: string): string =>
  title.replace(FORBIDDEN_FILENAME_CHARS, "_").trim() || "Untitled"
