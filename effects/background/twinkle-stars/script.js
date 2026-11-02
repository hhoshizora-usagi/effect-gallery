// 星々がきらめき、近くの星どうしがうっすら線で結ばれる
(() => {
  document.querySelectorAll('[data-fx="twinkle-stars"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, stars = [];
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const build = () => {
      stars = Array.from({ length: 110 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.6 + Math.random() * 1.8,
        ph: Math.random() * Math.PI * 2,
        sp: 0.5 + Math.random() * 2.2,
      }));
    };
    resize(); build();
    addEventListener('resize', () => { resize(); build(); });

    (function loop(t) {
      t = (t || 0) / 1000;
      ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i], b = stars[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const al = (1 - Math.sqrt(d2) / 120) * 0.25;
            ctx.strokeStyle = `rgba(140, 200, 255, ${al})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      stars.forEach((s) => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.sp + s.ph);
        ctx.globalAlpha = 0.35 + tw * 0.65;
        ctx.fillStyle = '#dff0ff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (0.7 + tw * 0.6), 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
