// このファイルを `config.ts` にコピーし、自分の Obsidian 環境に合わせて書き換える
// `config.ts` は .gitignore で管理対象外。各端末・各保存先ごとに値を持てる
//
// 複数の保存先を使い分けたい場合は、ショートカットを複製して config.ts の値を切り替えてから
// それぞれ `npm run build` し、生成された build/shortcut.js を貼り直す

export const VAULT = "MyVault"
export const FOLDER = "Books/Amazon"
