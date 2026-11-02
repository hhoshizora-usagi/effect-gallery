// 図形ごとに「元の位置」と「ずれ」を持ち、マウスから押し出す力とばねで戻る力を毎フレーム計算
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];
  const kinds = ['is-circle', 'is-ring', 'is-tri', 'is-star', 'is-square'];
  document.querySelectorAll('[data-fx="repel"]').forEach((root) => {
    const count = +root.dataset.count || 24;
    const R = 140;                         // マウスの影響が届く半径
    let mouse = { x: -9999, y: -9999 };
    const items = Array.from({ length: count }, (_, i) => {
      const el = document.createElement('i');
      el.className = `fx-repel__shape ${kinds[i % kinds.length]}`;
      el.style.setProperty('--s', `${24 + Math.random() * 34}px`);
      el.style.setProperty('--c', colors[i % colors.length]);
      el.setAttribute('aria-hidden', 'true');
      root.appendChild(el);
      return { el, bx: Math.random(), by: Math.random(), ox: 0, oy: 0, vx: 0, vy: 0, rot: Math.random() * 360 };
    });

    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    root.addEventListener('pointerleave', () => { mouse = { x: -9999, y: -9999 }; });

    (function loop() {
      const W = root.clientWidth, H = root.clientHeight;
      items.forEach((p) => {
        const x = p.bx * W + p.ox, y = p.by * H + p.oy;
        const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy) || 1;
        if (d < R) {                       // 近いほど強く押し出す
          const f = (R - d) / R * 4;
          p.vx += dx / d * f; p.vy += dy / d * f;
        }
        p.vx += -p.ox * .04; p.vy += -p.oy * .04;   // ばねで元の位置へ
        p.vx *= .86; p.vy *= .86;                   // 少しずつ止まる
        p.ox += p.vx; p.oy += p.vy;
        p.el.style.transform = `translate(${x}px, ${y}px) rotate(${p.rot + p.ox}deg)`;
      });
      requestAnimationFrame(loop);
    })();
  });
})();
