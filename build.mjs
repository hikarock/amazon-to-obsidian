import fs from "node:fs/promises"
import * as esbuild from "esbuild"

const watch = process.argv.includes("--watch")

// 初回ビルド時に config.ts がなければ example をコピーして雛形を提供する
const configPath = "src/shortcut/config.ts"
const configExamplePath = "src/shortcut/config.example.ts"
try {
  await fs.access(configPath)
} catch {
  await fs.copyFile(configExamplePath, configPath)
  console.log(
    `created ${configPath} from ${configExamplePath} — VAULT/FOLDER を編集してから再ビルドしてください`,
  )
}

const extensionConfig = {
  entryPoints: {
    popup: "src/popup/popup.ts",
    options: "src/options/options.ts",
    content: "src/content/content.ts",
  },
  outdir: "build",
  bundle: true,
  format: "iife",
  target: "chrome120",
  logLevel: "info",
}

const shortcutConfig = {
  entryPoints: {
    shortcut: "src/shortcut/shortcut.ts",
  },
  outdir: "build",
  bundle: true,
  format: "iife",
  target: "es2017",
  // iOS ショートカットの構文チェッカは template literal の `${...}` 内に `"` が出るとハイライトを崩すため、文字列連結に展開させる
  supported: { "template-literal": false },
  logLevel: "info",
}

if (watch) {
  const ctxs = await Promise.all([
    esbuild.context(extensionConfig),
    esbuild.context(shortcutConfig),
  ])
  await Promise.all(ctxs.map((c) => c.watch()))
  console.log("esbuild: watching for changes...")
} else {
  await Promise.all([
    esbuild.build(extensionConfig),
    esbuild.build(shortcutConfig),
  ])
}
