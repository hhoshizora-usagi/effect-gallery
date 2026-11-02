// 図形を作って、大きさ・色・動く距離・速さをランダムに決める（動き自体は CSS）
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];
  const kinds = ['is-circle', 'is-ring', 'is-tri', 'is-star', 'is-pill'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  document.querySelectorAll('[data-fx="floating-shapes"]').forEach((root) => {
    const count = +root.dataset.count || 16;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      el.className = `fx-float__shape ${kinds[i % kinds.length]}`;
      el.setAttribute('aria-hidden', 'true');
      Object.entries({
        '--s': `${rnd(26, 80)}px`,
        '--c': colors[i % colors.length],
        '--d': `${rnd(3, 7)}s`,
        '--delay': `${-rnd(0, 6)}s`,
        '--dx': `${rnd(-60, 60)}px`,
        '--dy': `${rnd(-70, 70)}px`,
        '--r': `${rnd(-200, 200)}deg`,
      }).forEach(([k, v]) => el.style.setProperty(k, v));
      el.style.left = `${rnd(0, 95)}%`;
      el.style.top = `${rnd(0, 92)}%`;
      root.appendChild(el);
    }
  });
})();
