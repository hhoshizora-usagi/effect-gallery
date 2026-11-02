// 斜めに走る光の筋。画面の外に出たら反対側からまた走らせる
(() => {
  const colors = ['#00c2ff', '#a259ff', '#ff3d7f', '#7cff4f', '#ffd400'];
  document.querySelectorAll('[data-fx="light-streaks"]').forEach((cv) => {
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

    const make = () => ({
      x: -Math.random() * W * 1.6,
      y: Math.random() * H,
      len: 120 + Math.random() * 300,
      sp: 4 + Math.random() * 7,
      w: 1 + Math.random() * 2.4,
      a: .15 + Math.random() * .55,
      c: colors[Math.floor(Math.random() * colors.length)],
    });
    const streaks = Array.from({ length: 14 }, make);

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      streaks.forEach((s) => {
        s.x += s.sp;
        s.y -= s.sp * .5;
        if (s.x > W + s.len || s.y < -s.len) Object.assign(s, make(), { x: -s.len, y: Math.random() * H });
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y + s.len * .5);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(.5, s.c);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = s.a;
        ctx.strokeStyle = g;
        ctx.lineWidth = s.w;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len * .5);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
