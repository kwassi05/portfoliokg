
(function () {
  var root = document.documentElement, t = null;
  root.classList.remove('no-js');
  root.classList.add('js');
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (!t) t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', t);
})();

document.addEventListener('DOMContentLoaded', function () {
  var root = document.documentElement;

  /* --- Thème clair / sombre --- */
  var themeBtn = document.querySelector('.theme-toggle');
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  setTheme(root.getAttribute('data-theme') || 'light', false);
  themeBtn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
  try {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) setTheme(e.matches ? 'dark' : 'light', false);
    });
  } catch (e) {}

  /* --- Filet sous l’en-tête au défilement --- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Menu mobile --- */
  var menuBtn = document.querySelector('.menu-toggle');
  var navLinks = document.getElementById('nav-links');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Fermer' : 'Menu';
    navLinks.classList.toggle('is-open', open);
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* --- Projets dépliables --- */
  document.querySelectorAll('.project-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.project');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* --- Copier l’adresse e-mail --- */
  var copyBtn = document.querySelector('[data-copy]');
  var copyStatus = document.getElementById('copy-status');
  var copyTimer;
  function copied() {
    copyBtn.textContent = 'Adresse copiée';
    copyStatus.textContent = 'Adresse e-mail copiée dans le presse-papiers.';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      copyBtn.textContent = 'Copier l’adresse';
      copyStatus.textContent = '';
    }, 2200);
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'absolute'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); copied(); } catch (e) {}
    document.body.removeChild(ta);
  }
  copyBtn.addEventListener('click', function () {
    var text = copyBtn.getAttribute('data-copy');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(copied, function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  });

  /* --- Année automatique --- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
