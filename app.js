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
