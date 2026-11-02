// 画面に入ったら .is-in をつけて、帯 → 画像 の順にアニメーション
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: .4 });
  document.querySelectorAll('[data-fx="wipe-reveal"]').forEach((el) => io.observe(el));
})();
