// showToast(種類, 文章) で通知を出す。3秒たつか ✕ で消える
(() => {
  const box = document.querySelector('[data-fx="toast"]');
  if (!box) return;
  const icons = { success: '✓', error: '✕', info: 'i' };
  const life = 3000;

  window.showToast = (type, msg) => {
    const t = document.createElement('div');
    t.className = `fx-toast fx-toast--${type}`;
    t.setAttribute('role', type === 'error' ? 'alert' : 'status');
    t.style.setProperty('--life', `${life}ms`);
    t.innerHTML = `<span class="fx-toast__icon">${icons[type] || '!'}</span>
      <span class="fx-toast__text"></span>
      <button class="fx-toast__close" aria-label="閉じる">✕</button>
      <span class="fx-toast__timer"></span>`;
    t.querySelector('.fx-toast__text').textContent = msg;   // 文章は textContent で安全に
    const remove = () => {
      if (t.classList.contains('is-leaving')) return;
      t.classList.add('is-leaving');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    };
    t.querySelector('.fx-toast__close').addEventListener('click', remove);
    setTimeout(remove, life);
    box.appendChild(t);
    if (box.children.length > 4) box.firstElementChild.remove();   // 多すぎたら古いものから消す
  };

  document.querySelectorAll('[data-toast]').forEach((btn) => {
    btn.addEventListener('click', () => showToast(btn.dataset.toast, btn.dataset.msg));
  });
})();
