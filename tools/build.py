#!/usr/bin/env python3
"""
Effect Gallery ビルドスクリプト（Python 3 標準ライブラリだけで動きます）

  python3 tools/build.py

effects/effects.json と effects/<種類>/<名前>/ の中身から、次のファイルを作り直します。
  - effects/<種類>/<名前>/index.html … エフェクト単体の見本ページ
  - <種類>.html                       … 種類別のギャラリーページ（text.html など）
  - index.html                        … トップページ

エフェクトを追加・修正したら、このスクリプトをもう一度実行してください。
"""
import html
import json
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FX_DIR = os.path.join(ROOT, 'effects')

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Dela+Gothic+One&family=JetBrains+Mono:wght@500;800&'
         'family=Zen+Kaku+Gothic+New:wght@500;700&display=swap">')

ICON = ('<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' '
        'viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E">')

LANG_FILES = [('HTML', 'markup.html'), ('CSS', 'style.css'), ('JS', 'script.js')]


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)


def esc(s):
    return html.escape(s, quote=True)


def highlight(code, lang):
    """コメントだけ色分けする、ごく簡単なハイライト"""
    s = esc(code.rstrip('\n'))
    if lang == 'HTML':
        s = re.sub(r'(&lt;!--.*?--&gt;)', r'<span class="c">\1</span>', s, flags=re.S)
    elif lang == 'CSS':
        s = re.sub(r'(/\*.*?\*/)', r'<span class="c">\1</span>', s, flags=re.S)
    else:
        s = re.sub(r'(/\*.*?\*/)', r'<span class="c">\1</span>', s, flags=re.S)
        s = re.sub(r'(^|[^:\'"])(//[^\n]*)', r'\1<span class="c">\2</span>', s)
    return s


# ---------------------------------------------------------------- 単体ページ
def build_demo(fx):
    d = os.path.join(FX_DIR, fx['cat'], fx['id'])
    markup = read(os.path.join(d, 'markup.html')).rstrip()
    has_css = os.path.exists(os.path.join(d, 'style.css'))
    has_js = os.path.exists(os.path.join(d, 'script.js'))
    body_cls = ' '.join(filter(None, ['demo', fx.get('body', '')]))
    hint = f'\n<p class="demo-hint" aria-hidden="true">{esc(fx["hint"])}</p>' if fx.get('hint') else ''
    page = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(fx["name"])}（{esc(fx["en"])}）| EFFECT GALLERY</title>
{ICON}
{FONTS}
<!-- demo.css は見本ページの土台（背景・中央寄せ）だけ。エフェクト本体は style.css / script.js -->
<link rel="stylesheet" href="../../_shared/demo.css">
{'<link rel="stylesheet" href="style.css">' if has_css else ''}
</head>
<body class="{body_cls}">
{markup}{hint}
{'<script src="script.js"></script>' if has_js else ''}
</body>
</html>
'''
    write(os.path.join(d, 'index.html'), re.sub(r'\n{3,}', '\n\n', page))


# ---------------------------------------------------------------- 共通パーツ
def header(cats, current=None):
    cur = ' aria-current="page"'
    pills = '\n'.join(
        f'      <li><a class="g-pill{" is-current" if c["id"] == current else ""}" href="{c["id"]}.html" '
        f'style="--cat:{c["color"]};--on:{c["ink"]}"'
        f'{cur if c["id"] == current else ""}>'
        f'<span>{c["no"]}</span>{esc(c["name"])}</a></li>' for c in cats)
    return f'''<a class="g-skip" href="#main">本文へスキップ</a>
<header class="g-header">
  <a class="g-logo" href="index.html" aria-label="EFFECT GALLERY トップへ">
    <span class="g-logo__mark" aria-hidden="true">✦</span>EFFECT<b>GALLERY</b>
  </a>
  <button class="g-menu" aria-expanded="false" aria-controls="g-nav">
    <span class="g-menu__bars" aria-hidden="true"></span>種類
  </button>
  <nav class="g-nav" id="g-nav" aria-label="エフェクトの種類">
    <ul>
{pills}
    </ul>
  </nav>
</header>'''


def footer(total):
    return f'''<footer class="g-footer">
  <p class="g-footer__big" aria-hidden="true">MAKE IT MOVE ✦ MAKE IT MOVE ✦ MAKE IT MOVE ✦ MAKE IT MOVE ✦ </p>
  <p>EFFECT GALLERY — {total} effects / HTML・CSS・JavaScript だけで動きます（ライブラリ不要）</p>
</footer>'''


def page_shell(title, desc, body, extra_class=''):
    return f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta name="theme-color" content="#111111">
{ICON}
{FONTS}
<link rel="stylesheet" href="assets/css/gallery.css">
</head>
<body class="{extra_class}">
{body}
<script src="assets/js/gallery.js"></script>
</body>
</html>
'''


