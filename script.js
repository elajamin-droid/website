const detailData = {
  paintings: {
    title: 'Paintings',
    gallery: [
      { src: 'images/Paintings/IMG20240121130029.webp', alt: 'Warm toned painting of a figure in a room' },
      { src: 'images/Paintings/IMG20240121130143.webp', alt: 'Painting with dynamic lighting and architectural forms' },
      { src: 'images/Paintings/IMG20240121132133.webp', alt: 'Landscape painting with vibrant colors' },
      { src: 'images/Paintings/IMG20240121130152.webp', alt: 'Portrait painting study' },
      { src: 'images/Paintings/IMG20240121130258.webp', alt: 'Painting of a figure amid abstract shapes' },
      { src: 'images/Paintings/img20250925_16180935.webp', alt: 'Moody painting with deep reds and blues' },
      { src: 'images/Paintings/img20250925_16201163.webp', alt: 'Painting experimenting with perspective' },
      { src: 'images/Paintings/IMG20240121133044.webp', alt: 'Painting with cool light and architectural details' },
    ],
  },
  characters: {
    title: 'Characters',
    description:
      '<p>Character design by Joep Eilander — <a href="https://www.artstation.com/joepeilander" target="_blank" rel="noopener noreferrer">https://www.artstation.com/joepeilander</a></p>',
    gallery: [
      { src: 'images/Characters/Screenshot_2025-10-21_202456.webp', alt: 'Character lineup concept' },
      { src: 'images/Characters/Screenshot_2025-10-21_202831.webp', alt: 'Character portrait explorations' },
    ],
  },
  animations: {
    title: 'Animations',
    video: {
      src: 'https://www.youtube.com/embed/BMqpDYKC6Ms',
      title: 'Moois Genoeg',
    },
    gallery: [{ src: 'images/Games/media4.gif', alt: 'Looping hand-drawn animation sequence' }],
  },
  games: {
    title: 'Games',
    gallery: [
      { src: 'images/Games/Materials2.webp', alt: 'Stylized environment concept' },
      { src: 'images/Games/Unnamed.webp', alt: 'Interface concept for a game' },
      { src: 'images/Games/efwgeqq-1.webp', alt: 'Game concept art with characters' },
      { src: 'images/Games/fefefeefe-0.webp', alt: 'Environment layout sketch' },
      { src: 'images/Games/fefefeefefffeefwef-0.webp', alt: 'Game storyboard panel' },
      { src: 'images/Games/media4.gif', alt: 'Animated gameplay loop' },
    ],
  },
  'other-works': {
    title: 'Other Works',
    gallery: [{ src: 'images/Other%20Works/Uhs.webp', alt: 'Mixed media artwork' }],
  },
  about: {
    title: 'About me',
    description:
      '<p>I am a multidisciplinary artist who moves between painting, animation, and interactive work. Observing the world through light and color guides nearly every project I take on.</p><p>Whether it is developing story moments for games or painting atmospheric studies, my focus is on creating images that feel alive and encourage viewers to keep looking. Let&rsquo;s connect if you&rsquo;re interested in collaborating or have a project in mind.</p>',
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

  let currentIndex = 0;
  let isOpen = false;
  let zoomLevel = 1;
  const minZoom = 1;
  const maxZoom = 3;

  const applyZoom = () => {
    image.style.transform = `scale(${zoomLevel})`;
    image.classList.toggle('is-zoomed', zoomLevel > 1);
  };

  const resetZoom = () => {
    zoomLevel = 1;
    applyZoom();
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
    const step = 0.15 * direction;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel + step));
    if (newZoom !== zoomLevel) {
      zoomLevel = Number(newZoom.toFixed(2));
      applyZoom();
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
  lightboxInner.addEventListener('wheel', handleWheelZoom, { passive: false });
  image.addEventListener('dblclick', resetZoom);

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

const init = () => {
  renderDetailPage();
  setupLightbox();
};

document.addEventListener('DOMContentLoaded', init);
