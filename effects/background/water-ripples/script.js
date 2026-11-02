// 水面に広がる波紋。ときどきランダムな場所に波紋が生まれて広がって消える
(() => {
  document.querySelectorAll('[data-fx="water-ripples"]').forEach((cv) => {
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

    const ripples = [];
    const add = () => ripples.push({ x: Math.random() * W, y: Math.random() * H, r: 0, max: 60 + Math.random() * 180, a: 0.6 });
    setInterval(add, 420);
    for (let i = 0; i < 5; i++) add();

    (function loop(t) {
      t = (t || 0) / 1000;
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#041018');
      bg.addColorStop(1, '#06202f');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // ゆらぐ光の反射
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#7fdfff';
      for (let i = 0; i < 24; i++) {
        const y = (i / 24) * H;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 24) {
          const dy = Math.sin(x * 0.02 + t * 1.5 + i) * 4;
          if (x === 0) ctx.moveTo(x, y + dy); else ctx.lineTo(x, y + dy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i];
        p.r += 1.6; p.a *= 0.985;
        if (p.r > p.max || p.a < 0.02) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(150, 230, 255, ${p.a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI * 2); ctx.stroke();
      }
      requestAnimationFrame(loop);
    })();
  });
})();
