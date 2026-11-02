// 押すたびに オン/オフ を切りかえて、数字を ±1。オンのときだけ丸を飛ばす
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#a259ff'];
  document.querySelectorAll('[data-fx="like"]').forEach((btn) => {
    const count = btn.querySelector('.fx-like__count');
    const heart = btn.querySelector('.fx-like__heart');
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      count.textContent = +count.textContent + (on ? 1 : -1);
      if (!on) return;
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement('i');
        dot.className = 'fx-like__dot';
        const a = (i / 10) * Math.PI * 2;
        dot.style.setProperty('--x', `${Math.cos(a) * 42}px`);
        dot.style.setProperty('--y', `${Math.sin(a) * 42}px`);
        dot.style.setProperty('--c', colors[i % colors.length]);
        heart.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove());
      }
    });
  });
})();
