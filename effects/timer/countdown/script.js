// data-target の日時との差を、毎秒「日・時・分・秒」に分けて表示する
(() => {
  const pad = (n) => String(n).padStart(2, '0');
  document.querySelectorAll('[data-fx="countdown"]').forEach((root) => {
    let target = new Date(root.dataset.target).getTime();
    // 見本用：日付を過ぎていたら、7日後を目標にしてずっと動くようにする
    if (!(target > Date.now())) target = Date.now() + 7 * 864e5;
    const els = Object.fromEntries([...root.querySelectorAll('[data-unit]')].map((b) => [b.dataset.unit, b]));
    const set = (unit, val) => {
      const el = els[unit];
      if (el.textContent === val) return;
      el.textContent = val;
      el.classList.remove('is-tick');
      void el.offsetWidth;
      el.classList.add('is-tick');
    };
    const tick = () => {
      const left = Math.max(0, target - Date.now());
      const s = Math.floor(left / 1000);
      set('d', pad(Math.floor(s / 86400)));
      set('h', pad(Math.floor(s / 3600) % 24));
      set('m', pad(Math.floor(s / 60) % 60));
      set('s', pad(s % 60));
      root.querySelector('[role="timer"]').setAttribute('aria-label',
        `あと ${Math.floor(s / 86400)}日 ${Math.floor(s / 3600) % 24}時間 ${Math.floor(s / 60) % 60}分`);
    };
    tick();
    setInterval(tick, 1000);
  });
})();
