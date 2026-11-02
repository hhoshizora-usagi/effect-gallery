// input range の値（0〜100）を、CSS 変数 --pos に入れるだけ
(() => {
  document.querySelectorAll('[data-fx="before-after"]').forEach((root) => {
    const range = root.querySelector('.fx-ba__range');
    const update = () => root.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });
})();
