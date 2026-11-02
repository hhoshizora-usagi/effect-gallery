// 送信を止めて、ブラウザの入力チェック（checkValidity）の結果で見た目を切りかえる
(() => {
  document.querySelectorAll('[data-fx="validate"]').forEach((form) => {
    const input = form.querySelector('input');
    const btn = form.querySelector('.fx-val__btn');
    const msg = form.querySelector('.fx-val__msg');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.remove('is-error', 'is-ok');
      void form.offsetWidth;                 // ぶるぶるを毎回最初から
      if (input.checkValidity()) {
        form.classList.add('is-ok');
        btn.textContent = '✓';
        msg.textContent = '登録しました！（見本なので送信はしていません）';
      } else {
        form.classList.add('is-error');
        btn.textContent = '登録';
        msg.textContent = input.value ? 'メールアドレスの形がちがうみたい' : 'メールアドレスを入れてね';
        input.focus();
      }
    });
    input.addEventListener('input', () => {
      if (form.classList.contains('is-ok')) { form.classList.remove('is-ok'); btn.textContent = '登録'; msg.textContent = ''; }
    });
  });
})();
