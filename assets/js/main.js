(function(){
  "use strict";

  /* Mobile menu toggle */
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function(){
      mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('is-open'));
    });
  }

  /* Nav dropdown toggle on mobile (tap parent to expand submenu) */
  document.querySelectorAll('.main-nav > li').forEach(function(li){
    var link = li.querySelector(':scope > a');
    var dropdown = li.querySelector('.dropdown');
    if (!dropdown || !link) return;
    link.addEventListener('click', function(e){
      if (window.innerWidth <= 860) {
        e.preventDefault();
        li.classList.toggle('is-open');
      }
    });
  });

  /* Category flyout panel */
  var catToggle = document.querySelector('.cat-toggle');
  var catPanel = document.querySelector('.cat-panel');
  if (catToggle && catPanel) {
    catToggle.addEventListener('click', function(){
      catPanel.classList.toggle('is-open');
    });
    document.addEventListener('click', function(e){
      if (!catPanel.contains(e.target) && !catToggle.contains(e.target)) {
        catPanel.classList.remove('is-open');
      }
    });
  }

  /* Sticky header shadow on scroll */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if (!header) return;
    if (window.scrollY > 10) header.style.boxShadow = '0 4px 16px rgba(0,20,50,.10)';
    else header.style.boxShadow = 'none';

    var backTop = document.querySelector('.back-to-top');
    if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Back to top */
  var backTop = document.querySelector('.back-to-top');
  if (backTop) {
    backTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Hero slider */
  document.querySelectorAll('.hero-slider').forEach(function(slider){
    var track = slider.querySelector('.hero-slider__track');
    var slides = slider.querySelectorAll('.hero-slider__slide');
    var dotsWrap = slider.querySelector('.hero-slider__dots');
    var prevBtn = slider.querySelector('.prev');
    var nextBtn = slider.querySelector('.next');
    if (!track || slides.length === 0) return;
    var index = 0;
    var dots = [];

    if (dotsWrap) {
      slides.forEach(function(_, i){
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Đến slide ' + (i + 1));
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', function(){ goTo(i); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function goTo(i){
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function(d, di){ d.classList.toggle('is-active', di === index); });
    }
    if (prevBtn) prevBtn.addEventListener('click', function(){ goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ goTo(index + 1); });

    if (slides.length > 1) {
      var timer = setInterval(function(){ goTo(index + 1); }, 5000);
      slider.addEventListener('mouseenter', function(){ clearInterval(timer); });
      slider.addEventListener('mouseleave', function(){ timer = setInterval(function(){ goTo(index + 1); }, 5000); });
    }
  });

  /* Product gallery thumbnail swap */
  document.querySelectorAll('.gallery').forEach(function(gallery){
    var mainImg = gallery.querySelector('.gallery__main img');
    var thumbs = gallery.querySelectorAll('.gallery__thumbs img');
    thumbs.forEach(function(thumb){
      thumb.addEventListener('click', function(){
        if (!mainImg) return;
        mainImg.src = thumb.dataset.full || thumb.src;
        thumbs.forEach(function(t){ t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  });

  /* Product detail tabs */
  document.querySelectorAll('.tabs').forEach(function(tabs){
    var buttons = tabs.querySelectorAll('.tabs__nav button');
    var panels = tabs.querySelectorAll('.tabs__panel');
    buttons.forEach(function(btn, i){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('is-active'); });
        panels.forEach(function(p){ p.classList.remove('is-active'); });
        btn.classList.add('is-active');
        if (panels[i]) panels[i].classList.add('is-active');
      });
    });
  });

  /* Simple client-side product search (filters visible product cards; degrades gracefully without JS since it's a normal form) */
  var searchForm = document.querySelector('.header-search form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e){
      var q = searchForm.querySelector('input[name="s"]');
      if (q && !q.value.trim()) {
        e.preventDefault();
      }
    });
  }
})();
