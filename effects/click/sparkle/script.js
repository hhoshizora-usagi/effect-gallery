// 星を14個作って、円形にばらけた方向へ飛ばす（飛んだら消す）
(() => {
  const colors = ['#ffd400', '#ff3d7f', '#7cff4f', '#ffffff', '#ff7a00', '#a259ff'];
  document.querySelectorAll('[data-fx="sparkle"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = 14;
      for (let i = 0; i < n; i++) {
        const star = document.createElement('i');
        star.className = 'fx-sparkle__star';
        const a = (i / n) * Math.PI * 2 + Math.random() * .4;
        const dist = 70 + Math.random() * 70;
        star.style.setProperty('--x', `${Math.cos(a) * dist}px`);
        star.style.setProperty('--y', `${Math.sin(a) * dist}px`);
        star.style.setProperty('--r', `${Math.random() * 360}deg`);
        star.style.setProperty('--s', `${12 + Math.random() * 16}px`);
        star.style.setProperty('--c', colors[i % colors.length]);
        btn.appendChild(star);
        star.addEventListener('animationend', () => star.remove());
      }
    });
  });
})();
