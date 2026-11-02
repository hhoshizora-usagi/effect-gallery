// 点を動かして、距離が近いペアだけ線を引く（遠いほど薄く）
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#a259ff'];
  document.querySelectorAll('[data-fx="particle-network"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const LINK = 120;                        // この距離より近いとつながる
    let W = 0, H = 0, mouse = null;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);
    const pts = Array.from({ length: +cv.dataset.count || 60 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .8, vy: (Math.random() - .5) * .8,
      c: colors[i % colors.length],
    }));
    const host = cv.parentElement;
    host.addEventListener('pointermove', (e) => {
      const r = cv.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    host.addEventListener('pointerleave', () => { mouse = null; });

    const line = (a, b, max, color) => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > max) return;
      ctx.globalAlpha = 1 - d / max;
      ctx.strokeStyle = color;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    };

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) line(pts[i], pts[j], LINK, '#8fa8ff');
        if (mouse) line(pts[i], mouse, LINK * 1.6, pts[i].c);
      }
      ctx.globalAlpha = 1;
      pts.forEach((p) => {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  });
})();
