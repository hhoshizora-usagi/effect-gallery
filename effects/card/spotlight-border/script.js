// グループ全体でマウスを見て、カードごとに「カードから見たマウスの位置」を入れる
(() => {
  document.querySelectorAll('[data-fx="spotlight-border"]').forEach((group) => {
    const cards = [...group.children];
    group.addEventListener('pointermove', (e) => {
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    group.addEventListener('pointerleave', () => {
      cards.forEach((card) => {
        card.style.setProperty('--mx', '-999px');
        card.style.setProperty('--my', '-999px');
      });
    });
  });
})();
