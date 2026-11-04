// タップ（クリック）でも裏返るようにする
(() => {
  document.querySelectorAll('.fx-flip__card').forEach((c) => {
    c.addEventListener('click', () => c.classList.toggle('is-open'));
  });
})();
