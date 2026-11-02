// 大きなぼやけた色のかたまりが、ゆっくり漂って混ざり合う
(() => {
  const colors = ['#ff3d7f', '#7cff4f', '#00c2ff', '#a259ff', '#ffd400', '#00ffc8'];
  document.querySelectorAll('[data-fx="soft-blobs"]').forEach((cv) => {
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

    const blobs = colors.map((c) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.min(W, H) * (0.18 + Math.random() * 0.18),
      vx: (Math.random() - .5) * 0.6, vy: (Math.random() - .5) * 0.6,
      c, ph: Math.random() * Math.PI * 2,
    }));
    (function loop(t) {
      t = (t || 0) / 1000;
      ctx.fillStyle = '#0b0714'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach((b) => {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;
        const rr = b.r * (1 + Math.sin(t * 0.7 + b.ph) * 0.15);
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rr);
        g.addColorStop(0, b.c);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, rr, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(loop);
    })();
  });
})();
