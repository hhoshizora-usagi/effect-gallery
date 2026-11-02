// 奥へずらっと並んだ立方体を、カメラがゆっくり旋回しながら描く
// （点を3Dで回転して投影し、奥のものから順に描く）
(() => {
  const colors = ['#00c2ff', '#ff3d7f', '#7cff4f', '#ffd400', '#a259ff'];
  const VERT = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const EDGE = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  document.querySelectorAll('[data-fx="cube-tiles"]').forEach((cv) => {
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

    const cols = 8, rows = 6, S = 0.55, GAP = 2.1, FOV = 460;
    const cubes = [];
    for (let gz = 0; gz < rows; gz++) {
      for (let gx = 0; gx < cols; gx++) {
        cubes.push({
          x: (gx - (cols - 1) / 2) * GAP,
          z: gz * 2.6 + 3,
          ph: Math.random() * Math.PI * 2,
          c: colors[(gx + gz) % colors.length],
        });
      }
    }
    let cam = 0;
    (function loop(t) {
      t = (t || 0) / 1000;
      cam += 0.004;
      ctx.clearRect(0, 0, W, H);
      const s = Math.sin(cam), c = Math.cos(cam);
      const project = (x, y, z) => {
        const rx = x * c - z * s;
        const rz = x * s + z * c;
        const depth = rz + 15;
        if (depth < 1.2) return null;
        const f = FOV / depth;
        return { x: W / 2 + rx * f, y: H / 2 + y * f };
      };
      const order = cubes.slice().sort((a, b) => (a.z * c - a.x * s) - (b.z * c - b.x * s));
      order.forEach((cu) => {
        const bob = Math.sin(t * 1.2 + cu.ph) * 0.25;
        const pts = VERT.map((v) => project(cu.x + v[0] * S, bob + v[1] * S, cu.z + v[2] * S));
        if (pts.some((p) => !p)) return;
        ctx.strokeStyle = cu.c;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.4;
        EDGE.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        });
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  });
})();
