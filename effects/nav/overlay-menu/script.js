// ボタンでメニューを開け閉め（Esc キーでも閉じる）
(() => {
  document.querySelectorAll('[data-fx="overlay-menu"]').forEach((btn) => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'CLOSE' : 'MENU';
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) { e.preventDefault(); set(false); } });
  });
})();
