const detailData = {
  paintings: {
    title: 'Paintings',
    gallery: [
      { src: 'images/Paintings/Paintings/IMG20240121130029.webp' },
      { src: 'images/Paintings/Paintings/IMG20240121130143.webp' },
      { src: 'images/Paintings/Paintings/IMG20240121132133.webp' },
      {
        src: 'images/Paintings/Paintings/IMG20240121130152.webp',
        alt: 'Based on The Ellipse by René Magritte',
      },
      { src: 'images/Paintings/Paintings/IMG20240121130258.webp' },
      { src: 'images/Paintings/Paintings/img20250925_16180935.webp' },
      { src: 'images/Paintings/Paintings/img20250925_16201163.webp' },
      { src: 'images/Paintings/Paintings/IMG20240121133044.webp' },
    ],
  },
  characters: {
    title: 'Characters',
    description:
      '<p>Concept art by <a href="https://www.instagram.com/joep.eilander?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">Joep Eilander</a>.</p>',
    gallery: [
      { src: 'images/Characters/Characters/Screenshot_2025-10-21_202456.webp' },
      { src: 'images/Characters/Characters/Screenshot_2025-10-21_202831.webp' },
      {
        src: 'images/Characters/Characters/Reference.webp',
        alt: 'Concept art by Joep Eilander',
      },
    ],
  },
  animations: {
    title: 'Animations',
    video: {
      src: 'https://www.youtube.com/embed/BMqpDYKC6Ms?rel=0&controls=1&modestbranding=1',
      title: 'Moois Genoeg',
    },
    gallery: [{ src: 'images/Animations/Animations/JellyFrog.gif' }],
  },
  games: {
    title: 'Games',
    description:
      '<p>Assets I made for Meliora whilst working at M2H, base textures made by <a href="https://jc_ptrs.artstation.com/">Carl Peters</a>.</p>',
    gallery: [
      { src: 'images/Games/Games/Materials2.webp' },
      { src: 'images/Games/Games/Unnamed.webp' },
      { src: 'images/Games/Games/efwgeqq-1.webp' },
      { src: 'images/Games/Games/fefefeefe-0.webp' },
      { src: 'images/Games/Games/fefefeefefffeefwef-0.webp' },
      { src: 'images/Games/Games/media4.gif' },
    ],
  },
  'other-works': {
    title: 'Other Works',
    gallery: [
      { src: 'images/Other%20Works/Other%20Works/0fp.png' },
      { src: 'images/Other%20Works/Other%20Works/6be.png' },
      { src: 'images/Other%20Works/Other%20Works/B6a.png' },
      { src: 'images/Other%20Works/Other%20Works/Bfc.png' },
      { src: 'images/Other%20Works/Other%20Works/Fpj.png' },
      { src: 'images/Other%20Works/Other%20Works/Xdw.png' },
      { src: 'images/Other%20Works/Other%20Works/grehtre.webp' },
    ],
  },
  about: {
    description: `
      <div class="about-wrapper">
        <div class="about-bio">
          <img
            class="about-portrait"
            src="images/About%20me/About%20me/IMG20251117164816.webp"
            alt="Portrait of Nacef el Ajami"
            loading="lazy"
          />
          <div class="about-copy">
            <p class="about-greeting">Hi!</p>
            <p>My name is Nacef el Ajami, I’m a freelance 3D artist, illustrator and animator. If you’re making something cool, or need something cool made, I’d love to help!</p>

            <p class="about-mail"><b>hey@nacef.nl</b></p>
          </div>
        </div>
      </div>
    `,
    gallery: [],
  }
};

let audioContext;
let isHoverSoundMuted = true;

const ensureAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
};

