// ひらひら落ちる桜の花びら。ゆれながら回って舞い落ちる
(() => {
  const shades = ['#ffb6d0', '#ff9cc0', '#ffc4da', '#ff86b4'];
  document.querySelectorAll('[data-fx="sakura-petals"]').forEach((cv) => {
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

    function spawn(p, init) {
      p.x = Math.random() * W;
      p.y = init ? Math.random() * H : -20 - Math.random() * H * 0.5;
      p.s = 8 + Math.random() * 12;
      p.vy = 1 + Math.random() * 1.6;
      p.sway = 0.6 + Math.random() * 1.4;
      p.ph = Math.random() * Math.PI * 2;
      p.rot = Math.random() * Math.PI * 2;
      p.vr = (Math.random() - .5) * 0.05;
      p.c = shades[Math.floor(Math.random() * shades.length)];
      return p;
    }
    const petals = Array.from({ length: 40 }, () => spawn({}, true));

    (function loop(t) {
      t = (t || 0) / 1000;
      ctx.clearRect(0, 0, W, H);
      petals.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(t * p.sway + p.ph) * 0.8;
        p.rot += p.vr;
        if (p.y > H + 20) spawn(p, false);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.ellipse(-p.s * 0.3, -p.s * 0.1, p.s * 0.15, p.s * 0.4, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  });
})();
