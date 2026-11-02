// スクロールした割合（0〜1）を CSS 変数 --p に入れる
(() => {
  const bars = document.querySelectorAll('[data-fx="progress"]');
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bars.forEach((b) => b.style.setProperty('--p', p.toFixed(4)));
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();
