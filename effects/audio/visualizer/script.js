// Web Audio API で音楽を「その場で合成」して鳴らし、AnalyserNode で音の強さを読みとって描く
// （音声ファイルを使うときは、new Audio('song.mp3') を createMediaElementSource につなげばOK）
(() => {
  document.querySelectorAll('[data-fx="visualizer"]').forEach((root) => {
    const cv = root.querySelector('canvas');
    const btn = root.querySelector('button');
    const ctx = cv.getContext('2d');
    let ac, analyser, data, timer, playing = false;

    const note = (freq, time, len, type = 'square', vol = .06) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, time);
      g.gain.exponentialRampToValueAtTime(.0001, time + len);
      o.connect(g).connect(analyser);
      o.start(time); o.stop(time + len);
    };
    const kick = (time) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(150, time);
      o.frequency.exponentialRampToValueAtTime(40, time + .2);
      g.gain.setValueAtTime(.35, time);
      g.gain.exponentialRampToValueAtTime(.001, time + .25);
      o.connect(g).connect(analyser);
      o.start(time); o.stop(time + .25);
    };
    // 1小節ぶんのフレーズ（ドミソの分散和音＋キック）を、少し先まで予約しつづける
    const melody = [523, 659, 784, 1047, 784, 659, 587, 698];
    let step = 0, nextTime = 0;
    const schedule = () => {
      while (nextTime < ac.currentTime + .2) {
        if (step % 2 === 0) kick(nextTime);
        note(melody[step % melody.length], nextTime, .2);
        if (step % 4 === 0) note(melody[step % melody.length] / 4, nextTime, .45, 'sawtooth', .05);
        nextTime += .18; step++;
      }
    };
    const start = () => {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (!analyser) {
        analyser = ac.createAnalyser();
        analyser.fftSize = 128;
        analyser.connect(ac.destination);
        data = new Uint8Array(analyser.frequencyBinCount);
      }
      ac.resume();
      nextTime = ac.currentTime + .05;
      timer = setInterval(schedule, 50);
      playing = true;
    };
    const stop = () => { clearInterval(timer); playing = false; };
    btn.addEventListener('click', () => {
      playing ? stop() : start();
      btn.textContent = playing ? '❚❚' : '▶';
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? '音楽を止める' : '音楽を再生');
    });

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
      const bars = 48, R = W * .22;
      let sum = 0;
      if (analyser) analyser.getByteFrequencyData(data);
      for (let i = 0; i < bars; i++) {
        // 音がないときは、ゆるく波うつ待機アニメーション
        const v = analyser && playing ? data[i % data.length] / 255 : (Math.sin((t || 0) / 500 + i * .5) + 1) * .08;
        sum += v;
        const a = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const len = 8 + v * W * .25;
        ctx.strokeStyle = `hsl(${(i / bars) * 360} 100% 62%)`;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(W / 2 + Math.cos(a) * R, H / 2 + Math.sin(a) * R);
        ctx.lineTo(W / 2 + Math.cos(a) * (R + len), H / 2 + Math.sin(a) * (R + len));
        ctx.stroke();
      }
      btn.style.setProperty('--beat', (1 + (sum / bars) * .25).toFixed(3));   // 音に合わせてボタンもはねる
      requestAnimationFrame(loop);
    })();
  });
})();
