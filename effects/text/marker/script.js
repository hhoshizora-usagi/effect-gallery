// 画面に入ったら .is-in をつけて、マーカーを左から右へ引く
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: .8 });
  document.querySelectorAll('[data-fx="marker"]').forEach((el) => io.observe(el));
})();
