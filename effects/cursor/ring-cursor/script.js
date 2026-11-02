// 点はマウスにぴったり、輪っかは少し遅れてなめらかについてくる
(() => {
  if (!matchMedia('(pointer: fine)').matches) return;   // スマホでは使わない
  document.querySelectorAll('[data-fx="ring-cursor"]').forEach((root) => {
    const dot = root.querySelector('.fx-cursor__dot');
    const ring = root.querySelector('.fx-cursor__ring');
    let mx = -100, my = -100, rx = mx, ry = my;
    document.documentElement.classList.add('fx-cursor-on');

    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      root.classList.add('is-visible');
      const hover = e.target.closest('a, button, [data-cursor-hover]');
      root.classList.toggle('is-hover', !!hover);
    });
    document.addEventListener('pointerleave', () => root.classList.remove('is-visible'));
    addEventListener('pointerdown', () => root.classList.add('is-down'));
    addEventListener('pointerup', () => root.classList.remove('is-down'));

    (function loop() {
      rx += (mx - rx) * .18;   // 0.18 ずつ近づく（小さいほどゆっくり）
      ry += (my - ry) * .18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
  });
})();
