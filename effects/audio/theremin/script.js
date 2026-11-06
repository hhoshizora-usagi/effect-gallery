// マウスの x で周波数、y で音量を変える。AnalyserNode の「波形データ」をそのまま線で描く
(() => {
  document.querySelectorAll('[data-fx="theremin"]').forEach((pad) => {
    const cv = pad.querySelector('canvas');
    const ctx = cv.getContext('2d');
    let ac, osc, gain, analyser, wave;
    const init = () => {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      osc = ac.createOscillator();
      gain = ac.createGain();
      analyser = ac.createAnalyser();
      analyser.fftSize = 1024;
      wave = new Uint8Array(analyser.fftSize);
      osc.type = 'triangle';
      gain.gain.value = 0;
      osc.connect(gain).connect(analyser).connect(ac.destination);
      osc.start();
    };
    const play = (e) => {
      if (!ac) init();
      ac.resume();
      const r = pad.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      const freq = 130 * Math.pow(2, x * 3);                 // 3オクターブぶん
      osc.frequency.setTargetAtTime(freq, ac.currentTime, .03);
      gain.gain.setTargetAtTime((1 - y) * .18, ac.currentTime, .05);
    };
    const silence = () => { if (gain) gain.gain.setTargetAtTime(0, ac.currentTime, .08); };
    pad.addEventListener('pointerdown', play);
    pad.addEventListener('pointermove', play);
    pad.addEventListener('pointerleave', silence);
    pad.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') silence(); });

    let W, H;
    const resize = () => {
      const d = window.devicePixelRatio || 1;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    (function loop(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#7cff4f';
      ctx.shadowColor = '#7cff4f';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      if (analyser) analyser.getByteTimeDomainData(wave);
      for (let x = 0; x <= W; x += 2) {
        const i = Math.floor((x / W) * (wave ? wave.length : 1));
        const v = wave ? (wave[i] - 128) / 128 : Math.sin(x / 30 + (t || 0) / 400) * .03;
        const y = H / 2 + v * H * .45;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      requestAnimationFrame(loop);
    })();
  });
})();
