// 星をちりばめて、1〜2.5秒おきにランダムな場所から流れ星を出す
(() => {
  const rnd = (a, b) => a + Math.random() * (b - a);
  document.querySelectorAll('[data-fx="shooting-stars"]').forEach((sky) => {
    for (let i = 0; i < (+sky.dataset.stars || 60); i++) {
      const s = document.createElement('i');
      s.className = 'fx-sky__star';
      s.setAttribute('aria-hidden', 'true');
      s.style.left = `${rnd(0, 100)}%`;
      s.style.top = `${rnd(0, 100)}%`;
      s.style.setProperty('--s', `${rnd(1, 3.2)}px`);
      s.style.setProperty('--d', `${rnd(.8, 3)}s`);
      sky.appendChild(s);
    }
    const shoot = () => {
      const m = document.createElement('i');
      m.className = 'fx-sky__shoot';
      m.setAttribute('aria-hidden', 'true');
      m.style.left = `${rnd(40, 110)}%`;
      m.style.top = `${rnd(-10, 40)}%`;
      m.style.setProperty('--d', `${rnd(.9, 1.6)}s`);
      sky.appendChild(m);
      m.addEventListener('animationend', () => m.remove());
      setTimeout(shoot, rnd(1000, 2500));
    };
    shoot();
  });
})();
