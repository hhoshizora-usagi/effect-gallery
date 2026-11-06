// 雪の粒ごとに大きさ・速さ・ゆれ方を持たせる。大きい粒ほど手前＝速く落ちる
(() => {
  document.querySelectorAll('[data-fx="snow"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, wind = 0, windTarget = 0;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);
    const make = (anyY) => {
      const r = .8 + Math.random() ** 2 * 4;
      return { x: Math.random() * W, y: anyY ? Math.random() * H : -10, r, vy: .3 + r * .35, sway: Math.random() * 6 };
    };
    const flakes = Array.from({ length: +cv.dataset.count || 120 }, () => make(true));

    cv.parentElement.addEventListener('pointermove', (e) => {
      const rect = cv.getBoundingClientRect();
      windTarget = ((e.clientX - rect.left) / rect.width - .5) * 4;   // 左右の位置で風向き
    });
    cv.parentElement.addEventListener('pointerleave', () => { windTarget = 0; });

    (function loop() {
      wind += (windTarget - wind) * .02;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      flakes.forEach((f, i) => {
        f.sway += .02;
        f.y += f.vy;
        f.x += Math.sin(f.sway) * .5 + wind * f.r * .3;
        if (f.y > H + 10) flakes[i] = make(false);
        if (f.x > W + 10) f.x = -10;
        if (f.x < -10) f.x = W + 10;
        ctx.globalAlpha = .5 + f.r / 10;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
