// 緑の英数字コードが縦に流れ落ちる
(() => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]=+*/#$%&';
  document.querySelectorAll('[data-fx="code-rain"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, cols = 0, drops = [];
    const colW = 16;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      cols = Math.ceil(W / colW);
      drops = Array.from({ length: cols }, () => Math.random() * H / 14);
    };
    resize();
    addEventListener('resize', resize);

    (function loop() {
      ctx.fillStyle = 'rgba(3, 7, 12, 0.14)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '700 14px "JetBrains Mono", monospace';
      for (let i = 0; i < cols; i++) {
        const x = i * colW;
        const y = drops[i] * 16;
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() < 0.05 ? '#eafff2' : '#4dff88';
        ctx.fillText(ch, x, y);
        drops[i] += 0.6 + Math.random() * 0.6;
        if (y > H && Math.random() > 0.975) drops[i] = 0;
      }
      requestAnimationFrame(loop);
    })();
  });
})();