# ---------------------------------------------------------------- 種類別ページ
def code_block(fx):
    d = os.path.join(FX_DIR, fx['cat'], fx['id'])
    tabs, panels = [], []
    langs = [(l, fn) for l, fn in LANG_FILES if os.path.exists(os.path.join(d, fn))]
    for i, (lang, fn) in enumerate(langs):
        pid = f'code-{fx["cat"]}-{fx["id"]}-{lang.lower()}'
        sel = 'true' if i == 0 else 'false'
        tabs.append(f'<button class="g-tab" role="tab" id="{pid}-tab" aria-controls="{pid}" '
                    f'aria-selected="{sel}" tabindex="{0 if i == 0 else -1}">{lang}<small>{fn}</small></button>')
        code = highlight(read(os.path.join(d, fn)), lang)
        panels.append(f'''<div class="g-panel" role="tabpanel" id="{pid}" aria-labelledby="{pid}-tab"{"" if i == 0 else " hidden"}>
            <button class="g-copy" type="button">コピー</button>
            <pre tabindex="0"><code>{code}</code></pre>
          </div>''')
    return f'''<div class="g-code" hidden>
          <div class="g-tabs" role="tablist" aria-label="{esc(fx["name"])}のコード">
            {"".join(tabs)}
          </div>
          {"".join(panels)}
          <p class="g-code__path">📁 effects/{fx["cat"]}/{fx["id"]}/</p>
        </div>'''


def build_category(cat, cats, effects, total):
    items = [e for e in effects if e['cat'] == cat['id']]
    idx = [c['id'] for c in cats].index(cat['id'])
    prev_c = cats[idx - 1] if idx > 0 else None
    next_c = cats[idx + 1] if idx < len(cats) - 1 else None

    cards = []
    for n, fx in enumerate(items, 1):
        src = f'effects/{fx["cat"]}/{fx["id"]}/index.html'
        chips = ''.join(f'<li class="g-chip g-chip--{t.lower()}">{t}</li>' for t in fx['files'])
        cards.append(f'''
      <article class="g-card" id="{fx["id"]}">
        <header class="g-card__head">
          <span class="g-card__no">{n:02d}</span>
          <div class="g-card__titles">
            <h2 class="g-card__title">{esc(fx["name"])}</h2>
            <p class="g-card__en">{esc(fx["en"])}</p>
          </div>
          <ul class="g-chips" aria-label="使っている言語">{chips}</ul>
        </header>
        <div class="g-stage">
          <iframe src="{src}" title="{esc(fx["name"])}の見本" loading="lazy" style="height:{fx.get("height", 340)}px"></iframe>
        </div>
        <div class="g-card__body">
          <p class="g-card__desc">{esc(fx["desc"])}</p>
          <p class="g-card__use"><b>使いどころ</b>{esc(fx["use"])}</p>
          <div class="g-actions">
            <button class="g-btn g-btn--replay" type="button" data-replay>↻ もう一度</button>
            <button class="g-btn g-btn--code" type="button" data-code-toggle aria-expanded="false">〈/〉 コードを見る</button>
            <a class="g-btn g-btn--open" href="{src}" target="_blank" rel="noopener">単体で開く ↗</a>
          </div>
        </div>
        {code_block(fx)}
      </article>''')

    tape_words = ' ✦ '.join(f['en'].upper() for f in items) + ' ✦ '
    pager = '<nav class="g-pager" aria-label="ほかの種類">'
    pager += (f'<a class="g-pager__link" href="{prev_c["id"]}.html" style="--cat:{prev_c["color"]};--on:{prev_c["ink"]}">'
              f'<small>← 前の種類</small>{esc(prev_c["name"])}</a>') if prev_c else '<span></span>'
    pager += (f'<a class="g-pager__link g-pager__link--next" href="{next_c["id"]}.html" style="--cat:{next_c["color"]};--on:{next_c["ink"]}">'
              f'<small>次の種類 →</small>{esc(next_c["name"])}</a>') if next_c else \
             '<a class="g-pager__link g-pager__link--next" href="index.html"><small>トップへ →</small>ぜんぶの種類</a>'
    pager += '</nav>'

    jump = ''.join(f'<li><a href="#{f["id"]}">{esc(f["name"])}</a></li>' for f in items)

    body = f'''{header(cats, cat["id"])}
<main id="main">
  <section class="g-hero" style="--cat:{cat["color"]};--on:{cat["ink"]}">
    <p class="g-hero__no">{cat["no"]} <span>/ {len(cats):02d}</span></p>
    <h1 class="g-hero__title"><span class="g-hero__en" data-split style="--len:{len(cat["en"])}">{cat["en"]}</span><span class="g-hero__jp">{esc(cat["name"])}</span></h1>
    <p class="g-hero__desc">{esc(cat["desc"])}</p>
    <p class="g-hero__count" aria-label="{len(items)}種類"><b>{len(items)}</b>EFFECTS</p>
  </section>
  <div class="g-tape" aria-hidden="true" style="--cat:{cat["color"]};--on:{cat["ink"]}">
    <div class="g-tape__track"><span>{esc(tape_words * 2)}</span><span>{esc(tape_words * 2)}</span></div>
  </div>
  <nav class="g-jump" aria-label="この種類のエフェクト">
    <ul>{jump}</ul>
  </nav>
  <div class="g-grid">{"".join(cards)}
  </div>
  {pager}
</main>
{footer(total)}'''
    title = f'{cat["name"]}（{cat["en"]}）のエフェクト | EFFECT GALLERY'
    write(os.path.join(ROOT, f'{cat["id"]}.html'),
          page_shell(title, cat['desc'], body, f'is-cat cat-{cat["id"]}'))


