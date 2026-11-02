// data-words に並べた言葉を、打つ → 待つ → 消す でくり返す
(() => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  document.querySelectorAll('[data-fx="typing"]').forEach(async (el) => {
    const words = JSON.parse(el.dataset.words || '[]');
    const typeSpeed = 110, deleteSpeed = 50, hold = 1300;
    for (let n = 0; ; n = (n + 1) % words.length) {
      const chars = [...words[n]];
      for (let i = 1; i <= chars.length; i++) { el.textContent = chars.slice(0, i).join(''); await wait(typeSpeed); }
      await wait(hold);
      for (let i = chars.length; i >= 0; i--) { el.textContent = chars.slice(0, i).join(''); await wait(deleteSpeed); }
      await wait(250);
    }
  });
})();
