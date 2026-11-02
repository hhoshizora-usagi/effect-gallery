// --i（何枚目か）を変えて track を横にずらす。自動再生・スワイプつき
(() => {
  document.querySelectorAll('[data-fx="carousel"]').forEach((root) => {
    const track = root.querySelector('.fx-car__track');
    const slides = [...root.querySelectorAll('.fx-car__slide')];
    const dotsBox = root.querySelector('.fx-car__dots');
    const interval = +root.dataset.interval || 4000;
    let i = 0, timer;

    const dots = slides.map((_, n) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `${n + 1}枚目へ`);
      b.addEventListener('click', () => go(n));
      dotsBox.appendChild(b);
      return b;
    });
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.setProperty('--i', i);
      slides.forEach((s, k) => {
        s.classList.toggle('is-current', k === i);
        s.setAttribute('aria-hidden', String(k !== i));
      });
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      restart();
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), interval); };

    root.querySelector('.fx-car__arrow--prev').addEventListener('click', () => go(i - 1));
    root.querySelector('.fx-car__arrow--next').addEventListener('click', () => go(i + 1));
    root.addEventListener('mouseenter', () => clearInterval(timer));   // マウスを乗せている間は止める
    root.addEventListener('mouseleave', restart);

    let startX = null;                                                 // スワイプ
    root.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    root.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      startX = null;
    });
    go(0);
  });
})();
