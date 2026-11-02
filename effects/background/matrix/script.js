// 列ごとに「いま何行目まで落ちたか」を覚えて、毎回1文字ずつ下に描く
// 画面全体をうすい黒でぬりつぶすので、古い文字ほど暗く消えていく
(() => {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789';
  document.querySelectorAll('[data-fx="matrix"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const SIZE = 18;                         // 文字の大きさ
    let W = 0, H = 0, drops = [];
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      drops = Array.from({ length: Math.ceil(W / SIZE) }, () => Math.random() * -40);
    };
    resize();
    addEventListener('resize', resize);

    let last = 0;
    (function loop(t) {
      requestAnimationFrame(loop);
      if (t - last < 50) return;             // 1秒に20回くらいに抑える
      last = t;
      ctx.fillStyle = 'rgba(5, 3, 12, .12)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `bold ${SIZE}px monospace`;
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `hsl(${(i * 12 + t / 20) % 360} 100% 65%)`;
        ctx.fillText(ch, i * SIZE, y * SIZE);
        if (y * SIZE > H && Math.random() > .975) drops[i] = 0;   // 下まで来たら、たまに上から
        drops[i] = drops[i] + 1;
      });
    })(0);
  });
})();
