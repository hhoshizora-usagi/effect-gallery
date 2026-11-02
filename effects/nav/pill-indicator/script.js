// マウスを乗せた項目の位置と幅に、後ろの板を合わせる
(() => {
  const colors = ['#ff3d7f', '#00c2ff', '#ff7a00', '#a259ff', '#7cff4f'];
  document.querySelectorAll('[data-fx="pill-indicator"]').forEach((nav) => {
    const bg = nav.querySelector('.fx-pill__bg');
    const links = [...nav.querySelectorAll('a')];
    const moveTo = (a) => {
      links.forEach((l) => l.classList.toggle('is-hover', l === a));
      bg.style.width = `${a.offsetWidth}px`;
      bg.style.transform = `translateX(${a.offsetLeft}px)`;
      bg.style.background = colors[links.indexOf(a) % colors.length];
    };
    const home = () => moveTo(nav.querySelector('.is-active') || links[0]);
    links.forEach((a) => {
      a.addEventListener('mouseenter', () => moveTo(a));
      a.addEventListener('focus', () => moveTo(a));
      a.addEventListener('click', (e) => {
        e.preventDefault();                       // 見本ではページ移動しない
        links.forEach((l) => l.classList.remove('is-active'));
        a.classList.add('is-active');
      });
    });
    nav.addEventListener('mouseleave', home);
    addEventListener('resize', home);
    home();
  });
})();
