// 文字ごとにランダムな飛び先を決めておき、.is-boom がついたらそこへ飛ばす
(() => {
  const rnd = (a, b) => a + Math.random() * (b - a);
  document.querySelectorAll('[data-fx="explode"]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const spans = [...text].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.setAttribute('aria-hidden', 'true');
      el.appendChild(s);
      return s;
    });
    const scatter = () => spans.forEach((s) => {
      s.style.setProperty('--x', `${rnd(-140, 140)}px`);
      s.style.setProperty('--y', `${rnd(-110, 110)}px`);
      s.style.setProperty('--r', `${rnd(-260, 260)}deg`);
      s.style.setProperty('--s', rnd(.5, 1.6).toFixed(2));
    });
    const on = () => { scatter(); el.classList.add('is-boom'); };
    const off = () => el.classList.remove('is-boom');
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    el.addEventListener('focus', on);
    el.addEventListener('blur', off);
    el.addEventListener('pointerup', (e) => {                // スマホはタップで切りかえ
      if (e.pointerType === 'touch') (el.classList.contains('is-boom') ? off() : on());
    });
  });
})();
