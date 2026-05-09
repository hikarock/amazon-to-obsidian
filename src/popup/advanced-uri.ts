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
  const filepath = folder ? `${folder}/${filename}` : filename
  const enc = encodeURIComponent
  return `obsidian://adv-uri?vault=${enc(vault)}&filepath=${enc(filepath)}&clipboard=true&mode=new`
}

export async function sendToObsidian(
  params: AdvancedUriParams,
  body: string,
): Promise<void> {
  await navigator.clipboard.writeText(body)
  window.location.href = buildAdvancedUri(params)
}
