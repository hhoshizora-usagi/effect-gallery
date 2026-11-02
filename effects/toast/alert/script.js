// hidden を外すと CSS の落下アニメーションが始まる。閉じるときは上に戻してから hidden
(() => {
  document.querySelectorAll('[data-fx="alert"]').forEach((btn) => {
    const alert = document.getElementById(btn.dataset.target);
    btn.addEventListener('click', () => {
      alert.classList.remove('is-leaving');
      alert.hidden = true;
      void alert.offsetWidth;                // 毎回落ちてくるように
      alert.hidden = false;
    });
    alert.querySelector('.fx-alert__close').addEventListener('click', () => {
      alert.classList.add('is-leaving');
      alert.addEventListener('animationend', () => { alert.hidden = true; alert.classList.remove('is-leaving'); }, { once: true });
    });
  });
})();
