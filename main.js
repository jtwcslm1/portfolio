/* =====================================================================
   Yutong "Leila" Li — Portfolio
   main.js  (shared by index.html and gallery.html)
   - Bilingual EN / 中文 toggle (remembers choice)
   - Scroll-reveal + stat counters
   - Sticky nav
   - AUTO GALLERY: reads gallery/manifest.json (built by GitHub Action)
       · homepage  -> newest few   (#home-gallery)
       · gallery page -> all images (#full-gallery)
       · click any image -> lightbox
   ===================================================================== */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- language toggle ---------- */
  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var t = el.getAttribute('data-' + lang);
      if (t !== null && t !== undefined) el.innerHTML = t;
    });
    var btn = document.getElementById('langBtn');
    if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
  }
  window.toggleLang = function () {
    var cur = document.documentElement.getAttribute('data-lang');
    applyLang(cur === 'zh' ? 'en' : 'zh');
  };
  try { var saved = localStorage.getItem('site-lang'); if (saved) applyLang(saved); } catch (e) {}

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('solid', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- scroll reveal + counters ---------- */
  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1000, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.querySelectorAll) {
          // only featured stats use data-count; skip the gallery container
          e.target.querySelectorAll('.stat [data-count]').forEach(runCounter);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });

  /* =================== AUTO GALLERY =================== */
  // homepage tiles: uniform rounded squares (wide images crop to centre)

  function makeImg(name) {
    var img = document.createElement('img');
    img.src = 'gallery/' + name;
    img.alt = name.replace(/\.[a-z0-9]+$/i, '');
    img.loading = 'lazy';
    return img;
  }

  function emptyNote(en, zh) {
    var d = document.createElement('p');
    d.className = 'gallery-empty';
    d.setAttribute('data-en', en); d.setAttribute('data-zh', zh);
    d.textContent = (document.documentElement.getAttribute('data-lang') === 'zh') ? zh : en;
    return d;
  }

  function renderHome(box, list) {
    var n = parseInt(box.getAttribute('data-count'), 10) || 6;
    box.innerHTML = '';
    if (!list.length) {
      box.classList.remove('gallery'); box.classList.remove('stagger');
      box.appendChild(emptyNote(
        'Your latest images will appear here once you add them to the gallery/ folder.',
        '把图片放进 gallery/ 文件夹后，最近上传的几张会自动显示在这里。'));
      return;
    }
    list.slice(0, n).forEach(function (name, i) {
      var fig = document.createElement('div');
      fig.className = 'shot';
      fig.appendChild(makeImg(name));
      box.appendChild(fig);
    });
    box.classList.add('in');
  }

  function renderFull(box, list) {
    var counter = document.getElementById('gallery-count');
    if (counter) counter.textContent = list.length;
    box.innerHTML = '';
    if (!list.length) {
      box.appendChild(emptyNote(
        'No images yet. Drop files into the gallery/ folder and push — they will show up here automatically.',
        '还没有图片。把文件丢进 gallery/ 文件夹并推送到 GitHub，它们会自动出现在这里。'));
      return;
    }
    list.forEach(function (name, i) {
      var it = document.createElement('figure');
      it.className = 'm-item' + (i % 3 === 0 ? ' tl' : (i % 3 === 1 ? ' tr' : ''));
      it.appendChild(makeImg(name));
      box.appendChild(it);
    });
  }

  /* lightbox */
  function setupLightbox(scope) {
    var lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.innerHTML = '<img alt="">';
      document.body.appendChild(lb);
      lb.addEventListener('click', function () { lb.classList.remove('open'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
    }
    scope.querySelectorAll('img').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lb.querySelector('img').src = img.src;
        lb.classList.add('open');
      });
    });
  }

  function initGallery() {
    var home = document.getElementById('home-gallery');
    var full = document.getElementById('full-gallery');
    if (!home && !full) return;
    fetch('gallery/manifest.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (list) {
        list = Array.isArray(list) ? list : [];
        if (home) { renderHome(home, list); setupLightbox(home); }
        if (full) { renderFull(full, list); setupLightbox(full); }
      });
  }
  initGallery();
})();
