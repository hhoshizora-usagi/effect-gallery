// 値（0〜100）を --p に入れて、吹き出しの位置・色・顔文字を変える
(() => {
  const faces = ['😭', '😢', '😐', '🙂', '😆', '🤩'];
  document.querySelectorAll('[data-fx="slider"]').forEach((root) => {
    const input = root.querySelector('input');
    const wrap = root.querySelector('.fx-slider__wrap');
    const bubble = root.querySelector('output');
    const update = () => {
      const p = +input.value;
      wrap.style.setProperty('--p', p);
      bubble.textContent = `${faces[Math.min(faces.length - 1, Math.floor(p / (100 / faces.length)))]} ${p}`;
    };
    input.addEventListener('input', update);
    update();
  });
})();
