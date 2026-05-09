import * as esbuild from "esbuild"

const watch = process.argv.includes("--watch")

const config = {
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

if (watch) {
  const ctx = await esbuild.context(config)
  await ctx.watch()
  console.log("esbuild: watching for changes...")
} else {
  await esbuild.build(config)
}
