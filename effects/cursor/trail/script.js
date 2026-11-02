// マウスの通り道に粒を置いて、少しずつ小さく・薄くする
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];
  document.querySelectorAll('[data-fx="trail"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const dots = [];
    let last = null, n = 0;

    const resize = () => {
      const d = window.devicePixelRatio || 1;
      cv.width = innerWidth * d; cv.height = innerHeight * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    addEventListener('pointermove', (e) => {
      const x = e.clientX, y = e.clientY;
      // 速く動かしても途切れないように、間を埋める
      const steps = last ? Math.min(8, Math.ceil(Math.hypot(x - last.x, y - last.y) / 10)) : 1;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        dots.push({
          x: last ? last.x + (x - last.x) * t : x,
          y: last ? last.y + (y - last.y) * t : y,
          r: 6 + Math.random() * 9,
          vx: (Math.random() - .5) * 1.2,
          vy: (Math.random() - .5) * 1.2 + .4,
          life: 1,
          c: colors[n++ % colors.length],
        });
      }
      last = { x, y };
    });
    document.addEventListener('pointerleave', () => { last = null; });

    (function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = dots.length - 1; i >= 0; i--) {
        const p = dots[i];
        p.life -= .022; p.x += p.vx; p.y += p.vy; p.r *= .975;
        if (p.life <= 0) { dots.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
