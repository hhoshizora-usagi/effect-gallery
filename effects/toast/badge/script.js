// 押すたびに数を +1 して、ポンッのアニメーションを最初から再生
(() => {
  document.querySelectorAll('[data-fx="badge"]').forEach((btn) => {
    const cart = document.querySelector('.fx-cart');
    const badge = cart.querySelector('.fx-cart__badge');
    let count = 0;
    btn.addEventListener('click', () => {
      count++;
      badge.textContent = count > 99 ? '99+' : count;
      cart.setAttribute('aria-label', `カート（${count}点）`);
      cart.classList.add('has-items');
      cart.classList.remove('is-pop');
      void cart.offsetWidth;
      cart.classList.add('is-pop');
    });
  });
})();
