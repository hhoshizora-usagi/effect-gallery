// 見本では data-delay ミリ秒後に <template> の中身へ入れかえる
// 本番では fetch() でデータが届いたタイミングで入れかえる
(() => {
  document.querySelectorAll('[data-fx="skeleton"]').forEach((card) => {
    const tpl = card.querySelector('template');
    setTimeout(() => {
      card.replaceChildren(tpl.content.cloneNode(true));
      card.classList.add('is-loaded');
      card.setAttribute('aria-busy', 'false');
    }, +card.dataset.delay || 2000);
  });
})();
