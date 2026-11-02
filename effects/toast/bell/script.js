// 見本では1秒後に「新しい通知」が来たことにする。本番は通知が届いたら notify() を呼ぶ
(() => {
  document.querySelectorAll('[data-fx="bell"]').forEach((wrap) => {
    const bell = wrap.querySelector('.fx-bell');
    const list = wrap.querySelector('.fx-bell__list');
    const notify = () => {
      bell.classList.add('has-new');
      bell.setAttribute('aria-label', '通知（新着あり）');
      bell.classList.remove('is-ringing');
      void bell.offsetWidth;
      bell.classList.add('is-ringing');
    };
    bell.addEventListener('click', () => {
      const open = list.hidden;
      list.hidden = !open;
      bell.setAttribute('aria-expanded', String(open));
      if (open) { bell.classList.remove('has-new'); bell.setAttribute('aria-label', '通知'); }
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) { list.hidden = true; bell.setAttribute('aria-expanded', 'false'); }
    });
    setTimeout(notify, 1000);
    setInterval(() => { if (list.hidden) notify(); }, 6000);
  });
})();
