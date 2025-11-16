const detailData = {
  paintings: {
    title: 'Paintings',
    gallery: [
      { src: 'images/Paintings/IMG20240121130029.webp' },
      { src: 'images/Paintings/IMG20240121130143.webp' },
      { src: 'images/Paintings/IMG20240121132133.webp' },
      { src: 'images/Paintings/IMG20240121130152.webp' },
      { src: 'images/Paintings/IMG20240121130258.webp' },
      { src: 'images/Paintings/img20250925_16180935.webp' },
      { src: 'images/Paintings/img20250925_16201163.webp' },
      { src: 'images/Paintings/IMG20240121133044.webp' },
    ],
  },
  characters: {
    title: 'Characters',
    gallery: [
      { src: 'images/Characters/Screenshot_2025-10-21_202456.webp' },
      { src: 'images/Characters/Screenshot_2025-10-21_202831.webp' },
    ],
  },
  animations: {
    title: 'Animations',
    video: {
      src: 'https://www.youtube.com/embed/BMqpDYKC6Ms?rel=0&controls=1&modestbranding=1',
      title: 'Moois Genoeg',
    },
    gallery: [{ src: 'images/Animations/JellyFrog.gif' }],
  },
  games: {
    title: 'Games',
    gallery: [
      { src: 'images/Games/Materials2.webp' },
      { src: 'images/Games/Unnamed.webp' },
      { src: 'images/Games/efwgeqq-1.webp' },
      { src: 'images/Games/fefefeefe-0.webp' },
      { src: 'images/Games/fefefeefefffeefwef-0.webp' },
      { src: 'images/Games/media4.gif' },
    ],
  },
  'other-works': {
    title: 'Other Works',
    gallery: [
      { src: 'images/Other%20Works/Uhs.webp' },
      { src: 'images/Other%20Works/grehtre.webp' },
    ],
  },
  about: {
    title: 'About me',
    gallery: [],
  },
};

const renderDetailPage = () => {
  const pageKey = document.body.dataset.gallery;
  const detailRoot = document.getElementById('detail-root');
  if (!pageKey || !detailRoot) {
    return;
  }

  const detail = detailData[pageKey];
  detailRoot.innerHTML = '';

  if (!detail) {
    const message = document.createElement('p');
    message.className = 'detail-description';
    message.textContent = 'The requested gallery could not be found.';
    detailRoot.appendChild(message);
    return;
  }

  const header = document.createElement('header');
  const backLink = document.createElement('a');
  backLink.className = 'back-link';
  backLink.href = 'index.html';
  backLink.textContent = '← Back to portfolio';
  header.appendChild(backLink);

  const heading = document.createElement('h1');
  heading.textContent = detail.title;
  header.appendChild(heading);
  detailRoot.appendChild(header);

  const main = document.createElement('main');

  if (detail.description) {
    const descriptionSection = document.createElement('section');
    descriptionSection.className = 'detail-description';
    descriptionSection.innerHTML = detail.description;
    main.appendChild(descriptionSection);
  }

  if (detail.video) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    const iframe = document.createElement('iframe');
    iframe.src = detail.video.src;
    iframe.title = detail.video.title || detail.title;
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    videoContainer.appendChild(iframe);
    main.appendChild(videoContainer);
  }

  if (Array.isArray(detail.gallery) && detail.gallery.length) {
    const gallerySection = document.createElement('section');
    gallerySection.className = 'detail-gallery';

    detail.gallery.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'detail-item';
      const fullImage = item.full || item.src;
      button.dataset.full = fullImage;
      if (item.alt) {
        button.dataset.alt = item.alt;
      }

      const image = document.createElement('img');
      image.src = item.thumb || item.src;
      image.alt = item.alt || '';
      image.loading = 'lazy';
      button.appendChild(image);
      gallerySection.appendChild(button);
    });

    main.appendChild(gallerySection);
  }

  detailRoot.appendChild(main);
  document.title = `${detail.title} - Nacef el Ajami`;
};

