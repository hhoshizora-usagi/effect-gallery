// 格子状の点を、中心からの距離と時間で sin 波にして大きさと色を変える
(() => {
  document.querySelectorAll('[data-fx="dot-wave"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const GAP = 26;                          // 点の間隔
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
      ctx.clearRect(0, 0, W, H);
      for (let x = GAP / 2; x < W; x += GAP) {
        for (let y = GAP / 2; y < H; y += GAP) {
          const d = Math.hypot(x - W / 2, y - H / 2) / 60;
          const wave = Math.sin(d - t * 3);          // -1〜1
          const r = 2 + (wave + 1) * 4.5;
          ctx.fillStyle = `hsl(${(d * 30 + t * 60) % 360} 95% 60%)`;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      }
      requestAnimationFrame(loop);
    })();
  });
})();
