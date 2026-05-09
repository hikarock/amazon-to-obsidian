export interface AdvancedUriParams {
  vault: string
  folder: string
  filename: string
}

export function buildAdvancedUri({
  vault,
  folder,
  filename,
}: AdvancedUriParams): string {
  const enc = encodeURIComponent
  // filepath 全体を encode するとフォルダ区切りの `/` が `%2F` になり Advanced URI が階層として解釈しないため、セグメント単位で encode する
  const segments = folder ? folder.split("/").filter(Boolean) : []
  segments.push(filename)
  const filepath = segments.map(enc).join("/")
  return `obsidian://adv-uri?vault=${enc(vault)}&filepath=${filepath}&clipboard=true&mode=new`
}

export async function sendToObsidian(
  params: AdvancedUriParams,
  body: string,
): Promise<void> {
  await navigator.clipboard.writeText(body)
  window.location.href = buildAdvancedUri(params)
}
