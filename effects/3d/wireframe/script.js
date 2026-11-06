// 立体を「頂点の座標」と「どの頂点どうしを線でつなぐか」で表して、回転させて描く
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

  const shapes = {
    cube: {
      v: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map((p) => p.map((n) => n * .62)),
      e: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]],
    },
    octa: {
      v: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
      e: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [4, 3], [3, 5], [5, 2]],
    },
    pyramid: {
      v: [[0, -1, 0], [-.85, .6, -.85], [.85, .6, -.85], [.85, .6, .85], [-.85, .6, .85]],
      e: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 3], [3, 4], [4, 1]],
    },
  };
  document.querySelectorAll('[data-fx="wireframe"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const state = { ay: 0, ax: .5, vy: .015, vx: .004 };
    let shape = shapes.cube;
    draggable(cv, state);
    cv.parentElement.querySelectorAll('[data-shape]').forEach((btn, _, all) => {
      btn.addEventListener('click', () => {
        shape = shapes[btn.dataset.shape];
        all.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      });
    });
    let W, H;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    (function loop(t) {
      state.ay += state.vy; state.ax += state.vx;
      state.vy += (.015 - state.vy) * .02;
      state.vx += (.004 - state.vx) * .02;
      ctx.clearRect(0, 0, W, H);
      const pts = shape.v.map(([x, y, z]) => project({ x, y, z }, state.ay, state.ax, W * .36, W / 2, H / 2));
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 14;
      shape.e.forEach(([a, b], i) => {
        const c = `hsl(${((t || 0) / 20 + i * 25) % 360} 100% 62%)`;
        ctx.strokeStyle = c;
        ctx.shadowColor = c;
        ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
      });
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      pts.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 4 * p.k, 0, Math.PI * 2); ctx.fill(); });
      requestAnimationFrame(loop);
    })();
  });
})();
