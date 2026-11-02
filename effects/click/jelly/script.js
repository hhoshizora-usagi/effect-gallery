// クリックのたびにクラスをつけ直して、アニメーションを最初から再生する
(() => {
  document.querySelectorAll('[data-fx="jelly"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.remove('is-boing');
      void btn.offsetWidth;            // つけ直すための小ワザ（再描画させる）
      btn.classList.add('is-boing');
    });
    btn.addEventListener('animationend', () => btn.classList.remove('is-boing'));
  });
})();
