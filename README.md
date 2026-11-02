# ✦ EFFECT GALLERY

ページを派手に、楽しくするための **Web エフェクトの見本集** です。
7つの種類に分けて、41個のエフェクトを入れています。どれも **HTML・CSS・JavaScript だけ** で動きます（ライブラリは使っていません）。

| No. | 種類 | ファイル | 数 |
|----|------|---------|----|
| 01 | テキスト | `text.html` | 6 |
| 02 | マウス・カーソル | `cursor.html` | 5 |
| 03 | スクロール連動 | `scroll.html` | 6 |
| 04 | 背景・図形 | `background.html` | 6 |
| 05 | クリック・ボタン | `click.html` | 6 |
| 06 | カード・ホバー | `card.html` | 6 |
| 07 | ページ演出 | `page.html` | 6 |

---

## 見かた

`index.html` をブラウザ（Chrome / Edge / Safari / Firefox）で開くだけです。サーバーはいりません。

- 種類のページでは、エフェクトごとに **動く見本** と **コード** が並んでいます
- **↻ もう一度**：見本を最初から再生
- **〈/〉 コードを見る**：HTML / CSS / JS をタブで切りかえて、そのまま **コピー**
- **単体で開く ↗**：そのエフェクトだけのページを新しいタブで開く

> フォント（Dela Gothic One など）だけは Google Fonts からネット経由で読み込みます。オフラインのときは代わりのフォントで表示されます。

---

## 自分のページで使うには

各エフェクトは `effects/<種類>/<名前>/` に、次のファイルが入っています。

```
effects/text/wave/
├── markup.html   … 本文に貼る HTML
├── style.css     … CSS（CSS だけのエフェクトは、これと HTML だけ）
├── script.js     … JavaScript（必要なエフェクトだけ）
└── index.html    … 単体の見本ページ（自動で作られます）
```

1. `markup.html` の中身を、自分のページの `<body>` の中に貼る
2. `style.css` を読み込む（または自分の CSS ファイルに貼る）
3. `script.js` を `</body>` の直前で読み込む

```html
<link rel="stylesheet" href="style.css">
...
<script src="script.js"></script>
</body>
```

- クラス名はぜんぶ `fx-` で始まるので、ほかのデザインとぶつかりにくくしています
- JS は `data-fx="名前"` がついた要素を探して動きます。同じ要素をいくつ置いても大丈夫です
- `effects/_shared/demo.css` は見本ページの背景や中央寄せ用です。コピーする必要はありません

---

## フォルダ構成

```
effect-gallery/
├── index.html              … トップページ
├── text.html ほか 7ページ   … 種類別のギャラリー
├── assets/
│   ├── css/gallery.css     … ギャラリーのデザイン
│   └── js/gallery.js       … ギャラリーの動き（タブ・コピー・もう一度）
├── effects/
│   ├── effects.json        … 種類とエフェクトの一覧（名前・説明など）
│   ├── _shared/demo.css    … 見本ページの土台
│   └── <種類>/<名前>/       … エフェクト本体
├── tools/build.py          … ページを作り直すスクリプト
├── .nojekyll               … GitHub Pages 用
└── README.md
```

---

## エフェクトを追加・修正するとき

1. `effects/<種類>/<新しい名前>/` を作り、`markup.html`（必須）・`style.css`・`script.js` を置く
2. `effects/effects.json` の `effects` に1件追加する

   ```json
   {
     "cat": "text",
     "id": "新しい名前",
     "name": "日本語の名前",
     "en": "English Name",
     "desc": "どんな動きか",
     "use": "使いどころ",
     "files": ["HTML", "CSS", "JS"],
     "body": "",
     "height": 340,
     "hint": "見本の下に出す一言（なくてもOK）"
   }
   ```

   - `body`：見本ページの背景。`""`＝暗い色 / `"light"`＝明るい色 / `"scroll"`＝スクロールできるページ
   - `height`：ギャラリーでの見本の高さ（px）

3. ページを作り直す（Python 3 があれば OK）

   ```bash
   python3 tools/build.py
   ```

   `index.html`・種類別のページ・各見本の `index.html` が更新されます。

---

## GitHub に置いて公開する（GitHub Pages）

```bash
cd effect-gallery
git init
git add .
git commit -m "Add effect gallery"
git branch -M main
git remote add origin https://github.com/<アカウント名>/<リポジトリ名>.git
git push -u origin main
```

そのあと GitHub のリポジトリで **Settings → Pages → Branch: `main` / `(root)` → Save**。
数分で `https://<アカウント名>.github.io/<リポジトリ名>/` で見られるようになります。

---

## メモ

- 動作確認：Chrome（パソコン幅 1366px・スマホ幅 390px）
- `カード・ホバー` の「光る回転フチ」は `@property` を使っています。古いブラウザでは回らず、止まった虹色のフチになります
- 「リングカーソル」はマウスがある端末だけで動きます（スマホでは自動でオフ）
- 実際のサイトで使うときは、端末の「動きを減らす」設定（`prefers-reduced-motion`）に合わせて動きを弱めるのがおすすめです
