// ホバー中は「その星まで」を光らせ、選んだら選んだ数まで点灯。中身は本物のラジオボタン
(() => {
  const msgs = ['', 'ざんねん…', 'まあまあ', 'いい感じ！', 'すごくいい！', 'さいこう！！🎉'];
  document.querySelectorAll('[data-fx="rating"]').forEach((root) => {
    const labels = [...root.querySelectorAll('label')];
    const inputs = [...root.querySelectorAll('input')];
    const msg = root.querySelector('.fx-rate__msg');
    const paint = (n, cls) => labels.forEach((l, i) => l.classList.toggle(cls, i < n));
    labels.forEach((l, i) => {
      l.addEventListener('mouseenter', () => paint(i + 1, 'is-hover'));
      l.addEventListener('mouseleave', () => paint(0, 'is-hover'));
    });
    inputs.forEach((input, i) => {
      input.addEventListener('change', () => {
        paint(i + 1, 'is-on');
        msg.textContent = `${i + 1}つ星：${msgs[i + 1]}`;
        labels.forEach((l, k) => {
          l.classList.remove('is-pop');
          if (k <= i) { void l.offsetWidth; l.style.animationDelay = `${k * .06}s`; l.classList.add('is-pop'); }
        });
      });
    });
  });
})();
