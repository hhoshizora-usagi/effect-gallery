// それぞれの効果音を「音の高さの動き」と「音量の消え方」で作る（音声ファイルなし）
(() => {
  let ac;
  const tone = (type, from, to, len, vol = .2, delay = 0) => {
    const t = ac.currentTime + delay;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + len);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(g).connect(ac.destination);
    o.start(t); o.stop(t + len);
  };
  const sounds = {
    pop:   () => tone('sine', 900, 200, .12, .3),
    coin:  () => { tone('square', 988, 988, .08, .12); tone('square', 1319, 1319, .35, .12, .08); },
    jump:  () => tone('square', 220, 880, .25, .12),
    laser: () => tone('sawtooth', 1800, 120, .35, .1),
  };
  document.querySelectorAll('[data-fx="sound-buttons"] [data-sound]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      ac.resume();
      sounds[btn.dataset.sound]();
      btn.classList.remove('is-play');
      void btn.offsetWidth;
      btn.classList.add('is-play');
    });
  });
})();
