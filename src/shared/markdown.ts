import type { BookMetadata } from "./types"

// iOS ショートカットの構文チェッカは文字列・regex 中の `"` `\` を誤認してハイライトを崩すため、ソース上に直接出さず動的に構築する
const BS = String.fromCharCode(92)
const DQ = String.fromCharCode(34)

const escapeYaml = (s: string): string =>
  s.split(BS)
    .join(BS + BS)
    .split(DQ)
    .join(BS + DQ)

const splitAuthors = (authors: string): string[] =>
  authors
    .split(/[,、]\s*/)
    .map((a) => a.trim())
    .filter(Boolean)

export function buildMarkdown(meta: BookMetadata): string {
  const lines: string[] = ["---", "fileClass: book"]
  if (meta.title) {
    lines.push(`book-title: "${escapeYaml(meta.title)}"`)
  }
  const authors = splitAuthors(meta.authors)
  if (authors.length > 0) {
    lines.push(
      `book-authors: [${authors.map((a) => `"${escapeYaml(a)}"`).join(", ")}]`,
    )
  }
  if (meta.publisher) {
    lines.push(`book-publisher: "${escapeYaml(meta.publisher)}"`)
  }
  if (meta.publicationDate) {
    lines.push(`book-publication-date: ${meta.publicationDate}`)
  }
  if (meta.mediaType) {
    lines.push(`book-media-type: ${meta.mediaType}`)
  }
  if (meta.asin) {
    lines.push(`book-asin: ${meta.asin}`)
  }
  if (meta.url) {
    lines.push(`book-url: "${escapeYaml(meta.url)}"`)
  }
  if (meta.pages > 0) {
    lines.push(`book-pages: ${meta.pages}`)
  }
  if (meta.cover) {
    lines.push(`book-cover: "${escapeYaml(meta.cover)}"`)
  }
  lines.push(`book-status: ""`)
  lines.push("---", "")
  if (meta.cover) {
    lines.push(`![cover](${meta.cover})`, "")
  }
  if (meta.url) {
    lines.push(`[Amazonで見る](${meta.url})`, "")
  }
  return lines.join("\n")
}
