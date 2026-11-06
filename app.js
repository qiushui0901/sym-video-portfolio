const films = Array.from(document.querySelectorAll('video'));
for (const film of films) {
  film.addEventListener('play', () => {
    for (const other of films) if (other !== film) other.pause();
    film.parentElement.classList.add('is-playing');
  });
  for (const event of ['pause', 'ended']) {
    film.addEventListener(event, () => film.parentElement.classList.remove('is-playing'));
  }
  const showError = () => {
    const message = document.getElementById(`${film.id}-error`);
    if (message) message.hidden = false;
  };
  film.addEventListener('error', showError);
  film.querySelector('source')?.addEventListener('error', showError);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) for (const film of films) film.pause();
});

for (const control of document.querySelectorAll('select[data-video]')) {
  const film = document.getElementById(control.dataset.video);
  const errorMessage = document.getElementById(`${film.id}-error`);
  let pendingSwitch;
  let switchIntent;
  let qualityGeneration = 0;
  control.addEventListener('change', () => {
    // Preserve the original intent if the visitor switches again while a source loads.
    const intent = switchIntent || {
      position: film.currentTime || 0,
      playing: !film.paused && !film.ended,
    };
    switchIntent = intent;
    const generation = ++qualityGeneration;
    film.pause();
    if (pendingSwitch) film.removeEventListener('loadedmetadata', pendingSwitch);
    if (errorMessage) {
      errorMessage.hidden = true;
      const media = new URL(control.value, location.href);
      errorMessage.querySelector('a').href = 'viewer.html?asset=' + encodeURIComponent('assets/' + media.pathname.split('/').pop() + media.search);
    }
    pendingSwitch = () => {
      if (generation !== qualityGeneration) return;
      if (Number.isFinite(film.duration)) {
        film.currentTime = Math.min(intent.position, Math.max(0, film.duration - 0.05));
      }
      switchIntent = null;
      if (intent.playing) film.play().catch(() => {});
    };
    film.addEventListener('loadedmetadata', pendingSwitch, { once: true });
    film.src = control.value;
    film.load();
  });
  film.addEventListener('error', () => { switchIntent = null; });
}

const viewer = document.getElementById('image-viewer');
const galleryLinks = Array.from(document.querySelectorAll('[data-gallery]'));
if (viewer && galleryLinks.length && typeof viewer.showModal === 'function') {
  const viewerImage = document.getElementById('viewer-image');
  const viewerTitle = document.getElementById('viewer-title');
  const viewerCount = document.getElementById('viewer-count');
  const viewerOriginal = document.getElementById('viewer-original');
  const viewerStatus = document.getElementById('viewer-status');
  const viewerStage = document.getElementById('viewer-stage');
  const zoomButton = document.getElementById('viewer-zoom');
  let currentImage = 0;
  let returnFocus;

  const resetZoom = () => {
    viewerStage.classList.remove('is-zoomed');
    zoomButton.setAttribute('aria-pressed', 'false');
    zoomButton.textContent = '放大细节';
    viewerStage.scrollTop = 0;
    viewerStage.scrollLeft = 0;
  };

  const showImage = (index) => {
    currentImage = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[currentImage];
    resetZoom();
    viewerTitle.textContent = link.dataset.title;
    viewerCount.textContent = `${currentImage + 1} / ${galleryLinks.length}`;
    viewerStatus.hidden = true;
    viewerImage.alt = link.dataset.title;
    viewerImage.src = link.dataset.image || link.href;
    viewerOriginal.href = link.href;
  };

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = link;
      showImage(index);
      viewer.showModal();
      document.body.classList.add('viewer-open');
    });
  });

  viewerImage.addEventListener('error', () => {
    viewerStatus.hidden = false;
  });
  document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
  document.getElementById('viewer-prev').addEventListener('click', () => showImage(currentImage - 1));
  document.getElementById('viewer-next').addEventListener('click', () => showImage(currentImage + 1));
  zoomButton.addEventListener('click', () => {
    const zoomed = viewerStage.classList.toggle('is-zoomed');
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.textContent = zoomed ? '适应窗口' : '放大细节';
    viewerStage.scrollTop = 0;
    viewerStage.scrollLeft = 0;
  });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(currentImage + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    viewerImage.removeAttribute('src');
    resetZoom();
    returnFocus?.focus();
  });
}
