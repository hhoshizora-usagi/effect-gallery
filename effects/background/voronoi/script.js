// 画面を粗いマス目に分け、それぞれ「一番近い点」の色でぬる → 点が動くと形が変わる
(() => {
  const colors = [[255, 61, 127], [255, 212, 0], [0, 194, 255], [124, 255, 79], [255, 122, 0], [162, 89, 255]];
  document.querySelectorAll('[data-fx="voronoi"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const SCALE = 6;                         // 1マス＝6px（大きいほど軽い）
    let w = 0, h = 0, img;
    const resize = () => {
      w = Math.ceil(cv.clientWidth / SCALE);
      h = Math.ceil(cv.clientHeight / SCALE);
      cv.width = w; cv.height = h;
      img = ctx.createImageData(w, h);
    };
    resize();
    addEventListener('resize', resize);
    const seeds = Array.from({ length: +cv.dataset.count || 12 }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * .002, vy: (Math.random() - .5) * .002,
      c: colors[i % colors.length],
    }));

    (function loop() {
      seeds.forEach((s) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0 || s.x > 1) s.vx *= -1;
        if (s.y < 0 || s.y > 1) s.vy *= -1;
      });
      const px = seeds.map((s) => [s.x * w, s.y * h]);
      const d = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let best = 1e9, second = 1e9, bi = 0;
          for (let i = 0; i < px.length; i++) {
            const dx = x - px[i][0], dy = y - px[i][1], dd = dx * dx + dy * dy;
            if (dd < best) { second = best; best = dd; bi = i; } else if (dd < second) second = dd;
          }
          const edge = Math.sqrt(second) - Math.sqrt(best) < 1.2;   // 境目は黒い線に
          const c = edge ? [17, 17, 17] : seeds[bi].c;
          const k = (y * w + x) * 4;
          d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(loop);
    })();
  });
})();
