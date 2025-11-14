document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const storedTheme = window.localStorage?.getItem('nea-theme');

  if (storedTheme === 'light') {
    body.classList.add('is-light');
  } else if (storedTheme === 'dark') {
    body.classList.remove('is-light');
  }

  themeToggle?.addEventListener('click', () => {
    const isLight = body.classList.toggle('is-light');
    try {
      window.localStorage.setItem('nea-theme', isLight ? 'light' : 'dark');
    } catch (error) {
      // Storage might be unavailable; fail silently.
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltTargets = document.querySelectorAll('[data-tilt]');
    tiltTargets.forEach((target) => {
      const resetTilt = () => {
        target.style.transform = '';
        target.classList.remove('is-hovering');
      };

      target.addEventListener('pointerenter', () => {
        target.classList.add('is-hovering');
      });

      target.addEventListener('pointerleave', resetTilt);

      target.addEventListener('pointermove', (event) => {
        const rect = target.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;

        const tiltX = (0.5 - relativeY) * 16;
        const tiltY = (relativeX - 0.5) * 16;

        target.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        target.style.setProperty('--tilt-x', `${relativeX * 100}%`);
        target.style.setProperty('--tilt-y', `${relativeY * 100}%`);
      });

      target.addEventListener('focusout', resetTilt);
    });
  }

  const triggers = Array.from(document.querySelectorAll('.detail-item'));
  if (!triggers.length) {
    return;
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-inner">
      <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
      <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">&#10094;</button>
      <img class="lightbox-image" alt="" />
      <button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&#10095;</button>
    </div>
  `;

  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  let currentIndex = 0;
  let isOpen = false;

  const updateNavState = () => {
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= triggers.length - 1;
  };

  const openLightbox = (index) => {
    const trigger = triggers[index];
    const fullSrc = trigger.dataset.full || trigger.querySelector('img')?.src;
    if (!fullSrc) {
      return;
    }
    currentIndex = index;
    image.src = fullSrc;
    image.alt = trigger.dataset.alt || trigger.querySelector('img')?.alt || '';
    lightbox.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    updateNavState();
    isOpen = true;
    closeBtn.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-visible');
    image.src = '';
    document.body.style.overflow = '';
    isOpen = false;
    triggers[currentIndex].focus({ preventScroll: true });
  };

  const showPrevious = () => {
    if (currentIndex > 0) {
      openLightbox(currentIndex - 1);
    }
  };

  const showNext = () => {
    if (currentIndex < triggers.length - 1) {
      openLightbox(currentIndex + 1);
    }
  };

  triggers.forEach((trigger, index) => {
    const altText = trigger.dataset.alt || trigger.querySelector('img')?.alt || '';
    if (altText && !trigger.hasAttribute('aria-label')) {
      trigger.setAttribute('aria-label', altText);
    }

    trigger.addEventListener('click', () => openLightbox(index));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevious);
  nextBtn.addEventListener('click', showNext);

  document.addEventListener('keydown', (event) => {
    if (!isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  });
});
