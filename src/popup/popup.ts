import type { BookMetadata, MediaType, VaultConfig } from "../shared/types"
import { sendToObsidian } from "./advanced-uri"
import { buildMarkdown } from "./markdown"

const FORBIDDEN_FILENAME_CHARS = /[\\/:*?"<>|]/g

const buttonElm = document.getElementById("button") as HTMLInputElement
const coverElm = document.getElementById("cover") as HTMLImageElement
const inputTitleElm = document.getElementById("title") as HTMLTextAreaElement
const inputAuthorsElm = document.getElementById("authors") as HTMLInputElement
const inputPublisherElm = document.getElementById(
  "publisher",
) as HTMLInputElement
const inputPublicationDateElm = document.getElementById(
  "publication-date",
) as HTMLInputElement
const inputMediaTypeElm = document.getElementById(
  "media-type",
) as HTMLSelectElement
const inputUrlElm = document.getElementById("url") as HTMLInputElement
const inputPagesElm = document.getElementById("pages") as HTMLInputElement
const inputAsinElm = document.getElementById("asin") as HTMLInputElement
const inputVaultElm = document.getElementById("vault") as HTMLSelectElement
const formElm = document.getElementById("form") as HTMLFormElement
const notAvailableElm = document.getElementById(
  "not-available",
) as HTMLDivElement
const processingElm = document.getElementById("processing") as HTMLDivElement
const errorElm = document.getElementById("error") as HTMLDivElement

const vaultConfigs = new Map<string, VaultConfig>()

const showError = (message: string): void => {
  errorElm.textContent = message
  errorElm.style.display = "block"
}

chrome.storage.sync.get(
  ["name1", "vault1", "folder1", "name2", "vault2", "folder2"],
  (res: Record<string, string | undefined>) => {
    const sets: VaultConfig[] = [
      {
        name: res.name1 ?? "",
        vault: res.vault1 ?? "",
        folder: res.folder1 ?? "",
      },
      {
        name: res.name2 ?? "",
        vault: res.vault2 ?? "",
        folder: res.folder2 ?? "",
      },
    ]
    let appended = 0
    for (const [i, s] of sets.entries()) {
      if (!s.vault) {
        continue
      }
      const key = `vault-${i}`
      vaultConfigs.set(key, s)
      const opt = document.createElement("option")
      opt.value = key
      opt.text = s.name || s.vault
      inputVaultElm.appendChild(opt)
      appended++
    }
    if (appended === 0) {
      const opt = document.createElement("option")
      opt.value = ""
      opt.text = "(オプション画面で Vault を設定してください)"
      inputVaultElm.appendChild(opt)
    }
  },
)

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.id) {
    notAvailableElm.style.display = "block"
    return
  }
  chrome.tabs.sendMessage(
    tab.id,
    { type: "fetchMetaData" },
    (payload?: BookMetadata) => {
      if (chrome.runtime.lastError || !payload) {
        notAvailableElm.style.display = "block"
        return
      }
      formElm.style.display = "grid"
      inputTitleElm.value = payload.title ?? ""
      inputAuthorsElm.value = payload.authors ?? ""
      inputPublisherElm.value = payload.publisher ?? ""
      inputPublicationDateElm.value = payload.publicationDate ?? ""
      inputUrlElm.value = payload.url ?? ""
      inputMediaTypeElm.value = payload.mediaType || "Book"
      inputPagesElm.value = String(payload.pages ?? 0)
      inputAsinElm.value = payload.asin ?? ""
      coverElm.setAttribute("src", payload.cover ?? "")
    },
  )
})

buttonElm.addEventListener("click", async (evt) => {
  evt.preventDefault()
  const cfg = vaultConfigs.get(inputVaultElm.value)
  if (!cfg) {
    showError("Vault が選択されていません")
    return
  }
  buttonElm.style.display = "none"
  processingElm.style.display = "block"
  const meta: BookMetadata = {
    title: inputTitleElm.value,
    authors: inputAuthorsElm.value,
    publisher: inputPublisherElm.value,
    publicationDate: inputPublicationDateElm.value,
    mediaType: inputMediaTypeElm.value as MediaType,
    pages: Number.parseInt(inputPagesElm.value || "0", 10),
    url: inputUrlElm.value,
    cover: coverElm.getAttribute("src") ?? "",
    asin: inputAsinElm.value,
  }
  const markdown = buildMarkdown(meta)
  const filename =
    meta.title.replace(FORBIDDEN_FILENAME_CHARS, "_").trim() || "Untitled"
  try {
    await sendToObsidian(
      { vault: cfg.vault, folder: cfg.folder, filename },
      markdown,
    )
    // custom protocol は popup の navigation をキャンセルするので明示的に閉じる
    window.close()
  } catch (err) {
    processingElm.style.display = "none"
    buttonElm.style.display = "block"
    showError(`Error: ${(err as Error).message}`)
  }
})
