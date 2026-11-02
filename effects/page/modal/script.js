// <dialog> の showModal() で開く（Esc やフォーカス管理はブラウザがやってくれる）
(() => {
  const close = (dlg) => {
    dlg.classList.add('is-closing');
    dlg.addEventListener('animationend', () => {
      dlg.classList.remove('is-closing');
      dlg.close();
    }, { once: true });
  };
  document.querySelectorAll('[data-fx="modal"]').forEach((btn) => {
    const dlg = document.getElementById(btn.dataset.target);
    btn.addEventListener('click', () => dlg.showModal());
    dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => close(dlg)));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(dlg); });   // 外側クリックで閉じる
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(dlg); });     // Esc でもアニメ付きで
  });
})();
