// 再生成するときは `npm install --no-save @resvg/resvg-js` を先に実行する
import { Resvg } from "@resvg/resvg-js"
import fs from "node:fs/promises"

const svg = await fs.readFile("scripts/icon.svg", "utf8")

for (const size of [16, 32, 48, 128]) {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: size } })
  const png = resvg.render().asPng()
  const path = `images/icon-${size}.png`
  await fs.writeFile(path, png)
  console.log(`generated ${path} (${png.length} bytes)`)
}
