// 粒が渦を巻きながら中心へ吸い込まれる背景。少しずつ薄く描いて残像を作る
(() => {
  const colors = ['#00c2ff', '#a259ff', '#ff3d7f', '#7cff4f', '#ffd400'];
  document.querySelectorAll('[data-fx="particle-vortex"]').forEach((cv) => {
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

    const N = 320, pts = [];
    const R = () => Math.hypot(W, H) * 0.55;
    const spawn = (p) => {
      p.a = Math.random() * Math.PI * 2;
      p.r = R() * (0.5 + Math.random() * 0.6);
      p.sp = 0.02 + Math.random() * 0.03;
      p.sz = 1 + Math.random() * 1.6;
      p.c = colors[Math.floor(Math.random() * colors.length)];
      return p;
    };
    for (let i = 0; i < N; i++) pts.push(spawn({}));

    (function loop() {
      const cx = W / 2, cy = H / 2, RR = R();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(8, 6, 15, 0.16)';
      ctx.fillRect(0, 0, W, H);
      // 中心の淡い光
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, RR * 0.4);
      g.addColorStop(0, 'rgba(120, 90, 255, 0.35)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.fillRect(cx - RR, cy - RR, RR * 2, RR * 2);
      pts.forEach((p) => {
        const spin = 1 + (1 - p.r / RR) * 4;   // 中心に近いほど速く回る
        p.a += p.sp * spin;
        p.r *= 0.986;
        if (p.r < 8) spawn(p);
        const x = cx + Math.cos(p.a) * p.r;
        const y = cy + Math.sin(p.a) * p.r;
        ctx.globalAlpha = 0.5 + (1 - p.r / RR) * 0.5;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(x, y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(loop);
    })();
  });
})();
