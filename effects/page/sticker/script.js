// pointer イベントでつまんだ位置を覚えて、動かした分だけ left / top を変える
(() => {
  document.querySelectorAll('[data-fx="sticker"]').forEach((area) => {
    let z = 10;
    area.querySelectorAll('.fx-sticker').forEach((st) => {
      st.addEventListener('pointerdown', (e) => {
        st.setPointerCapture(e.pointerId);
        st.classList.add('is-dragging');
        st.style.zIndex = ++z;                       // つまんだものを一番上に
        const a = area.getBoundingClientRect();
        const offX = e.clientX - a.left - st.offsetLeft;   // つまんだ位置のずれ
        const offY = e.clientY - a.top - st.offsetTop;
        const move = (ev) => {
          const x = Math.max(0, Math.min(a.width - st.offsetWidth, ev.clientX - a.left - offX));
          const y = Math.max(0, Math.min(a.height - st.offsetHeight, ev.clientY - a.top - offY));
          st.style.left = `${x}px`;
          st.style.top = `${y}px`;
        };
        const up = () => {
          st.classList.remove('is-dragging');
          st.removeEventListener('pointermove', move);
          st.removeEventListener('pointerup', up);
          st.removeEventListener('pointercancel', up);
        };
        st.addEventListener('pointermove', move);
        st.addEventListener('pointerup', up);
        st.addEventListener('pointercancel', up);
      });
    });
  });
})();
