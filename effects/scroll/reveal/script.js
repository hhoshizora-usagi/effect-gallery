// 画面に入った要素に .is-in をつける（一度出たらそのまま）
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: .25 });
  document.querySelectorAll('[data-fx="reveal"]').forEach((el) => io.observe(el));
})();
