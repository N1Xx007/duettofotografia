/** Surge suave ao carregar; mensagem discreta se a imagem falhar. */
export function initImages(root: ParentNode = document) {
  root.querySelectorAll<HTMLImageElement>('.ph__img').forEach((img) => {
    const done = () => img.classList.add('is-loaded');
    const fail = () => img.closest('.ph')?.classList.add('is-error');
    if (img.complete) {
      if (img.naturalWidth) done();
      else if (img.currentSrc) fail();
    }
    img.addEventListener('load', done);
    img.addEventListener('error', fail);
  });
}
