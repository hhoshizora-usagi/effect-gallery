// 文字を1文字ずつ <span> に分けて、順番に跳ねさせる
(() => {
  const colors = ['#ff3d7f', '#ffd400', '#00c2ff', '#7cff4f', '#ff7a00', '#a259ff'];
  document.querySelectorAll('[data-fx="wave"]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);   // 読み上げ用に元の文字を残す
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.style.setProperty('--c', colors[i % colors.length]);
      el.appendChild(s);
    });
  });
})();
