/**
 * Lightbox — click any .bento-card--img to preview full-size.
 * Supports keyboard (Esc, ←, →) and swipe on mobile.
 */
(function () {
    'use strict';

    /* ---- Build DOM ---- */
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">✕</button>
    <button class="lightbox-arrow lightbox-prev" aria-label="Previous">‹</button>
    <button class="lightbox-arrow lightbox-next" aria-label="Next">›</button>
    <img src="" alt="">
    <div class="lightbox-caption"></div>
    <div class="lightbox-counter"></div>
  `;
    document.body.appendChild(overlay);

    const lbImg = overlay.querySelector('img');
    const caption = overlay.querySelector('.lightbox-caption');
    const counter = overlay.querySelector('.lightbox-counter');
    const btnClose = overlay.querySelector('.lightbox-close');
    const btnPrev = overlay.querySelector('.lightbox-prev');
    const btnNext = overlay.querySelector('.lightbox-next');

    let images = [];   // array of { src, alt }
    let current = 0;

    /* ---- Collect images ---- */
    function collectImages() {
        images = [];
        document.querySelectorAll('.bento-card--img img').forEach(img => {
            images.push({ src: img.src, alt: img.alt || '' });
        });
    }

    /* ---- Show / Hide ---- */
    function show(index) {
        if (images.length === 0) return;
        current = index;
        lbImg.src = images[current].src;
        lbImg.alt = images[current].alt;

        caption.textContent = images[current].alt;
        caption.style.display = images[current].alt ? '' : 'none';

        counter.textContent = `${current + 1} / ${images.length}`;
        counter.style.display = images.length > 1 ? '' : 'none';

        btnPrev.style.display = images.length > 1 ? '' : 'none';
        btnNext.style.display = images.length > 1 ? '' : 'none';

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hide() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prev() {
        if (images.length <= 1) return;
        show((current - 1 + images.length) % images.length);
    }

    function next() {
        if (images.length <= 1) return;
        show((current + 1) % images.length);
    }

    /* ---- Event: click image cards ---- */
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.bento-card--img');
        if (!card) return;
        const img = card.querySelector('img');
        if (!img) return;

        collectImages();
        const idx = images.findIndex(i => i.src === img.src);
        if (idx !== -1) show(idx);
    });

    /* ---- Event: close ---- */
    btnClose.addEventListener('click', (e) => { e.stopPropagation(); hide(); });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hide();
    });

    /* ---- Event: arrows ---- */
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

    /* ---- Event: keyboard ---- */
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') hide();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    /* ---- Event: swipe (mobile) ---- */
    let touchStartX = 0;
    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? prev() : next();
        }
    }, { passive: true });

})();
