// ボタンの中心とマウスの距離を測って、近ければマウスの方へずらす
(() => {
  const els = [...document.querySelectorAll('[data-fx="magnetic"]')];
  const range = 50;       // ボタンのまわり何pxまで反応するか
  const power = .35;      // 吸い寄せの強さ
  els.forEach((el) => { el._tx = 0; el._ty = 0; });

  addEventListener('pointermove', (e) => {
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      // いまずれている分を引いて、元の中心を求める
      const cx = r.left + r.width / 2 - el._tx;
      const cy = r.top + r.height / 2 - el._ty;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const reach = range + Math.max(r.width, r.height) / 2;
      const near = Math.hypot(dx, dy) < reach;
      el._tx = near ? dx * power : 0;
      el._ty = near ? dy * power : 0;
      el.style.transform = `translate(${el._tx}px, ${el._ty}px)`;
      el.firstElementChild.style.transform = `translate(${el._tx * .4}px, ${el._ty * .4}px)`;
      el.classList.toggle('is-near', near);
    });
  });
})();
