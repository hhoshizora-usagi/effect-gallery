// タッチ端末はホバーできないので、タップで裏表を切りかえる
(() => {
  document.querySelectorAll('[data-fx="flip"]').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  });
})();
