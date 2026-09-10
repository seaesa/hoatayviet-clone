/* Hoa Tay Việt — behaviour layer.
   Mirrors the original Flatsome interactions: sticky header, flickity-style
   hero slider, mega-menu toggle, hover dropdowns, off-canvas menu, back-to-top. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* ---------------------------------------------------------------------
     1. Sticky header
     Flatsome waypoints, read straight off the original bundle:
       stick   when scrollY >= headerWrapper.height + 100   (280px here)
       release when scrollY <= topBar.height + 1            (37px here)
     The gap between the thresholds is what produces the "jump" effect.
     --------------------------------------------------------------------- */
  (function stickyHeader() {
    var header  = document.querySelector('.header');
    var wrapper = document.querySelector('.header-wrapper');
    var topBar  = document.querySelector('.header-top');
    if (!header || !wrapper) return;

    var stickAt = 0, releaseAt = 0, stuck = false, ticking = false;

    function measure() {
      if (stuck) return;                     // heights are wrong while fixed
      stickAt   = wrapper.offsetHeight + 100;
      releaseAt = (topBar ? topBar.offsetHeight : 0) + 1;
    }

    function apply() {
      var y = window.pageYOffset;
      if (!stuck && y >= stickAt) {
        header.style.height = wrapper.offsetHeight + 'px';   // hold the space
        wrapper.classList.add('stuck');
        stuck = true;
      } else if (stuck && y <= releaseAt) {
        wrapper.classList.remove('stuck');
        header.style.height = '';
        stuck = false;
        measure();
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); onScroll(); });
    onScroll();
  })();

  /* ---------------------------------------------------------------------
     2. Hero slider — autoplay 6s, wrap-around, drag, dots, arrows
     --------------------------------------------------------------------- */
  each(document.querySelectorAll('[data-slider]'), function (slider) {
    var track  = slider.querySelector('.slider-track');
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dots   = Array.prototype.slice.call(slider.querySelectorAll('.slider-dots button'));
    if (!track || slides.length < 2) return;

    var index = 0;
    var timer = null;
    var delay = parseInt(slider.getAttribute('data-autoplay'), 10) || 6000;

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) {
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    function go(i) { index = (i + slides.length) % slides.length; render(); }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() { if (!reduceMotion) { stop(); timer = setInterval(next, delay); } }
    function restart() { stop(); play(); }

    each(slider.querySelectorAll('.slider-arrow.next'), function (b) {
      b.addEventListener('click', function () { next(); restart(); });
    });
    each(slider.querySelectorAll('.slider-arrow.prev'), function (b) {
      b.addEventListener('click', function () { prev(); restart(); });
    });
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { go(i); restart(); });
    });

    slider.addEventListener('mouseenter', stop);          // pauseAutoPlayOnHover
    slider.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { play(); }
    });

    /* pointer / touch drag */
    var startX = 0, dx = 0, dragging = false;
    slider.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; startX = e.clientX; dx = 0;
      slider.classList.add('is-dragging');
      stop();
    });
    slider.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = e.clientX - startX;
      track.style.transform = 'translateX(calc(' + (-index * 100) + '% + ' + dx + 'px))';
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      slider.classList.remove('is-dragging');
      if (Math.abs(dx) > 50) { if (dx < 0) { next(); } else { prev(); } } else { render(); }
      play();
    }
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);
    slider.addEventListener('pointerleave', endDrag);
    slider.addEventListener('dragstart', function (e) { e.preventDefault(); });

    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); restart(); }
      if (e.key === 'ArrowLeft')  { prev(); restart(); }
    });

    render();
    play();
  });

  /* ---------------------------------------------------------------------
     3. Mega menu — permanently open on the home page, a dropdown once the
        header sticks (and on every inner page).
     --------------------------------------------------------------------- */
  (function megaMenu() {
    var btn  = document.querySelector('.mega-menu-title');
    var list = document.querySelector('.mega-menu-list');
    var wrap = document.querySelector('.mega-menu');
    if (!btn || !list) return;

    function isCollapsed() {
      var stuck = document.querySelector('.header-wrapper.stuck');
      return !!stuck || !document.body.classList.contains('is-home');
    }
    function close() { list.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    function open()  { list.classList.add('is-open');    btn.setAttribute('aria-expanded', 'true'); }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!isCollapsed()) return;              // already permanently open
      if (list.classList.contains('is-open')) { close(); } else { open(); }
    });

    document.addEventListener('click', function (e) {
      if (isCollapsed() && wrap && !wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  /* ---------------------------------------------------------------------
     4. Main-nav dropdowns — hover on pointer devices, tap on touch
     --------------------------------------------------------------------- */
  (function navDropdowns() {
    var hoverable = window.matchMedia('(hover: hover)').matches;

    each(document.querySelectorAll('.main-nav > li.has-dropdown'), function (li) {
      var link = li.querySelector('a');
      var closeTimer;

      function open()  { li.classList.add('is-open');    link.setAttribute('aria-expanded', 'true'); }
      function close() { li.classList.remove('is-open'); link.setAttribute('aria-expanded', 'false'); }

      if (hoverable) {
        li.addEventListener('mouseenter', function () { clearTimeout(closeTimer); open(); });
        li.addEventListener('mouseleave', function () { closeTimer = setTimeout(close, 120); });
        li.addEventListener('focusin', open);
        li.addEventListener('focusout', function (e) {
          if (!li.contains(e.relatedTarget)) close();
        });
      } else {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          if (li.classList.contains('is-open')) { close(); } else { open(); }
        });
      }
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    });
  })();

  /* ---------------------------------------------------------------------
     5. Off-canvas mobile menu
     --------------------------------------------------------------------- */
  (function offcanvas() {
    var panel    = document.getElementById('mobile-menu');
    var backdrop = document.querySelector('.offcanvas-backdrop');
    if (!panel || !backdrop) return;

    var lastFocus = null;

    function open(trigger) {
      lastFocus = trigger || document.activeElement;
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.classList.add('no-scroll');
      panel.setAttribute('aria-hidden', 'false');
      var first = panel.querySelector('button, a, input');
      if (first) first.focus();
    }
    function close() {
      panel.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      panel.setAttribute('aria-hidden', 'true');
      if (lastFocus) lastFocus.focus();
    }

    each(document.querySelectorAll('[data-open-menu]'), function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(b); });
    });
    each(document.querySelectorAll('[data-close-menu]'), function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); close(); });
    });
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
    });

    each(panel.querySelectorAll('.toggle-sub'), function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var li = btn.parentNode.parentNode;
        li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', li.classList.contains('is-open') ? 'true' : 'false');
      });
    });
  })();

  /* ---------------------------------------------------------------------
     6. Back to top
     --------------------------------------------------------------------- */
  (function backToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    var ticking = false;

    function update() {
      btn.classList.toggle('is-active', window.pageYOffset > 300);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    update();
  })();

  /* ---------------------------------------------------------------------
     7. Search — the original posts to WordPress; here it goes to the
        static search page, which filters the bundled product JSON.
     --------------------------------------------------------------------- */
  each(document.querySelectorAll('.searchform'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var qField = form.querySelector('.search-field');
      var cField = form.querySelector('.search-cats');
      var q   = qField ? qField.value.trim() : '';
      var cat = cField ? cField.value : '';
      var base = form.getAttribute('data-base') || '';
      var url = base + 'tim-kiem.html?s=' + encodeURIComponent(q);
      if (cat) url += '&cat=' + encodeURIComponent(cat);
      window.location.href = url;
    });
  });

  /* ---------------------------------------------------------------------
     8. Product-detail gallery
     --------------------------------------------------------------------- */
  (function productGallery() {
    var main   = document.querySelector('.gallery-main img');
    var thumbs = document.querySelectorAll('.gallery-thumbs button');
    if (!main || !thumbs.length) return;

    each(thumbs, function (btn) {
      btn.addEventListener('click', function () {
        each(thumbs, function (b) { b.setAttribute('aria-selected', 'false'); });
        btn.setAttribute('aria-selected', 'true');
        main.src = btn.getAttribute('data-full');
        main.alt = btn.getAttribute('data-alt') || '';
      });
    });
  })();
})();
