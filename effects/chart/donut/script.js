// 画面に入ったら、1つずつ時間差で円を描く。凡例とグラフのホバーを連動させる
(() => {
  // 画面に入ったら1回だけ動かす
  const onVisible = (el, fn) => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { fn(); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(el);
  };

  document.querySelectorAll('[data-fx="donut"]').forEach((chart) => {
    const segs = [...chart.querySelectorAll('.fx-donut__seg')];
    const items = [...chart.querySelectorAll('.fx-donut__legend li')];
    segs.forEach((s, i) => s.style.setProperty('--i', i));
    onVisible(chart, () => chart.classList.add('is-in'));
    const hot = (n) => {
      segs.forEach((s, i) => s.classList.toggle('is-hot', i === n));
      items.forEach((li, i) => li.classList.toggle('is-hot', i === n));
    };
    [...segs, ...items].forEach((el) => {
      const n = segs.includes(el) ? segs.indexOf(el) : items.indexOf(el);
      el.addEventListener('mouseenter', () => hot(n));
      el.addEventListener('mouseleave', () => hot(-1));
    });
  });
})();