const setupLightbox = () => {
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
      <div class="lightbox-controls" aria-label="Zoom controls">
        <button type="button" class="zoom-button zoom-out" aria-label="Zoom out">−</button>
        <button type="button" class="zoom-button zoom-reset" aria-label="Reset zoom">1:1</button>
        <button type="button" class="zoom-button zoom-in" aria-label="Zoom in">+</button>
      </div>
      <button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&#10095;</button>
    </div>
  `;

  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  const lightboxInner = lightbox.querySelector('.lightbox-inner');
  const zoomOutBtn = lightbox.querySelector('.zoom-out');
  const zoomResetBtn = lightbox.querySelector('.zoom-reset');
  const zoomInBtn = lightbox.querySelector('.zoom-in');

  let currentIndex = 0;
  let isOpen = false;
  let zoomLevel = 1;
  const minZoom = 1;
  const maxZoom = 16;
  const zoomMultiplier = 1.25;
  const quickZoomLevel = 10;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;

  const clampPan = () => {
    const baseWidth = image.offsetWidth || 0;
    const baseHeight = image.offsetHeight || 0;
    const maxPanX = Math.max(0, ((baseWidth * zoomLevel) - baseWidth) / 2);
    const maxPanY = Math.max(0, ((baseHeight * zoomLevel) - baseHeight) / 2);
    panX = Math.min(Math.max(panX, -maxPanX), maxPanX);
    panY = Math.min(Math.max(panY, -maxPanY), maxPanY);
  };

  const updateImageTransform = () => {
    clampPan();
    image.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    image.classList.toggle('is-zoomed', zoomLevel > minZoom);
  };

  const updateZoomButtons = () => {
    const atMinZoom = zoomLevel <= minZoom + 0.01;
    const atMaxZoom = zoomLevel >= maxZoom - 0.01;
    if (zoomOutBtn) {
      zoomOutBtn.disabled = atMinZoom;
    }
    if (zoomResetBtn) {
      zoomResetBtn.disabled = atMinZoom;
    }
    if (zoomInBtn) {
      zoomInBtn.disabled = atMaxZoom;
    }
  };

  const stopDragging = (event) => {
    if (!isDragging) {
      return;
    }

    if (event && dragPointerId !== null && event.pointerId !== dragPointerId) {
      return;
    }

    isDragging = false;
    image.classList.remove('is-dragging');
    if (
      dragPointerId !== null &&
      typeof image.releasePointerCapture === 'function' &&
      typeof image.hasPointerCapture === 'function' &&
      image.hasPointerCapture(dragPointerId)
    ) {
      image.releasePointerCapture(dragPointerId);
    }
    dragPointerId = null;
  };

  const startDragging = (event) => {
    if (zoomLevel <= minZoom) {
      return;
    }

    event.preventDefault();
    isDragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    image.classList.add('is-dragging');
    if (typeof image.setPointerCapture === 'function') {
      image.setPointerCapture(dragPointerId);
    }
  };

  const handlePointerMove = (event) => {
    if (!isDragging || event.pointerId !== dragPointerId) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    panX += deltaX;
    panY += deltaY;
    updateImageTransform();
  };

  const applyZoom = () => {
    if (zoomLevel <= minZoom && isDragging) {
      stopDragging();
    }

    updateImageTransform();
    updateZoomButtons();
  };

  const resetZoom = () => {
    if (isDragging) {
      stopDragging();
    }

    zoomLevel = minZoom;
    panX = 0;
    panY = 0;
    applyZoom();
  };

  const getImageCenter = () => {
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const adjustPanForFocus = (originX, originY, previousZoom) => {
    if (typeof originX !== 'number' || typeof originY !== 'number') {
      return;
    }

    const rect = image.getBoundingClientRect();
    if (!(rect.width > 0 && rect.height > 0)) {
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = originX - centerX;
    const offsetY = originY - centerY;
    const zoomRatio = zoomLevel / previousZoom;
    const adjust = 1 - zoomRatio;
    panX += adjust * (offsetX - panX);
    panY += adjust * (offsetY - panY);
  };

  const setZoom = (targetZoom, originX, originY) => {
    const previousZoom = zoomLevel;
    const nextZoom = Math.min(maxZoom, Math.max(minZoom, targetZoom));
    if (Math.abs(nextZoom - previousZoom) < 0.001) {
      return;
    }

    zoomLevel = nextZoom;
    adjustPanForFocus(originX, originY, previousZoom);
    applyZoom();
  };

  const zoomIn = (originX, originY) => {
    setZoom(zoomLevel * zoomMultiplier, originX, originY);
  };

  const zoomOut = (originX, originY) => {
    setZoom(zoomLevel / zoomMultiplier, originX, originY);
  };

  const openLightbox = (index) => {
    const trigger = triggers[index];
    const fullSrc = trigger.dataset.full || trigger.querySelector('img')?.src;
    if (!fullSrc) {
      return;
    }

    currentIndex = index;
    resetZoom();
    image.src = fullSrc;
    image.alt = trigger.dataset.alt || trigger.querySelector('img')?.alt || '';
    lightbox.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    closeBtn.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-visible');
    image.src = '';
    document.body.style.overflow = '';
    isOpen = false;
    resetZoom();
    triggers[currentIndex].focus({ preventScroll: true });
  };

  const showPrevious = () => {
    const previousIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    openLightbox(previousIndex);
  };

  const showNext = () => {
    const nextIndex = (currentIndex + 1) % triggers.length;
    openLightbox(nextIndex);
  };

  const handleWheelZoom = (event) => {
    if (!isOpen) {
      return;
    }

    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    if (direction > 0) {
      zoomIn(event.clientX, event.clientY);
    } else {
      zoomOut(event.clientX, event.clientY);
    }
  };

  const handleDoubleClick = (event) => {
    event.preventDefault();
    if (zoomLevel > minZoom + 0.05) {
      resetZoom();
      return;
    }

    setZoom(Math.min(maxZoom, quickZoomLevel), event.clientX, event.clientY);
  };

  const handleOuterClick = (event) => {
    if (!isOpen) {
      return;
    }

    if (event.target === lightbox || event.target === backdrop || event.target === lightboxInner) {
      closeLightbox();
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
  lightbox.addEventListener('click', handleOuterClick);
  lightboxInner.addEventListener('click', handleOuterClick);
  prevBtn.addEventListener('click', showPrevious);
  nextBtn.addEventListener('click', showNext);
  lightboxInner.addEventListener('wheel', handleWheelZoom, { passive: false });
  image.addEventListener('dblclick', handleDoubleClick);
  image.addEventListener('pointerdown', startDragging);
  image.addEventListener('pointermove', handlePointerMove);
  image.addEventListener('pointerup', stopDragging);
  image.addEventListener('pointercancel', stopDragging);

  const handleZoomButton = (action) => {
    const center = getImageCenter();
    const originX = center ? center.x : undefined;
    const originY = center ? center.y : undefined;
    action(originX, originY);
  };

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => handleZoomButton(zoomIn));
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => handleZoomButton(zoomOut));
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', resetZoom);
  }

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
};

const setupThumbnailPhysics = () => {
  const triggerButton = document.getElementById('gravity-toggle');
  const gallery = document.querySelector('.gallery');
  const footer = document.querySelector('footer');
  if (!triggerButton || !gallery) {
    return;
  }

  const cards = Array.from(gallery.querySelectorAll('.card'));
  if (!cards.length) {
    return;
  }

  const states = cards.map((card) => ({
    el: card,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    dragging: false,
    pointerId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastDragX: 0,
    lastDragY: 0,
    lastDragTime: 0,
    active: false,
    originalStyle: null,
  }));

  const stateByElement = new Map(states.map((state) => [state.el, state]));
  const gravity = 2600;
  const bounce = 0.6;
  const airResistance = 0.993;
  const groundFriction = 0.88;
  const maxVelocity = 2400;
  const collisionDamping = 0.9;
  const groundBuffer = 16;
  let physicsEnabled = false;
  let rafId = null;
  let lastFrameTime = null;
  let scrollX = window.scrollX || window.pageXOffset || 0;
  let scrollY = window.scrollY || window.pageYOffset || 0;
  let savedGalleryMinHeight = null;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const refreshScrollPosition = () => {
    scrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;
    scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  };

  const updateElement = (state) => {
    if (!state.active) {
      return;
    }
    const displayX = state.x - scrollX;
    const displayY = state.y - scrollY;
    state.el.style.transform = `translate3d(${displayX}px, ${displayY}px, 0)`;
  };

  const updateAllElements = () => {
    states.forEach(updateElement);
  };

  const getWorldWidth = () =>
    Math.max(
      document.documentElement.clientWidth,
      document.documentElement.scrollWidth,
      document.body ? document.body.scrollWidth : 0,
    );

  const getWorldHeight = () =>
    Math.max(
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );

  const getGroundLimit = () => {
    if (footer) {
      const rect = footer.getBoundingClientRect();
      return rect.top + scrollY - groundBuffer;
    }
    return getWorldHeight() - groundBuffer;
  };

  const enforceBounds = (state, worldWidth, groundLimit) => {
    const limitX = Math.max(0, worldWidth - state.width);
    const limitY = Math.max(0, groundLimit - state.height);

    if (state.x <= 0) {
      state.x = 0;
      state.vx = Math.abs(state.vx) * bounce;
    } else if (state.x >= limitX) {
      state.x = limitX;
      state.vx = -Math.abs(state.vx) * bounce;
    }

    if (state.y <= 0) {
      state.y = 0;
      state.vy = Math.abs(state.vy) * bounce;
    } else if (state.y >= limitY) {
      state.y = limitY;
      state.vy = -Math.abs(state.vy) * bounce;
      state.vx *= groundFriction;
      if (Math.abs(state.vy) < 12) {
        state.vy = 0;
      }
    }
  };

  const resolveCollisions = () => {
    for (let i = 0; i < states.length; i += 1) {
      const a = states[i];
      if (!a.active || a.dragging) {
        continue;
      }
      for (let j = i + 1; j < states.length; j += 1) {
        const b = states[j];
        if (!b.active || b.dragging) {
          continue;
        }

        const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        if (overlapX <= 0) {
          continue;
        }
        const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        if (overlapY <= 0) {
          continue;
        }

        if (overlapX < overlapY) {
          const shift = overlapX / 2 + 0.5;
          if (a.x < b.x) {
            a.x -= shift;
            b.x += shift;
          } else {
            a.x += shift;
            b.x -= shift;
          }
          const newVxA = b.vx * collisionDamping;
          const newVxB = a.vx * collisionDamping;
          a.vx = clamp(newVxA, -maxVelocity, maxVelocity);
          b.vx = clamp(newVxB, -maxVelocity, maxVelocity);
        } else {
          const shift = overlapY / 2 + 0.5;
          if (a.y < b.y) {
            a.y -= shift;
            b.y += shift;
          } else {
            a.y += shift;
            b.y -= shift;
          }
          const newVyA = b.vy * collisionDamping;
          const newVyB = a.vy * collisionDamping;
          a.vy = clamp(newVyA, -maxVelocity, maxVelocity);
          b.vy = clamp(newVyB, -maxVelocity, maxVelocity);
        }
      }
    }
  };

  const stopLoop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastFrameTime = null;
  };

  const frame = (timestamp) => {
    if (!physicsEnabled) {
      return;
    }

    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    const delta = Math.min(0.032, (timestamp - lastFrameTime) / 1000);
    lastFrameTime = timestamp;
    refreshScrollPosition();

    const worldWidth = getWorldWidth();
    const groundLimit = getGroundLimit();

    states.forEach((state) => {
      if (!state.active || state.dragging) {
        return;
      }

      state.vy += gravity * delta;
      state.x += state.vx * delta;
      state.y += state.vy * delta;
      enforceBounds(state, worldWidth, groundLimit);
      state.vx = clamp(state.vx * airResistance, -maxVelocity, maxVelocity);
      state.vy = clamp(state.vy * airResistance, -maxVelocity, maxVelocity);
    });

    resolveCollisions();

    states.forEach((state) => {
      if (!state.active) {
        return;
      }
      enforceBounds(state, worldWidth, groundLimit);
      updateElement(state);
    });

    rafId = requestAnimationFrame(frame);
  };

  const startLoop = () => {
    if (rafId) {
      return;
    }
    rafId = requestAnimationFrame(frame);
  };

  const handlePointerDown = (event) => {
    if (!physicsEnabled) {
      return;
    }

    const state = stateByElement.get(event.currentTarget);
    if (!state || !state.active) {
      return;
    }

    event.preventDefault();
    refreshScrollPosition();
    const pointerWorldX = event.clientX + scrollX;
    const pointerWorldY = event.clientY + scrollY;
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragOffsetX = pointerWorldX - state.x;
    state.dragOffsetY = pointerWorldY - state.y;
    state.vx = 0;
    state.vy = 0;
    state.lastDragX = pointerWorldX;
    state.lastDragY = pointerWorldY;
    state.lastDragTime = performance.now();
    state.el.classList.add('is-dragging');
    if (typeof state.el.setPointerCapture === 'function') {
      state.el.setPointerCapture(state.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    const state = stateByElement.get(event.currentTarget);
    if (!state || !state.dragging || event.pointerId !== state.pointerId) {
      return;
    }

    event.preventDefault();
    refreshScrollPosition();
    const pointerWorldX = event.clientX + scrollX;
    const pointerWorldY = event.clientY + scrollY;
    const now = performance.now();
    const delta = Math.max(0.001, (now - state.lastDragTime) / 1000);
    const worldWidth = getWorldWidth();
    const groundLimit = getGroundLimit();
    state.x = clamp(pointerWorldX - state.dragOffsetX, 0, Math.max(0, worldWidth - state.width));
    state.y = clamp(pointerWorldY - state.dragOffsetY, 0, Math.max(0, groundLimit - state.height));
    state.vx = clamp((pointerWorldX - state.lastDragX) / delta, -maxVelocity, maxVelocity);
    state.vy = clamp((pointerWorldY - state.lastDragY) / delta, -maxVelocity, maxVelocity);
    state.lastDragX = pointerWorldX;
    state.lastDragY = pointerWorldY;
    state.lastDragTime = now;
    updateElement(state);
  };

  const handlePointerUp = (event) => {
    const state = stateByElement.get(event.currentTarget);
    if (!state || !state.dragging || event.pointerId !== state.pointerId) {
      return;
    }

    event.preventDefault();
    state.dragging = false;
    state.pointerId = null;
    state.el.classList.remove('is-dragging');
    if (typeof state.el.releasePointerCapture === 'function') {
      state.el.releasePointerCapture(event.pointerId);
    }
  };

  const preventNavigation = (event) => {
    if (physicsEnabled) {
      event.preventDefault();
    }
  };

  const handleResize = () => {
    refreshScrollPosition();
    updateAllElements();
  };

  const handleScroll = () => {
    refreshScrollPosition();
    updateAllElements();
  };

  const enablePhysics = () => {
    if (physicsEnabled) {
      return;
    }

    physicsEnabled = true;
    refreshScrollPosition();
    triggerButton.classList.add('is-active');
    triggerButton.textContent = 'Reset the thumbnails';
    gallery.classList.add('is-floating');
    savedGalleryMinHeight = gallery.style.minHeight || '';
    const measuredHeight = gallery.offsetHeight;
    gallery.style.minHeight = `${Math.max(measuredHeight, window.innerHeight * 0.8)}px`;

    states.forEach((state) => {
      const rect = state.el.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      state.x = rect.left + scrollX;
      state.y = rect.top + scrollY;
      state.vx = (Math.random() - 0.5) * 200;
      state.vy = Math.random() * 180;
      state.dragging = false;
      state.active = true;
      state.originalStyle = state.el.getAttribute('style');
      state.el.style.position = 'fixed';
      state.el.style.margin = '0';
      state.el.style.left = '0';
      state.el.style.top = '0';
      state.el.style.width = `${state.width}px`;
      state.el.style.height = `${state.height}px`;
      state.el.style.zIndex = '30';
      state.el.classList.add('card-floating');
      state.el.addEventListener('pointerdown', handlePointerDown);
      state.el.addEventListener('pointermove', handlePointerMove);
      state.el.addEventListener('pointerup', handlePointerUp);
      state.el.addEventListener('pointercancel', handlePointerUp);
      state.el.addEventListener('click', preventNavigation);
      updateElement(state);
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    startLoop();
  };

  const disablePhysics = () => {
    if (!physicsEnabled) {
      return;
    }

    physicsEnabled = false;
    triggerButton.classList.remove('is-active');
    triggerButton.textContent = 'Drop the thumbnails!';
    gallery.classList.remove('is-floating');
    if (savedGalleryMinHeight !== null) {
      gallery.style.minHeight = savedGalleryMinHeight;
      savedGalleryMinHeight = null;
    }

    stopLoop();
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);

    states.forEach((state) => {
      if (!state.active) {
        return;
      }
      state.active = false;
      state.dragging = false;
      state.pointerId = null;
      state.el.classList.remove('card-floating', 'is-dragging');
      state.el.removeEventListener('pointerdown', handlePointerDown);
      state.el.removeEventListener('pointermove', handlePointerMove);
      state.el.removeEventListener('pointerup', handlePointerUp);
      state.el.removeEventListener('pointercancel', handlePointerUp);
      state.el.removeEventListener('click', preventNavigation);
      if (state.originalStyle) {
        state.el.setAttribute('style', state.originalStyle);
      } else {
        state.el.removeAttribute('style');
      }
    });

    refreshScrollPosition();
  };

  triggerButton.addEventListener('click', () => {
    if (physicsEnabled) {
      disablePhysics();
    } else {
      enablePhysics();
    }
  });
};

const init = () => {
  renderDetailPage();
  setupLightbox();
  setupThumbnailPhysics();
};

document.addEventListener('DOMContentLoaded', init);
