// ① 文字を小さなキャンバスに書いて ② その点をLEDの粒として拡大して描く
(() => {
  const start = () => document.querySelectorAll('[data-fx="led-board"]').forEach((root) => {
    const cv = root.querySelector('canvas');
    const ctx = cv.getContext('2d');
    const text = root.dataset.text || 'HELLO ';
    const speed = parseFloat(root.dataset.speed) || 1;
    const ROWS = 14;                                 // 縦のLEDの数
    const src = document.createElement('canvas');    // 文字を書く下書き用
    const sctx = src.getContext('2d');
    sctx.font = `bold ${ROWS}px "Dela Gothic One", monospace`;
    const textW = Math.ceil(sctx.measureText(text).width);
    src.width = textW; src.height = ROWS;
    sctx.font = `bold ${ROWS - 1}px "Dela Gothic One", monospace`;
    sctx.fillStyle = '#fff';
    sctx.textBaseline = 'middle';
    sctx.fillText(text, 0, ROWS / 2 + 1);
    const pix = sctx.getImageData(0, 0, textW, ROWS).data;

    let W, H, cell, cols, offset = 0;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      cell = H / ROWS;
      cols = Math.ceil(W / cell);
    };
    resize();
    addEventListener('resize', resize);

    let last = 0;
    (function loop(t) {
      requestAnimationFrame(loop);
      if (t - last < 40) return;                    // カクカク感を出すため、少しずつ進める
      last = t;
      offset = (offset + speed * .5) % textW;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);
      for (let x = 0; x < cols; x++) {
        const sx = Math.floor(x + offset) % textW;
        for (let y = 0; y < ROWS; y++) {
          const on = pix[(y * textW + sx) * 4 + 3] > 100;
          ctx.fillStyle = on ? `hsl(${(sx * 3) % 360} 100% 60%)` : '#1f1a14';
          ctx.beginPath();
          ctx.arc(x * cell + cell / 2, y * cell + cell / 2, cell * .38, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    })(0);
  });
  // フォントの読み込みを待ってから文字の形を写しとる
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
})();
