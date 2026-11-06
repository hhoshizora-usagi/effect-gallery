// 画面に入ったら .is-in をつけて、ぼかしを外す
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: .4 });
  document.querySelectorAll('[data-fx="focus-in"]').forEach((el) => io.observe(el));
})();
