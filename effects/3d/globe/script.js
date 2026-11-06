// 緯度・経度の線を点の列として作り、回転させて線でつなぐ。都市は光る点で表す
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

  const toXYZ = (lat, lon) => {
    const a = lat * Math.PI / 180, b = lon * Math.PI / 180;
    return { x: Math.cos(a) * Math.sin(b), y: -Math.sin(a), z: Math.cos(a) * Math.cos(b) };
  };
  // 見本の都市（緯度, 経度）：東京・シンガポール・ロンドン・ニューヨーク・シドニー・カイロ・サンパウロ
  const cities = [[35.7, 139.7], [1.35, 103.8], [51.5, -0.1], [40.7, -74], [-33.9, 151.2], [30, 31.2], [-23.5, -46.6]]
    .map(([la, lo]) => toXYZ(la, lo));
  const lines = [];
  for (let lat = -60; lat <= 60; lat += 30) lines.push(Array.from({ length: 73 }, (_, i) => toXYZ(lat, i * 5)));
  for (let lon = 0; lon < 180; lon += 30) lines.push(Array.from({ length: 73 }, (_, i) => toXYZ(i * 5 - 180, lon)));

  document.querySelectorAll('[data-fx="globe"]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const state = { ay: 0, ax: -.35, vy: .006, vx: 0 };
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

    (function loop(t) {
      state.ay += state.vy; state.ax += state.vx;
      state.vy += (.006 - state.vy) * .02;
      state.vx *= .95;
      const R = W * .4;
      ctx.clearRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(W / 2, H / 2, R * .2, W / 2, H / 2, R * 1.1);
      glow.addColorStop(0, 'rgba(0, 194, 255, .25)');
      glow.addColorStop(1, 'rgba(0, 194, 255, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1.2;
      lines.forEach((line) => {
        for (let i = 1; i < line.length; i++) {
          const a = project(line[i - 1], state.ay, state.ax, R, W / 2, H / 2);
          const b = project(line[i], state.ay, state.ax, R, W / 2, H / 2);
          const front = (a.z + b.z) / 2 < 0;     // 手前の線は濃く、裏側は薄く
          ctx.strokeStyle = front ? 'rgba(0, 224, 198, .9)' : 'rgba(0, 224, 198, .15)';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      });
      cities.forEach((c, i) => {
        const p = project(c, state.ay, state.ax, R, W / 2, H / 2);
        if (p.z > 0) return;                     // 裏側の都市は描かない
        const pulse = 4 + Math.sin((t || 0) / 300 + i) * 2;
        ctx.fillStyle = '#ffd400';
        ctx.beginPath(); ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255, 61, 127, .8)';
        ctx.beginPath(); ctx.arc(p.x, p.y, pulse * 2.2, 0, Math.PI * 2); ctx.stroke();
      });
      requestAnimationFrame(loop);
    })();
  });
})();
