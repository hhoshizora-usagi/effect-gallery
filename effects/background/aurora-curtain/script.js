// 空に揺れるオーロラのカーテン。細い縦の光の帯を重ねて描く
(() => {
  const bands = [['#00ffa3', '#00c2ff'], ['#a259ff', '#ff3d7f'], ['#00ffc8', '#7cff4f']];
  document.querySelectorAll('[data-fx="aurora-curtain"]').forEach((cv) => {
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

    (function loop(t) {
      t = (t || 0) / 1000;
      ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        const pair = bands[i % bands.length];
        const x0 = W * ((i + 0.5) / 5);
        const phase = t * 0.8 + i * 1.3;
        for (let k = -40; k <= 40; k++) {
          const x = x0 + k * 8 + Math.sin(phase + k * 0.15) * 22;
          const top = H * (0.08 + Math.sin(t * 0.5 + i) * 0.03);
          const bot = H * (0.72 + Math.cos(t * 0.4 + i) * 0.05);
          const a = Math.max(0, Math.cos((k / 40) * Math.PI / 2)) * (0.25 + 0.2 * Math.sin(phase + k * 0.2));
          if (a <= 0) continue;
          const g = ctx.createLinearGradient(0, top, 0, bot);
          g.addColorStop(0, pair[0]);
          g.addColorStop(1, pair[1]);
          ctx.globalAlpha = a;
          ctx.fillStyle = g;
          ctx.fillRect(x, top, 3, bot - top);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(loop);
    })();
  });
})();
