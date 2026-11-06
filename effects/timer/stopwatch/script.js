// performance.now() で経過時間を計る（setInterval の数え上げよりズレにくい）
(() => {
  const fmt = (ms) => {
    const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60, cs = Math.floor(ms / 10) % 100;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };
  document.querySelectorAll('[data-fx="stopwatch"]').forEach((root) => {
    const time = root.querySelector('.fx-sw__time');
    const startBtn = root.querySelector('.fx-sw__start');
    const lapBtn = root.querySelector('.fx-sw__lap');
    const laps = root.querySelector('.fx-sw__laps');
    let base = 0, startAt = 0, running = false, raf;
    const elapsed = () => base + (running ? performance.now() - startAt : 0);
    const draw = () => {
      const ms = elapsed();
      time.textContent = fmt(ms);
      root.style.setProperty('--p', ((ms % 1000) / 10).toFixed(1));   // 1秒で1周
      if (running) raf = requestAnimationFrame(draw);
    };
    startBtn.addEventListener('click', () => {
      if (running) { base = elapsed(); running = false; cancelAnimationFrame(raf); }
      else { startAt = performance.now(); running = true; draw(); }
      startBtn.textContent = running ? 'ストップ' : 'スタート';
      startBtn.classList.toggle('is-running', running);
      lapBtn.disabled = !running;
    });
    lapBtn.addEventListener('click', () => {
      const li = document.createElement('li');
      li.textContent = `${laps.children.length + 1}: ${fmt(elapsed())}`;
      laps.appendChild(li);
      if (laps.children.length > 6) laps.firstElementChild.remove();
    });
    root.querySelector('.fx-sw__reset').addEventListener('click', () => {
      base = 0; startAt = performance.now();
      laps.innerHTML = '';
      if (!running) draw();
    });
    draw();
  });
})();
