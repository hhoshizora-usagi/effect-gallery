// スクロールの進み具合を0〜1で取り、色相（hue）を移り変わらせる
(() => {
  document.querySelectorAll('[data-fx="bg-color-shift"]').forEach(() => {
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      document.documentElement.style.setProperty('--hue', (260 + p * 220).toFixed(1));
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });
})();
