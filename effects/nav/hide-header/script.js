// 前回のスクロール位置と比べて、下に動いたら隠す・上に動いたら出す
(() => {
  document.querySelectorAll('[data-fx="hide-header"]').forEach((header) => {
    let lastY = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      const down = y > lastY && y > header.offsetHeight;   // 一番上では隠さない
      if (Math.abs(y - lastY) > 4) header.classList.toggle('is-hidden', down);
      header.classList.toggle('is-scrolled', y > 10);
      lastY = y;
    }, { passive: true });
  });
})();
