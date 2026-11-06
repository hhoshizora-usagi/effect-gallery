// 球の表面に点を均等にならべて（フィボナッチ球）、回転させながら描く
(() => {
  // 点 (x, y, z) を Y軸・X軸まわりに回転させてから、遠近法で画面の座標にする
  const project = (p, ay, ax, size, cx, cy) => {
    let { x, y, z } = p;
    [x, z] = [x * Math.cos(ay) - z * Math.sin(ay), x * Math.sin(ay) + z * Math.cos(ay)];
    [y, z] = [y * Math.cos(ax) - z * Math.sin(ax), y * Math.sin(ax) + z * Math.cos(ax)];
    const k = 3 / (3 + z);                 // 奥にあるほど小さく
    return { x: cx + x * size * k, y: cy + y * size * k, z, k };
  };
  // ドラッグで回せるようにする（離すと、勢いが少し残る）
  const draggable = (el, state) => {
    let last = null;
    el.addEventListener('pointerdown', (e) => { last = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (!last) return;
      state.vy = (e.clientX - last.x) * .01;
      state.vx = (e.clientY - last.y) * .01;
      last = { x: e.clientX, y: e.clientY };
    });
    const up = () => { last = null; };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  document.querySelectorAll('[data-fx="sphere"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const n = +cv.dataset.count || 400;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: n }, (_, i) => {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = golden * i;
      return { x: Math.cos(t) * r, y, z: Math.sin(t) * r, h: (i / n) * 360 };
    });
    const state = { ay: 0, ax: -.3, vy: .008, vx: 0 };
    draggable(cv, state);
    let W, H;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    (function loop() {
      state.ay += state.vy; state.ax += state.vx;
      state.vy += (.008 - state.vy) * .02;   // 少しずつ、いつもの回転に戻る
      state.vx *= .95;
      ctx.clearRect(0, 0, W, H);
      pts.map((p) => ({ ...project(p, state.ay, state.ax, W * .38, W / 2, H / 2), h: p.h }))
        .sort((a, b) => b.z - a.z)            // 奥から順に描く
        .forEach((p) => {
          ctx.globalAlpha = .25 + (1 - (p.z + 1) / 2) * .75;
          ctx.fillStyle = `hsl(${p.h} 95% 62%)`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.6 * p.k, 0, Math.PI * 2); ctx.fill();
        });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
