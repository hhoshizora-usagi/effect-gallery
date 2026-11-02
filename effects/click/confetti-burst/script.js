// クリックした点から、ランダムな方向・速さで紙を飛ばす（重力と空気抵抗つき）
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];
  const cv = document.querySelector('[data-fx="confetti-burst"]');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const bits = [];
  const resize = () => {
    const d = window.devicePixelRatio || 1;
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const burst = (x, y, n) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 4 + Math.random() * (n > 60 ? 12 : 7);
      bits.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4,
        w: 5 + Math.random() * 6, h: 8 + Math.random() * 8,
        rot: Math.random() * 6, vr: (Math.random() - .5) * .4,
        life: 1, c: colors[i % colors.length],
      });
    }
  };
  addEventListener('pointerdown', (e) => {
    const big = e.target.closest('[data-burst="big"]');
    burst(e.clientX, e.clientY, big ? 120 : 40);
  });

  (function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.vy += .25; b.vx *= .985; b.vy *= .985;   // 重力と空気抵抗
      b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.life -= .008;
      if (b.life <= 0 || b.y > innerHeight + 40) { bits.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.min(1, b.life * 2);
      ctx.translate(b.x, b.y); ctx.rotate(b.rot);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    requestAnimationFrame(loop);
  })();
})();
