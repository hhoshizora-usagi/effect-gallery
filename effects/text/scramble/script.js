// 左から順に、ランダムな文字 → 本当の文字 に確定させる
(() => {
  const pool = 'アイウエオカキクケコサシスセソタチツテトABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+?!';
  const rand = () => pool[Math.floor(Math.random() * pool.length)];
  function run(el) {
    const final = [...el.dataset.text];
    let frame = 0;
    cancelAnimationFrame(el._raf);
    const tick = () => {
      el.innerHTML = '';
      final.forEach((ch, i) => {
        const done = frame > i * 3 + 12;          // 3フレームずつずらして確定
        const span = document.createElement('span');
        span.textContent = done || ch === ' ' ? ch : rand();
        if (!done && ch !== ' ') span.className = 'is-random';
        el.appendChild(span);
      });
      frame++;
      if (frame <= final.length * 3 + 12) el._raf = requestAnimationFrame(tick);
    };
    tick();
  }
  document.querySelectorAll('[data-fx="scramble"]').forEach((el) => {
    el.dataset.text = el.textContent.trim();
    el.setAttribute('aria-label', el.dataset.text);
    run(el);
    el.addEventListener('mouseenter', () => run(el));
  });
})();
