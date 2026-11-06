// 1秒ごとに時刻を6桁にして、変わった桁だけ「古い数字の上半分」をめくって見せる
(() => {
  document.querySelectorAll('[data-fx="flip-clock"]').forEach((clock) => {
    const cards = [...clock.querySelectorAll('.fx-flipc__card')];
    const now = () => {
      const d = new Date();
      return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join('');
    };
    const update = () => {
      const digits = now();
      digits.split('').forEach((ch, i) => {
        const card = cards[i];
        const old = card.dataset.v;
        if (old === ch) return;
        card.dataset.v = ch;
        if (old !== undefined) {
          const leaf = document.createElement('span');
          leaf.className = 'fx-flipc__leaf';
          leaf.innerHTML = `<span>${old}</span>`;
          card.appendChild(leaf);
          leaf.addEventListener('animationend', () => leaf.remove());
        }
        card.firstChild && card.firstChild.nodeType === 3 ? (card.firstChild.nodeValue = ch) : card.prepend(ch);
      });
      clock.setAttribute('aria-label', `現在の時刻 ${digits.slice(0, 2)}時${digits.slice(2, 4)}分`);
    };
    update();
    setInterval(update, 1000);
  });
})();
