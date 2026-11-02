// 地平線に向かって収束する縦線と、手前へ流れてくる横線でスピード感を出す
(() => {
  document.querySelectorAll('[data-fx="perspective-grid"]').forEach((cv) => {
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

    const LINES = 22, ROWS = 26;
    let off = 0;
    (function loop() {
      off += 0.006;
      if (off >= 1) off -= 1;
      ctx.clearRect(0, 0, W, H);
      const hy = H * 0.44;            // 地平線
      const cxp = W * 0.5;            // 消失点
      // 縦線（奥で1点に収束）
      ctx.strokeStyle = 'rgba(0, 194, 255, 0.55)';
      ctx.lineWidth = 1;
      for (let i = -LINES; i <= LINES; i++) {
        ctx.beginPath();
        ctx.moveTo(cxp + i * (W / LINES) * 0.12, hy);
        ctx.lineTo(cxp + i * (W / LINES) * 1.5, H);
        ctx.stroke();
      }
      // 横線（奥から手前へ流れる）
      for (let r = 0; r < ROWS; r++) {
        const t = (r / ROWS + off) % 1;
        const y = hy + t * t * (H - hy) * 1.2;
        if (y > H) continue;
        ctx.strokeStyle = `rgba(124, 255, 79, ${0.12 + t * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      // 地平線の光
      ctx.strokeStyle = 'rgba(0, 194, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(W, hy);
      ctx.stroke();
      requestAnimationFrame(loop);
    })();
  });
})();
