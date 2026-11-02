// クリックした場所から、花火のように粒子が放射状にはじける
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#a259ff', '#ffffff'];
  document.querySelectorAll('[data-fx="fireworks"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = innerWidth; H = innerHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    const parts = [];
    const burst = (x, y) => {
      const n = 28;
      const base = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * .25;
        const sp = 2 + Math.random() * 4.5;
        parts.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: 1.5 + Math.random() * 2.5,
          life: 1,
          c: Math.random() < .55 ? base : colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };
    addEventListener('pointerdown', (e) => burst(e.clientX, e.clientY));

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= .018;
        p.vy += .06;              // 重力
        p.vx *= .985; p.vy *= .985;
        p.x += p.vx; p.y += p.vy; p.r *= .985;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
