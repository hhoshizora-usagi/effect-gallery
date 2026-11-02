// 紙を1枚ずつ「位置・速さ・回転」で管理して、下まで落ちたら上に戻す
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff', '#ffffff'];
  document.querySelectorAll('[data-fx="confetti-rain"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    const make = (anyY) => ({
      x: Math.random() * W,
      y: anyY ? Math.random() * H : -20,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      vy: 1 + Math.random() * 2.2,
      sway: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .2,
      c: colors[Math.floor(Math.random() * colors.length)],
    });
    const bits = Array.from({ length: +cv.dataset.count || 100 }, () => make(true));

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      bits.forEach((b, i) => {
        b.y += b.vy; b.sway += .03; b.rot += b.vr;
        b.x += Math.sin(b.sway) * .8;
        if (b.y > H + 20) bits[i] = make(false);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.scale(1, Math.cos(b.sway * 2));   // 裏返るようにひらひら
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  });
})();
