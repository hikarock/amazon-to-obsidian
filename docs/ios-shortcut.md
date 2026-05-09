# iOS Safari ショートカットから Obsidian に登録する

iOS Safari の共有シートからショートカットを起動し、Amazon / ブクログの書誌情報を Obsidian Vault に Markdown として保存する手順です。

Chrome 拡張と同じスクリプト (`src/shared/`) を再利用しており、ショートカット用には `build/shortcut.js` をビルドして使います。完成済みの `obsidian://adv-uri?...` URL も JavaScript 側で組み立てるので、ショートカット側のアクションは最小限で済みます。

## 必要なもの

- iOS / iPadOS の Safari
- Obsidian (iOS 版) と [Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) プラグイン
- 開いた Vault が iCloud / 同期で iOS デバイスに展開済みであること
- Node.js (ビルド用、Mac などの母艦で 1 度だけ実行)

## Vault / Folder の設定

`src/shortcut/config.ts` に保存先を書きます。初回 `npm run build` を実行すると `src/shortcut/config.example.ts` から自動でコピーされるので、その後で値を書き換えてください。`config.ts` は `.gitignore` で管理対象外です。

```ts
// src/shortcut/config.ts
export const VAULT = "MyVault"
export const FOLDER = "Books/Amazon"
```

- `VAULT` … Obsidian で開いている Vault 名 (Vault 一覧 URL の末尾と一致)
- `FOLDER` … Vault 内の保存先フォルダ。空文字列で Vault ルート、`/` 区切りで階層指定

日本語やスペースを含む場合もそのまま書いて問題ありません (JavaScript 側で `encodeURIComponent` します)。

複数の保存先を使い分けたい場合は、`config.ts` の値を切り替えながら都度 `npm run build` し、生成された `build/shortcut.js` を別ショートカットに貼り直す運用になります。

## ビルド

```sh
npm install
npm run build
```

`build/shortcut.js` が生成されます。中身は IIFE 形式の単一 JavaScript で、Safari の「Web ページで JavaScript を実行」アクションにそのまま貼り付けて使います。`config.ts` の値はビルド時にバンドル末尾へ埋め込まれるので、貼り付け後の手動編集は不要です。

## ショートカットの作成

iOS の「ショートカット」アプリで新規ショートカットを作成し、以下のアクションをこの順で並べます。

| # | アクション | 設定 |
| --- | --- | --- |
| 1 | **入力を受け取る** (ショートカットの設定) | 共有シートに表示: ON / 受け付ける入力: **Safari Web ページ** のみ |
| 2 | **Web ページで JavaScript を実行** | 入力: `ショートカットの入力` / JavaScript: ビルド済みの `build/shortcut.js` の中身を貼り付け |
| 3 | **辞書の値を取得** | 取得: `markdown` / 辞書: 直前の `JavaScript の結果` → 変数名 `Markdown` |
| 4 | **辞書の値を取得** | 取得: `url` / 辞書: `JavaScript の結果` → 変数名 `ObsidianURL` |
| 5 | **クリップボードにコピー** | コピーする内容: `Markdown` |
| 6 | **URL を開く** | 入力: `ObsidianURL` |

## 共有シートからの実行

1. Safari で Amazon / ブクログの商品ページを開く
2. 共有ボタン → 作成したショートカットをタップ
3. クリップボードに Markdown 本文がコピーされ、Obsidian が起動
4. Advanced URI が指定パスに新規ノートを作成

同名ファイルがある場合は Advanced URI が `タイトル 1.md` のように連番を付与します。

## 動作確認のポイント

- 初回起動時に「Obsidian で開きますか?」のダイアログが出ます。許可してください
- ショートカット実行直後にクリップボードを上書きするので、コピー中の内容があれば事前に退避を
- `JavaScript の結果` に `error` キーが含まれている場合は対応外のページです (ホスト名を判定して弾いています)。Amazon / ブクログ以外で起動されたケースなのでショートカットを終了して問題ありません

## トラブルシューティング

| 症状 | 原因 / 対処 |
| --- | --- |
| ショートカットがエラーで止まる | アクション #2 の入力が `ショートカットの入力` (Safari Web ページ) になっているか確認 |
| Obsidian が起動しない | `ObsidianURL` の値が `obsidian://adv-uri?...` の形になっているか、Advanced URI プラグインが有効か確認 |
| ファイルが空で作成される | クリップボードコピーのアクションが URL を開くより**前**にあるか確認 |
| Vault が見つからない | `src/shortcut/config.ts` の `VAULT` が Obsidian の Vault 名と完全一致しているか確認 (大文字小文字も区別)。書き換えた後は `npm run build` を再実行 |
| フォルダが作られず Vault 直下に保存される | `src/shortcut/config.ts` の `FOLDER` を確認。フォルダは事前に Vault 内に存在している必要あり |

## スクリプトの再ビルド

`src/shared/` 配下のロジックや `src/shortcut/config.ts` を更新したら、Mac などで `npm run build` を再実行し、生成された `build/shortcut.js` の中身でアクション #2 の JavaScript を上書きしてください。Chrome 拡張側 (`build/popup.js` など) も同時に更新されます。
