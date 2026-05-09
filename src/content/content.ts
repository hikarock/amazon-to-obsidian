import { resolveProvider } from "../shared/providers"
import type { BookMetadata } from "../shared/types"

chrome.runtime.onMessage.addListener(
  (
    message: { type?: string },
    _sender,
    sendResponse: (response: BookMetadata) => void,
  ) => {
    if (message.type !== "fetchMetaData") {
      return
    }
    const provider = resolveProvider(location.hostname)
    if (!provider) {
      return
    }
    sendResponse(provider.getMetaData())
  },
)
