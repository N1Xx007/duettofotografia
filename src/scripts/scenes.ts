/** Atualiza o indicador ao cruzar uma cena, sem medir o layout durante a rolagem. */
export function initSceneIndicator() {
  const el = document.querySelector<HTMLElement>('[data-scene-indicator]');
  const scenes = [...document.querySelectorAll<HTMLElement>('main [data-scene]')];
  if (!el || scenes.length < 2) return;

  const num = el.querySelector<HTMLElement>('[data-scene-num]')!;
  const name = el.querySelector<HTMLElement>('[data-scene-name]')!;
  const iris = el.querySelector<HTMLElement>('[data-scene-iris]')!;
  const root = document.documentElement;
  const desktop = window.matchMedia('(min-width: 1100px) and (min-height: 560px)');
  let observer: IntersectionObserver | undefined;
  const active = new Set<Element>();
  const updateScene = () => {
    let index = -1;
    scenes.forEach((scene, i) => {
      if (scene.hasAttribute('data-stage-vision') && root.classList.contains('stage-cine') && root.dataset.stageVision !== '1') return;
      if (active.has(scene)) index = i;
    });
    if (index < 0) return;
    num.textContent = String(index + 1).padStart(2, '0');
    name.textContent = scenes[index].dataset.scene ?? '';
  };
  let maxScroll = 1;
  let ticking = false;
  const progress = () => {
    ticking = false;
    if (!desktop.matches) return;
    el.classList.toggle('is-visible', window.scrollY > 40);
    if (root.classList.contains('motion')) iris.style.transform = `rotate(${window.scrollY / maxScroll * 300}deg)`;
    else iris.style.removeProperty('transform');
  };
  const request = () => {
    if (!desktop.matches || ticking) return;
    ticking = true;
    requestAnimationFrame(progress);
  };
  const measure = () => { maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); request(); };
  new ResizeObserver(measure).observe(document.body);
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('duetto:stage', updateScene);

  const observe = () => {
    observer?.disconnect();
    active.clear();
    if (!desktop.matches) return;
    const margin = Math.round(window.innerHeight * 0.4);
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      updateScene();
    }, { rootMargin: `-${margin}px 0px -${margin}px 0px` });
    scenes.forEach((scene) => observer!.observe(scene));
    measure();
  };

  let timer: number;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = window.setTimeout(observe, 150);
  }, { passive: true });
  observe();
}
