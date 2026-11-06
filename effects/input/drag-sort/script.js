// つまんだ項目を指に合わせて動かし、半分以上かさなったら隣とDOMの順番を入れかえる
(() => {
  document.querySelectorAll('[data-fx="drag-sort"]').forEach((list) => {
    list.addEventListener('pointerdown', (e) => {
      const item = e.target.closest('li');
      if (!item) return;
      item.setPointerCapture(e.pointerId);
      item.classList.add('is-dragging');
      let startY = e.clientY;
      const move = (ev) => {
        let dy = ev.clientY - startY;
        const h = item.offsetHeight + 10;            // 項目の高さ＋すきま
        const prev = item.previousElementSibling, next = item.nextElementSibling;
        if (dy > h / 2 && next) { next.after(item); startY += h; dy -= h; }
        if (dy < -h / 2 && prev) { prev.before(item); startY -= h; dy += h; }
        item.style.transform = `translateY(${dy}px) rotate(${dy / 40}deg) scale(1.04)`;
      };
      const up = () => {
        item.classList.remove('is-dragging');
        item.style.transform = '';
        item.removeEventListener('pointermove', move);
        item.removeEventListener('pointerup', up);
        item.removeEventListener('pointercancel', up);
      };
      item.addEventListener('pointermove', move);
      item.addEventListener('pointerup', up);
      item.addEventListener('pointercancel', up);
    });
    // キーボード：↑↓ で1つずつ移動
    list.addEventListener('keydown', (e) => {
      const item = e.target.closest('li');
      if (!item) return;
      if (e.key === 'ArrowUp' && item.previousElementSibling) { item.previousElementSibling.before(item); }
      else if (e.key === 'ArrowDown' && item.nextElementSibling) { item.nextElementSibling.after(item); }
      else return;
      e.preventDefault();
      item.focus();
    });
  });
})();
