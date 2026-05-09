export type MediaType = "Book" | "Kindle" | "Audible" | ""

export interface BookMetadata {
  title: string
  authors: string
  publisher: string
  publicationDate: string
  mediaType: MediaType
  cover: string
  url: string
  pages: number
  asin: string
}

export interface VaultConfig {
  name: string
  vault: string
  folder: string
}

export interface FetchMetaDataMessage {
  type: "fetchMetaData"
}
