// data-values の数字から線・面・点を作り、画面に入ったら左から描く
(() => {
  // 画面に入ったら1回だけ動かす
  const onVisible = (el, fn) => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { fn(); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(el);
  };

  const NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('[data-fx="line-draw"]').forEach((fig) => {
    const vals = fig.dataset.values.split(',').map(Number);
    const max = Math.max(...vals) * 1.1, W = 400, H = 200;
    const pts = vals.map((v, i) => [(i / (vals.length - 1)) * W, H - (v / max) * H]);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const path = fig.querySelector('.fx-line__path');
    path.setAttribute('d', d);
    fig.querySelector('.fx-line__area').setAttribute('d', `${d} L${W} ${H} L0 ${H} Z`);
    path.style.setProperty('--len', path.getTotalLength() * 2);   // 線の長さぶん隠しておく
    const dots = fig.querySelector('.fx-line__dots');
    pts.forEach(([x, y], i) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 6);
      c.style.setProperty('--d', `${.2 + (i / (pts.length - 1)) * 1.4}s`);
      dots.appendChild(c);
    });
    onVisible(fig, () => fig.classList.add('is-in'));
  });
})();
