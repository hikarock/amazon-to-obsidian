# amazon-to-obsidian

![amazon-to-obsidian](images/icon-128.png)

Amazon.co.jp / Amazon.com の書誌情報を、Obsidian の [Advanced URI](https://github.com/Vinzent03/obsidian-advanced-uri) プラグイン経由で指定 Vault のフォルダに Markdown として保存します。

- **デスクトップ**: Chrome 拡張機能としてインストール
- **iOS Safari**: ショートカットアプリから共有シート経由で起動 → [docs/ios-shortcut.md](docs/ios-shortcut.md)

書き込みは `obsidian://adv-uri` を起動して OS のプロトコルハンドラに委譲するため、HTTP 通信や API トークンの管理は不要です。スクレイピング・Markdown 生成・Advanced URI 構築のロジックは `src/shared/` に集約され、Chrome 拡張と iOS ショートカットの双方から再利用されます。

## Chrome 拡張

### 動作要件

- macOS 版 Obsidian (動作確認済み。Windows / Linux 版での動作は未検証)
- Advanced URI プラグイン (Vault に対して有効化済み)
- Google Chrome
- Node.js (ビルド用)

### ビルド

```sh
npm install
npm run build
```

`build/` 以下に `popup.js` `options.js` `content.js` が生成されます。開発時は `npm run watch` で esbuild の監視モードを起動できます。

### インストール

1. `chrome://extensions` を開き、デベロッパーモードを有効化
2. 「パッケージ化されていない拡張機能を読み込む」からこのリポジトリのルートディレクトリを選択

### 設定

拡張アイコンを右クリック → 「オプション」を開き、最大 2 セットの保存先を登録します。

| 項目        | 例                  | 備考                                                    |
| ----------- | ------------------- | ------------------------------------------------------- |
| Name        | `My Personal Vault` | popup のセレクタで表示される識別名                      |
| Vault Name  | `MyVault`           | Obsidian で開いている Vault 名 (URL 末尾と一致)         |
| Folder Path | `Books/Amazon`      | Vault 内のフォルダパス。空欄で Vault ルート、`/` 区切り |

### 使い方

1. Amazon 商品ページで拡張アイコンをクリック
2. 自動入力された書誌情報を必要に応じて編集
3. 保存先の Vault を選び `Add to Obsidian` を押下
4. Obsidian が起動し、指定フォルダに新規 Markdown ファイルが作成されます

ファイル名は書名をサニタイズした上で末尾に `(ASIN)` を付与します。同名ファイルが存在する場合は Advanced URI 側で `タイトル 1.md` のように連番が付与されます。

### 注意点

- **クリップボード**: 送信時に Markdown 本文をクリップボード経由で Obsidian に渡すため、それまでのクリップボード内容は上書きされます。
- **Open Obsidian? ダイアログ**: 初回起動時に Chrome が確認ダイアログを表示します。「常に許可」をチェックすると 2 回目以降は表示されません。
- **Vault 名の typo 検出は不可**: 拡張側からは Vault 一覧を取得できないため、誤入力のまま起動すると Obsidian 側でエラーになります。

## iOS ショートカット

[docs/ios-shortcut.md](docs/ios-shortcut.md) を参照してください。

## 生成される Markdown

```markdown
---
fileClass: book
book-title: '...'
book-authors: ['...']
book-publisher: '...'
book-publication-date: 2024-01-01
book-media-type: Book
book-asin: B0XXXXXXXX
book-url: 'https://...'
book-pages: 320
book-cover: 'https://...'
book-status: ''
---

![cover](https://...)

[Amazonで見る](https://...)
```

## Metadata Menu との連携 (任意)

生成される frontmatter は `fileClass: book` で識別されるよう設計されています。Obsidian の [Metadata Menu](https://github.com/mdelobelle/metadatamenu) プラグインに同梱の fileClass テンプレートを登録すると、`book-*` プロパティを型付きで編集・一覧表示できます。

1. Metadata Menu プラグインを Vault にインストールし、設定画面の「Class files path」を任意のフォルダ (例: `_meta/file-classes`) に指定する
2. リポジトリの [`docs/obsidian/book.md`](docs/obsidian/book.md) を、上記で指定したフォルダに `book.md` という名前でコピーする
3. 本拡張から生成したノートを開くと、Metadata Menu が `book-*` フィールドを認識し、型に応じた編集 UI を提供する

`book.md` 内の各フィールド `id:` は Vault 内で一意な識別子です。他の fileClass と衝突した場合は、Metadata Menu の UI 上でフィールドを開き直すと再生成されます。

## 開発

### スクリプト

| コマンド            | 内容                                         |
| ------------------- | -------------------------------------------- |
| `npm run build`     | esbuild で `build/` にバンドル               |
| `npm run watch`     | 監視モード                                   |
| `npm run typecheck` | `tsc --noEmit` による型チェック              |
| `npm run lint`      | oxlint によるリント                          |
| `npm run lint:fix`  | oxlint の自動修正                            |
| `npm run format`    | oxlint --fix と oxfmt によるフォーマット適用 |

### Git フック

`npm install` 時に [lefthook](https://github.com/evilmartians/lefthook) が pre-commit フックをセットアップします。コミット前にステージされた `*.{ts,tsx,js,mjs}` に対して oxfmt のフォーマット適用と oxlint のチェックが走り、リントエラーがあるとコミットが中断されます。