const playHoverSound = (playbackRate = 1) => {
  if (isHoverSoundMuted) return;

  ensureAudioContext();
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();

  const now = audioContext.currentTime;
  const duration = 0.18;
  const baseFrequency = 520 * playbackRate;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(baseFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(baseFrequency * 0.65, now + duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(650, now + duration);
  filter.Q.value = 1.2;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.24, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter).connect(gainNode).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
};

const updateAudioToggleButton = () => {
  const toggle = document.getElementById('audio-toggle');
  if (!toggle) return;

  const icon = toggle.querySelector('img');
  const isActive = !isHoverSoundMuted;
  toggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  toggle.setAttribute('aria-label', isActive ? 'Mute hover sounds' : 'Unmute hover sounds');

  if (icon) {
    icon.src = isActive ? 'images/Index/Index/Unmuted.png' : 'images/Index/Index/Muted.png';
    icon.alt = isActive ? 'Unmuted speaker icon' : 'Muted speaker icon';
  }
};

const setHoverSoundMuted = (muted) => {
  isHoverSoundMuted = muted;
  updateAudioToggleButton();
};

const setupAudioToggle = () => {
  const toggle = document.getElementById('audio-toggle');
  if (!toggle) return;

  updateAudioToggleButton();
  toggle.addEventListener('click', () => {
    if (isHoverSoundMuted) {
      setHoverSoundMuted(false);
    } else {
      setHoverSoundMuted(true);
    }
  });
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

  let descriptionSection;
  if (detail.description) {
    descriptionSection = document.createElement('section');
    descriptionSection.className = 'detail-description';
    descriptionSection.innerHTML = detail.description;
  }

  if (descriptionSection) {
    main.appendChild(descriptionSection);
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
        button.title = item.alt;
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

const setupThumbnailTones = () => {
  const cards = Array.from(document.querySelectorAll('.gallery .card')).sort((a, b) => {
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  if (!cards.length) return;

  const minRate = 0.85;
  const maxRate = 1.15;
  const step = cards.length > 1 ? (maxRate - minRate) / (cards.length - 1) : 0;

  cards.forEach((card, index) => {
    const playbackRate = minRate + step * index;
    card.dataset.playbackRate = playbackRate.toFixed(3);

    const trigger = () => playHoverSound(Number(card.dataset.playbackRate));

    card.addEventListener('mouseenter', trigger);
    card.addEventListener('focus', trigger);
  });
};

const setupZeroGravityPlayground = () => {
  const movableSelectors = [
    '.gallery .card',
    '.about-link',
    '#audio-toggle',
    'header .logo-section img',
  ];

  const items = movableSelectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector)),
  );

  if (!items.length) {
    return;
  }

  document.body.classList.add('zero-g-mode');
  document.body.style.height = `${window.innerHeight}px`;

  let boundsWidth = window.innerWidth;
  let boundsHeight = window.innerHeight;
  let lastFrame = performance.now();

  const bodies = items.map((el, index) => {
    const rect = el.getBoundingClientRect();
    const body = {
      el,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      vx: 0,
      vy: 0,
      dragging: false,
      pointerId: null,
      offsetX: 0,
      offsetY: 0,
      lastDragTime: null,
      lastDragX: 0,
      lastDragY: 0,
    };

    el.classList.add('zero-g-item');
    el.style.width = `${body.width}px`;
    el.style.height = `${body.height}px`;
    el.style.left = `${body.x}px`;
    el.style.top = `${body.y}px`;
    el.style.zIndex = `${10 + index}`;

    return body;
  });

  const clampToBounds = (body) => {
    const maxX = boundsWidth - body.width;
    const maxY = boundsHeight - body.height;
    body.x = Math.min(Math.max(body.x, 0), Math.max(maxX, 0));
    body.y = Math.min(Math.max(body.y, 0), Math.max(maxY, 0));
  };

  const applyEdgeBounce = (body) => {
    if (body.dragging) {
      clampToBounds(body);
      return;
    }

    const maxX = boundsWidth - body.width;
    const maxY = boundsHeight - body.height;

    if (body.x <= 0 && body.vx < 0) {
      body.x = 0;
      body.vx *= -1;
    }
    if (body.x >= maxX && body.vx > 0) {
      body.x = Math.max(maxX, 0);
      body.vx *= -1;
    }

    if (body.y <= 0 && body.vy < 0) {
      body.y = 0;
      body.vy *= -1;
    }
    if (body.y >= maxY && body.vy > 0) {
      body.y = Math.max(maxY, 0);
      body.vy *= -1;
    }
  };

  const resolveCollision = (a, b) => {
    const axCenter = a.x + a.width / 2;
    const ayCenter = a.y + a.height / 2;
    const bxCenter = b.x + b.width / 2;
    const byCenter = b.y + b.height / 2;

    const dx = axCenter - bxCenter;
    const dy = ayCenter - byCenter;
    const overlapX = (a.width + b.width) / 2 - Math.abs(dx);
    const overlapY = (a.height + b.height) / 2 - Math.abs(dy);

    if (overlapX <= 0 || overlapY <= 0) {
      return;
    }

    if (overlapX < overlapY) {
      const push = overlapX / 2;
      const direction = dx > 0 ? 1 : -1;
      if (!a.dragging) {
        a.x += push * direction;
        a.vx = Math.abs(a.vx) * direction;
      }
      if (!b.dragging) {
        b.x -= push * direction;
        b.vx = -Math.abs(b.vx) * direction;
      }
    } else {
      const push = overlapY / 2;
      const direction = dy > 0 ? 1 : -1;
      if (!a.dragging) {
        a.y += push * direction;
        a.vy = Math.abs(a.vy) * direction;
      }
      if (!b.dragging) {
        b.y -= push * direction;
        b.vy = -Math.abs(b.vy) * direction;
      }
    }
  };

  const tick = (now) => {
    const delta = Math.min((now - lastFrame) / 1000, 0.033);
    lastFrame = now;

    bodies.forEach((body) => {
      if (!body.dragging) {
        body.x += body.vx * delta;
        body.y += body.vy * delta;
      }
      applyEdgeBounce(body);
    });

    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        resolveCollision(bodies[i], bodies[j]);
      }
    }

    bodies.forEach((body) => {
      body.el.style.left = `${body.x}px`;
      body.el.style.top = `${body.y}px`;
    });

    requestAnimationFrame(tick);
  };

  let activeBody = null;

  const handlePointerMove = (event) => {
    if (!activeBody || activeBody.pointerId !== event.pointerId) {
      return;
    }

    const now = performance.now();
    const dt = activeBody.lastDragTime ? (now - activeBody.lastDragTime) / 1000 : 0;
    const targetX = event.clientX - activeBody.offsetX;
    const targetY = event.clientY - activeBody.offsetY;

    if (dt > 0) {
      activeBody.vx = (event.clientX - activeBody.lastDragX) / dt;
      activeBody.vy = (event.clientY - activeBody.lastDragY) / dt;
    }

    activeBody.x = targetX;
    activeBody.y = targetY;
    clampToBounds(activeBody);

    activeBody.lastDragTime = now;
    activeBody.lastDragX = event.clientX;
    activeBody.lastDragY = event.clientY;
  };

  const endDrag = (event) => {
    if (!activeBody || activeBody.pointerId !== event.pointerId) {
      return;
    }

    activeBody.dragging = false;
    activeBody.el.classList.remove('is-dragging');
    if (
      typeof activeBody.el.releasePointerCapture === 'function' &&
      typeof activeBody.el.hasPointerCapture === 'function' &&
      activeBody.el.hasPointerCapture(activeBody.pointerId)
    ) {
      activeBody.el.releasePointerCapture(activeBody.pointerId);
    }
    activeBody.pointerId = null;
    activeBody = null;
  };

  bodies.forEach((body) => {
    body.el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      activeBody = body;
      body.dragging = true;
      body.pointerId = event.pointerId;
      body.offsetX = event.clientX - body.x;
      body.offsetY = event.clientY - body.y;
      body.lastDragTime = performance.now();
      body.lastDragX = event.clientX;
      body.lastDragY = event.clientY;
      body.el.classList.add('is-dragging');
      body.el.setPointerCapture(event.pointerId);
    });
  });

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', () => {
    boundsWidth = window.innerWidth;
    boundsHeight = window.innerHeight;
    document.body.style.height = `${boundsHeight}px`;
    bodies.forEach((body) => clampToBounds(body));
  });

  requestAnimationFrame(tick);
};

const init = () => {
  renderDetailPage();
  setupLightbox();
  setupAudioToggle();
  setupThumbnailTones();
  setupZeroGravityPlayground();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
