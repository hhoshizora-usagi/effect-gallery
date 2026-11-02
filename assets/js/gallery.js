/* ============================================================
   EFFECT GALLERY — ギャラリー本体の動き
   （メニュー開閉・コード表示・タブ・コピー・もう一度再生）
   ============================================================ */
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];

  /* --- 見出しを1文字ずつに分ける（data-split） --- */
  let n = 0;
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i + (el.hasAttribute('data-wave') ? n : 0));
      s.style.setProperty('--c', colors[(i + n) % colors.length]);
      el.appendChild(s);
    });
    n += text.length;
  });

  /* --- スマホ用メニュー --- */
  const menu = document.querySelector('.g-menu');
  const nav = document.getElementById('g-nav');
  if (menu && nav) {
    const set = (open) => {
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    menu.addEventListener('click', () => set(menu.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  }

  /* --- カードごとの操作 --- */
  document.querySelectorAll('.g-card').forEach((card) => {
    const iframe = card.querySelector('iframe');
    const code = card.querySelector('.g-code');
    const toggle = card.querySelector('[data-code-toggle]');
    const replay = card.querySelector('[data-replay]');

    // もう一度：iframe を読み込み直す
    replay?.addEventListener('click', () => {
      iframe.src = iframe.getAttribute('src');
      replay.classList.remove('is-spin');
      void replay.offsetWidth;
      replay.classList.add('is-spin');
    });

    // コードを見る / とじる
    toggle?.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕ コードをとじる' : '〈/〉 コードを見る';
      code.hidden = !open;
    });

    // タブ（クリックと ← → キー）
    const tabs = [...card.querySelectorAll('.g-tab')];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });

  /* --- コピー --- */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // file:// で開いたときなど、clipboard API が使えないとき用
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };
  document.querySelectorAll('.g-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.parentElement.querySelector('code').textContent;
      const ok = await copyText(text);
      btn.textContent = ok ? 'コピーしたよ！' : 'コピーできませんでした';
      btn.classList.toggle('is-done', ok);
      setTimeout(() => {
        btn.textContent = 'コピー';
        btn.classList.remove('is-done');
      }, 1600);
    });
  });
})();
