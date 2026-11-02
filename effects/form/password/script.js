// 長さ・大文字・数字・記号の数で強さ（0〜4）を決める、ごく簡単な判定
(() => {
  const levels = [
    { text: 'まだ入力されていません', c: '#ccc' },
    { text: 'よわい…', c: '#ff2e4d' },
    { text: 'ふつう', c: '#ff7a00' },
    { text: 'つよい！', c: '#ffd400' },
    { text: 'さいきょう！！', c: '#7cff4f' },
  ];
  document.querySelectorAll('[data-fx="password"]').forEach((root) => {
    const input = root.querySelector('input');
    const eye = root.querySelector('.fx-pw__eye');
    const text = root.querySelector('.fx-pw__text');
    eye.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eye.setAttribute('aria-pressed', String(show));
      eye.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示');
      eye.textContent = show ? '🙈' : '👁';
    });
    input.addEventListener('input', () => {
      const v = input.value;
      let lv = 0;
      if (v.length > 0) lv = 1;
      if (v.length >= 8) lv++;
      if (/[A-Z]/.test(v) && /[0-9]/.test(v)) lv++;
      if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) lv++;
      lv = Math.min(4, lv);
      root.style.setProperty('--lv', lv);
      root.style.setProperty('--c', levels[lv].c);
      text.textContent = levels[lv].text;
    });
  });
})();
