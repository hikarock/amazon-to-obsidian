import { buildAdvancedUri } from "../shared/advanced-uri"
import { sanitizeFilename } from "../shared/filename"
import { buildMarkdown } from "../shared/markdown"
import { resolveProvider } from "../shared/providers"
import { FOLDER, VAULT } from "./config"

declare const completion: (value: unknown) => void

const provider = resolveProvider(location.hostname)
if (!provider) {
  completion({ error: "対応していないページです" })
} else {
  const meta = provider.getMetaData()
  const filename = sanitizeFilename(meta.title)
  completion({
    markdown: buildMarkdown(meta),
    url: buildAdvancedUri({ vault: VAULT, folder: FOLDER, filename }),
  })
}
