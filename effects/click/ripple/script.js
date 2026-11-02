// 押した位置に丸を置いて、ボタン全体をおおう大きさまで広げてから消す
(() => {
  document.querySelectorAll('[data-fx="ripple"]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      const r = btn.getBoundingClientRect();
      const wave = document.createElement('span');
      wave.className = 'fx-ripple__wave';
      wave.style.left = `${e.clientX - r.left}px`;
      wave.style.top = `${e.clientY - r.top}px`;
      wave.style.setProperty('--scale', (Math.hypot(r.width, r.height) * 2) / 20);
      btn.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });
})();
