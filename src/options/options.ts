const nameElm1 = document.getElementById("name-1") as HTMLInputElement
const nameElm2 = document.getElementById("name-2") as HTMLInputElement
const vaultElm1 = document.getElementById("vault-1") as HTMLInputElement
const vaultElm2 = document.getElementById("vault-2") as HTMLInputElement
const folderElm1 = document.getElementById("folder-1") as HTMLInputElement
const folderElm2 = document.getElementById("folder-2") as HTMLInputElement
const buttonElm = document.getElementById("save-button") as HTMLInputElement
const toastElm = document.getElementById("toast") as HTMLDivElement

chrome.storage.sync.get(
  ["name1", "name2", "vault1", "vault2", "folder1", "folder2"],
  (res: Record<string, string | undefined>) => {
    nameElm1.value = res.name1 ?? ""
    nameElm2.value = res.name2 ?? ""
    vaultElm1.value = res.vault1 ?? ""
    vaultElm2.value = res.vault2 ?? ""
    folderElm1.value = res.folder1 ?? ""
    folderElm2.value = res.folder2 ?? ""
  },
)

const trimFolder = (s: string): string => s.trim().replace(/^\/+|\/+$/g, "")

buttonElm.addEventListener("click", () => {
  const data = {
    name1: nameElm1.value.trim(),
    name2: nameElm2.value.trim(),
    vault1: vaultElm1.value.trim(),
    vault2: vaultElm2.value.trim(),
    folder1: trimFolder(folderElm1.value),
    folder2: trimFolder(folderElm2.value),
  }
  chrome.storage.sync.set(data, () => {
    toastElm.style.display = "block"
    setTimeout(() => {
      toastElm.style.display = "none"
    }, 2000)
  })
})
