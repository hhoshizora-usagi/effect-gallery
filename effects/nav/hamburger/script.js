// 押すたびに aria-expanded を true / false に切りかえる（見た目は CSS が担当）
(() => {
  document.querySelectorAll('[data-fx="hamburger"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニュー');
    });
  });
})();
