// ①しまで隠す → ②中身を差しかえる → ③しまを開ける
// 本番で別ページへ移動するときは、②で location.href = 'next.html' にする
(() => {
  const cover = document.querySelector('.fx-st');
  const word = cover.querySelector('.fx-st__word');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let busy = false;

  document.querySelectorAll('[data-fx="stripe-transition"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      word.textContent = btn.dataset.word || 'GO!!';
      cover.classList.remove('is-out');
      cover.classList.add('is-in');
      await wait(1100);

      // ② 中身の差しかえ（見本では PAGE 1 ⇔ PAGE 2）
      const page = document.querySelector('.fx-st-page');
      const next = page.dataset.page === '1' ? '2' : '1';
      page.dataset.page = next;
      page.querySelector('.fx-st-page__no').textContent = `PAGE ${next}`;

      cover.classList.add('is-out');
      await wait(700);
      cover.classList.remove('is-in', 'is-out');
      busy = false;
    });
  });
})();
