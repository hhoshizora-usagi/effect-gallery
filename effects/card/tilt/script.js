// カードの中のマウス位置（0〜1）から、傾きの角度と光の位置を決める
(() => {
  const max = 18;   // いちばん傾いたときの角度
  document.querySelectorAll('[data-fx="tilt"]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.classList.remove('is-leaving');
      card.style.setProperty('--ry', `${(x - .5) * max * 2}deg`);
      card.style.setProperty('--rx', `${(.5 - y) * max * 2}deg`);
      card.style.setProperty('--gx', `${x * 100}%`);
      card.style.setProperty('--gy', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.add('is-leaving');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
})();
