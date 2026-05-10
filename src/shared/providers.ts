import type { BookMetadata, MediaType } from "./types"

const findElm = (selectors: string[]): Element | null => {
  for (const selector of selectors) {
    const elm = document.querySelector(selector)
    if (elm !== null) {
      return elm
    }
  }
  return null
}

const formatDate = (date: Date): string => {
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  const yyyy = date.getFullYear()
  const mm = `00${date.getMonth() + 1}`.slice(-2)
  const dd = `00${date.getDate()}`.slice(-2)
  return `${yyyy}-${mm}-${dd}`
}

export interface MetadataProvider {
  getMetaData(): BookMetadata
}

export class Amazon implements MetadataProvider {
  getTitle(): string {
    const elm = findElm([
      "#productTitle",
      "#ebooksTitle",
      "#title",
      "#truncatedTitle .a-truncate-full",
    ])
    return elm ? (elm.textContent?.trim().replace(/\n|\r/g, "") ?? "") : ""
  }

  getAuthors(): string {
    const elm = findElm([
      "#contributorLink",
      "#bylineContributor",
      ".contributorNameID",
      ".author .a-link-normal",
    ])
    return elm ? (elm.textContent?.trim().replace(/　/g, " ") ?? "") : ""
  }

  getPublisher(): string {
    const elm = findElm([
      "#rpi-attribute-book_details-publisher .rpi-attribute-value span",
      "#rpi-attribute-audiobook_details-publisher .rpi-attribute-value span",
    ])
    return elm ? (elm.textContent?.trim() ?? "") : ""
  }

  getPublicationDate(): string {
    const yearElm = findElm([
      "#rpi-attribute-book_details-publication_date .rpi-attribute-value span",
      "#rpi-attribute-audiobook_details-release-date .rpi-attribute-value span",
      "#rpi-attribute-book_details-publication_date .rpi-attribute-value p:first-child",
      "#rpi-attribute-audiobook_details-release-date .rpi-attribute-value p:first-child",
    ])
    if (!yearElm) {
      return ""
    }
    const dateElm = findElm([
      "#rpi-attribute-book_details-publication_date .rpi-attribute-value p:nth-child(2)",
      "#rpi-attribute-audiobook_details-release-date .rpi-attribute-value p:nth-child(2)",
    ])
    if (!dateElm) {
      return formatDate(new Date(yearElm.textContent?.trim() ?? ""))
    }
    const yyyy = (yearElm.textContent ?? "").replace(/年/g, "").trim()
    const [m, d] = (dateElm.textContent ?? "")
      .replace(/[\s日]/g, "")
      .split("月")
    if (!m || !d) {
      return ""
    }
    const mm = `00${m}`.slice(-2)
    const dd = `00${d}`.slice(-2)
    return `${yyyy}-${mm}-${dd}`
  }

  getMediaType(): MediaType {
    const dp = document.querySelector("#dp")
    if (!dp) {
      return ""
    }
    if (dp.classList.contains("book") || dp.classList.contains("book_mobile")) {
      return "Book"
    }
    if (
      dp.classList.contains("ebooks") ||
      dp.classList.contains("ebooks_mobile")
    ) {
      return "Kindle"
    }
    if (
      dp.classList.contains("audible") ||
      dp.classList.contains("audible_mobile")
    ) {
      return "Audible"
    }
    return ""
  }

  getCover(): string {
    const elm = findElm([
      "#img-wrapper .frontImage",
      "#ebooks-img-wrapper .frontImage",
      "#main-image",
      "#landingImage",
    ])
    return elm ? (elm.getAttribute("src") ?? "") : ""
  }

  getAsin(): string {
    const elm = findElm([
      "#ASIN",
      "[name='ASIN.0']",
      "[name='items[0.base][asin]']",
    ])
    return elm ? (elm as HTMLInputElement).value : ""
  }

  getUrl(): string {
    const asin = this.getAsin()
    return asin ? `${location.origin}/dp/${asin}` : location.href
  }

  getPages(): number {
    const elm = findElm([
      "#rpi-attribute-book_details-fiona_pages .rpi-attribute-value span",
      "#rpi-attribute-book_details-ebook_pages .rpi-attribute-value span",
    ])
    if (!elm) {
      return 0
    }
    const m = (elm.textContent?.trim() ?? "").match(/\d+/)
    return m ? Number.parseInt(m[0], 10) : 0
  }

  getMetaData(): BookMetadata {
    return {
      title: this.getTitle(),
      authors: this.getAuthors(),
      publisher: this.getPublisher(),
      publicationDate: this.getPublicationDate(),
      mediaType: this.getMediaType(),
      cover: this.getCover(),
      url: this.getUrl(),
      pages: this.getPages(),
      asin: this.getAsin(),
    }
  }
}

export const isAmazonHost = (hostname: string): boolean =>
  /^www\.amazon\.(com|co\.jp)$/.test(hostname)

export const resolveProvider = (hostname: string): MetadataProvider | null => {
  if (isAmazonHost(hostname)) {
    return new Amazon()
  }
  return null
}
