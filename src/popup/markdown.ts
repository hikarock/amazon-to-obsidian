import type { BookMetadata } from "../shared/types"

const escapeYaml = (s: string): string =>
  s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')

const splitAuthors = (authors: string): string[] =>
  authors
    .split(/[,、]\s*/)
    .map((a) => a.trim())
    .filter(Boolean)

export function buildMarkdown(meta: BookMetadata): string {
  const lines: string[] = ["---"]
  if (meta.title) {
    lines.push(`title: "${escapeYaml(meta.title)}"`)
  }
  const authors = splitAuthors(meta.authors)
  if (authors.length > 0) {
    lines.push(
      `authors: [${authors.map((a) => `"${escapeYaml(a)}"`).join(", ")}]`,
    )
  }
  if (meta.publisher) {
    lines.push(`publisher: "${escapeYaml(meta.publisher)}"`)
  }
  if (meta.publicationDate) {
    lines.push(`publication-date: ${meta.publicationDate}`)
  }
  if (meta.mediaType) {
    lines.push(`media-type: ${meta.mediaType}`)
  }
  if (meta.asin) {
    lines.push(`asin: ${meta.asin}`)
  }
  if (meta.url) {
    lines.push(`url: "${escapeYaml(meta.url)}"`)
  }
  if (meta.pages > 0) {
    lines.push(`pages: ${meta.pages}`)
  }
  if (meta.cover) {
    lines.push(`cover: "${escapeYaml(meta.cover)}"`)
  }
  lines.push("---", "")
  if (meta.cover) {
    lines.push(`![cover](${meta.cover})`, "")
  }
  if (meta.url) {
    lines.push(`[Amazonで見る](${meta.url})`, "")
  }
  return lines.join("\n")
}