# ---------------------------------------------------------------- トップページ
def build_index(cats, effects):
    total = len(effects)
    tiles = []
    for c in cats:
        items = [e for e in effects if e['cat'] == c['id']]
        names = ''.join(f'<li>{esc(e["name"])}</li>' for e in items)
        tiles.append(f'''
      <a class="g-tile" href="{c["id"]}.html" style="--cat:{c["color"]};--on:{c["ink"]}">
        <span class="g-tile__no">{c["no"]}</span>
        <span class="g-tile__count"><b>{len(items)}</b>種類</span>
        <strong class="g-tile__en">{c["en"]}</strong>
        <span class="g-tile__jp">{esc(c["name"])}</span>
        <span class="g-tile__desc">{esc(c["desc"])}</span>
        <ul class="g-tile__list">{names}</ul>
        <span class="g-tile__go" aria-hidden="true">→</span>
      </a>''')

    all_list = []
    for c in cats:
        items = [e for e in effects if e['cat'] == c['id']]
        links = ''.join(f'<li><a href="{c["id"]}.html#{e["id"]}">{esc(e["name"])}<small>{esc(e["en"])}</small></a></li>' for e in items)
        all_list.append(f'<div class="g-index__col" style="--cat:{c["color"]};--on:{c["ink"]}"><h3><span>{c["no"]}</span>{esc(c["name"])}</h3><ul>{links}</ul></div>')

    tape = ' ✦ '.join(c['en'] for c in cats) + ' ✦ '
    body = f'''{header(cats)}
<main id="main">
  <section class="g-top">
    <div class="g-top__shapes" aria-hidden="true">
      <i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="s4"></i><i class="s5"></i><i class="s6"></i>
    </div>
    <p class="g-top__kicker">{len(cats)} CATEGORIES ✦ {total} EFFECTS</p>
    <h1 class="g-top__title">
      <span class="g-top__line" data-split data-wave>EFFECT</span>
      <span class="g-top__line g-top__line--2" data-split data-wave>GALLERY</span>
    </h1>
    <p class="g-top__lead">ページを、もっと派手に。もっと楽しく。<br>コピーしてすぐ使える、動きの見本帳。</p>
    <a class="g-top__cta" href="#categories">種類から選ぶ ↓</a>
    <span class="g-top__sticker" aria-hidden="true">NO<br>LIBRARY!</span>
  </section>

  <div class="g-tape g-tape--rainbow" aria-hidden="true">
    <div class="g-tape__track"><span>{tape * 2}</span><span>{tape * 2}</span></div>
  </div>

  <section class="g-section" id="categories">
    <h2 class="g-section__title"><span>CATEGORIES</span>エフェクトの種類</h2>
    <div class="g-tiles">{"".join(tiles)}
    </div>
  </section>

  <section class="g-section g-how">
    <h2 class="g-section__title"><span>HOW TO USE</span>使い方</h2>
    <ol class="g-steps">
      <li><b>1</b><h3>見本で選ぶ</h3><p>種類のページで、実際に動く見本をさわって選びます。</p></li>
      <li><b>2</b><h3>コードをコピー</h3><p>「コードを見る」を押して、HTML・CSS・JS をそれぞれコピーします。</p></li>
      <li><b>3</b><h3>自分のページに貼る</h3><p>HTML は本文に、CSS は .css ファイルに、JS は .js ファイルに貼れば動きます。</p></li>
    </ol>
  </section>

  <section class="g-section g-index">
    <h2 class="g-section__title"><span>ALL EFFECTS</span>ぜんぶのエフェクト</h2>
    <div class="g-index__grid">{"".join(all_list)}</div>
  </section>
</main>
{footer(total)}'''
    write(os.path.join(ROOT, 'index.html'),
          page_shell('EFFECT GALLERY | コピーして使える Web エフェクト集',
                     f'テキスト・カーソル・スクロール・背景・クリック・カード・ページ演出の{len(cats)}種類、{total}個の Web エフェクト見本集。',
                     body, 'is-top'))


def main():
    data = json.loads(read(os.path.join(FX_DIR, 'effects.json')))
    cats, effects = data['categories'], data['effects']
    for fx in effects:
        build_demo(fx)
    for c in cats:
        build_category(c, cats, effects, len(effects))
    build_index(cats, effects)
    print(f'OK: {len(cats)} categories / {len(effects)} effects')


if __name__ == '__main__':
    main()
