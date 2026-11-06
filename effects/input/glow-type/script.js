// 1文字打つごとに、カーソルのあたりから光のつぶを飛ばし、枠の色（色相 --h）を少し進める
(() => {
  document.querySelectorAll('[data-fx="glow-type"]').forEach((root) => {
    const input = root.querySelector('input');
    const measure = document.createElement('span');          // 文字の幅を測るための見えない箱
    measure.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:700 20px "Zen Kaku Gothic New",sans-serif';
    root.appendChild(measure);
    let h = 280;
    input.addEventListener('input', () => {
      h = (h + 23) % 360;
      input.style.setProperty('--h', h);
      measure.textContent = input.value.slice(0, input.selectionStart || input.value.length);
      const x = Math.min(input.offsetLeft + 22 + measure.offsetWidth, input.offsetLeft + input.offsetWidth - 20);
      const y = input.offsetTop + input.offsetHeight / 2;
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('i');
        s.className = 'fx-gtype__spark';
        const a = Math.random() * Math.PI * 2, d = 20 + Math.random() * 40;
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        s.style.setProperty('--x', `${Math.cos(a) * d}px`);
        s.style.setProperty('--y', `${Math.sin(a) * d}px`);
        s.style.setProperty('--c', `hsl(${(h + i * 30) % 360} 100% 65%)`);
        root.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
      }
      input.classList.remove('is-pulse');
      void input.offsetWidth;
      input.classList.add('is-pulse');
    });
  });
})();
