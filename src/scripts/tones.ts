/**
 * Transição de luz entre cenas: o fundo da página muda de tom (café, preto,
 * off-white) quando uma nova cena cruza o centro da tela.
 */
export function initTones() {
  const sections = [...document.querySelectorAll<HTMLElement>('main [data-tone]')];
  if (!sections.length) return;

  const body = document.body;
  body.dataset.sceneTone = sections[0].dataset.tone;
  document.documentElement.classList.add('js-tones');

  let io: IntersectionObserver;
  const observe = () => {
    io?.disconnect();
    const active = new Set<HTMLElement>();
    const margin = Math.max(0, Math.floor(window.innerHeight / 2) - 1);
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? active.add(e.target as HTMLElement) : active.delete(e.target as HTMLElement)));
      const current = sections.filter((s) => active.has(s)).pop();
      if (current) body.dataset.sceneTone = current.dataset.tone;
    }, { rootMargin: `-${margin}px 0px -${margin}px 0px` });
    sections.forEach((s) => io.observe(s));
  };
  let timer: number;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = window.setTimeout(observe, 150);
  }, { passive: true });
  observe();
}
