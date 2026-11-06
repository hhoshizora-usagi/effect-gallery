// 1文字ずつ <span> にして、順番に落とす。クリック（Enter）でもう一度
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];
  document.querySelectorAll('[data-fx="falling-letters"]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    const build = () => {
      el.textContent = '';
      [...text].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.setAttribute('aria-hidden', 'true');
        s.style.setProperty('--i', i);
        s.style.setProperty('--c', colors[i % colors.length]);
        el.appendChild(s);
      });
    };
    build();
    el.addEventListener('click', build);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') build(); });
  });
})();
