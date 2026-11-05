/** Entrada suave de textos e imagens secundárias — uma vez, ao entrar na tela. */
export function initReveals(root: ParentNode = document) {
  const els = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (!document.documentElement.classList.contains('motion')) {
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px 64px 0px' },
  );
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add('reveal-ready');
    io.observe(el);
  });

  const onFocus = (event: Event) => {
    const el = (event.target as HTMLElement).closest('[data-reveal]');
    if (el) { el.classList.add('is-in'); io.unobserve(el); }
  };
  root.addEventListener('focusin', onFocus);

  return () => {
    io.disconnect();
    root.removeEventListener('focusin', onFocus);
    els.forEach((el) => el.classList.remove('reveal-ready'));
  };
}
