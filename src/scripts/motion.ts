/** Coreografia original de scroll, com imagens responsivas e trabalho limitado às cenas ativas. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
const DESKTOP = '(min-width: 900px) and (min-height: 560px)';
const MOBILE_CINEMA = '(max-width: 899px) and (orientation: portrait) and (min-height: 520px)';
const COMPACT = '(max-width: 899px) and (orientation: landscape), (max-width: 899px) and (max-height: 519px), (min-width: 900px) and (max-height: 559px)';
const root = document.documentElement;
type Cleanup = (() => void) | undefined;
const layerTargets = new Set<HTMLElement>();
function releaseLayers() {
  layerTargets.forEach((el) => el.style.removeProperty('will-change'));
  layerTargets.clear();
}

/** Promove apenas as camadas em uso, liberando memória ao sair da cena. */
function layers(...items: [HTMLElement | null, string][]) {
  items.forEach(([el]) => { if (el) layerTargets.add(el); });
  return ({ isActive }: { isActive: boolean }) => {
    items.forEach(([el, property]) => {
      if (el) el.style.willChange = isActive ? property : '';
    });
  };
}

export function initMotion() {
  root.classList.add('scroll-animations');
  const mm = gsap.matchMedia();
  let disposed = false;
  const entrance = gsap.context(() => heroEntrance());
  mm.add(DESKTOP, () => {
    const cleanups: Cleanup[] = [stage()];
    masks(1);
    depth();
    cleanups.push(hscroll(), aperture());
    closing();
    cleanups.push(experience());
    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
      releaseLayers();
      root.classList.remove('stage-cine');
      delete root.dataset.stageVision;
      window.dispatchEvent(new Event('duetto:stage'));
    };
  });
  mm.add(MOBILE_CINEMA, () => {
    root.classList.add('mobile-cine');
    const cleanups: Cleanup[] = [stage()];
    masks(0.8);
    photoReveals(', .vision, [data-mask]');
    depth(0.65, true);
    cleanups.push(hscroll(), aperture());
    closing();
    cleanups.push(experience());
    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
      releaseLayers();
      root.classList.remove('mobile-cine', 'stage-cine');
      delete root.dataset.stageVision;
      window.dispatchEvent(new Event('duetto:stage'));
    };
  });
  mm.add(COMPACT, () => {
    heroDrift();
    photoReveals();
    depth(0.5, true);
    const cleanups = [hscroll()];
    apertureInline();
    cleanups.push(experience() ?? (() => {}));
    closing();
    return () => { cleanups.forEach((cleanup) => cleanup()); releaseLayers(); };
  });

  // As fotos já reservam seu espaço. Atualizar a geometria a cada imagem
  // lazy carregada era desnecessário e interrompia as animações em andamento.
  let refreshFrame = 0;
  const refresh = () => {
    if (disposed || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; if (!disposed) ScrollTrigger.refresh(); });
  };
  // Filtrar o acervo altera a altura real da página: nesse caso, recalcular
  // é necessário para manter as animações das próximas cenas alinhadas.
  let archiveHeight: number | undefined;
  const archive = document.querySelector('.arc__list');
  const layoutObserver = new ResizeObserver(([entry]) => {
    const height = entry.contentRect.height;
    if (archiveHeight !== undefined && Math.abs(height - archiveHeight) > 1) refresh();
    archiveHeight = height;
  });
  if (archive) layoutObserver.observe(archive);
  if (document.fonts.status !== 'loaded') {
    document.fonts.ready.then(refresh);
  }
  return () => {
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    layoutObserver.disconnect();
    mm.revert();
    entrance.revert();
    root.classList.remove('scroll-animations', 'mobile-cine');
    releaseLayers();
  };
}

function heroEntrance() {
  const lines = document.querySelectorAll('[data-hero-line]');
  if (lines.length) gsap.from(lines, { y: 34, opacity: 0, duration: 1.3, stagger: 0.09, ease: 'expo.out', clearProps: 'transform,opacity' });
}

/** A foto da abertura se transforma no primeiro olhar do díptico. */
function stage(): Cleanup {
  const section = document.querySelector<HTMLElement>('[data-stage]');
  if (!section) return;
  root.classList.add('stage-cine');
  const pin = section.querySelector<HTMLElement>('[data-stage-pin]')!;
  const frameA = section.querySelector<HTMLElement>('[data-stage-a]')!;
  const imgA = section.querySelector<HTMLElement>('[data-stage-a-img]')!;
  const scrim = section.querySelector<HTMLElement>('[data-stage-scrim]')!;
  const hero = section.querySelector<HTMLElement>('[data-stage-hero]')!;
  const foot = section.querySelector<HTMLElement>('[data-stage-foot]')!;
  const vision = section.querySelector<HTMLElement>('[data-stage-vision]')!;
  const copy = section.querySelector<HTMLElement>('[data-vision-copy]')!;
  const frameB = section.querySelector<HTMLElement>('[data-vision-b] .ph__frame')!;
  const imgB = section.querySelector<HTMLElement>('[data-vision-b] .ph__img')!;
  const caps = section.querySelectorAll<HTMLElement>('.vision__cap');
  const slot = section.querySelector<HTMLElement>('[data-vision-slot]')!;
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  const ratio = parseFloat(getComputedStyle(imgA).getPropertyValue(mobile ? '--hero-mobile-ratio' : '--hero-ratio')) || 1.5;
  const fx = mobile ? 0.42 : 0.62, fy = mobile ? 0.28 : 0.4;
  const geo = () => {
    const W = pin.clientWidth, H = pin.clientHeight;
    const p = pin.getBoundingClientRect(), s = slot.getBoundingClientRect();
    const r = { left: s.left - p.left, top: s.top - p.top, width: s.width, height: s.height };
    const cover = (cw: number, ch: number) => {
      const w = Math.max(cw, ch * ratio), h = w / ratio;
      return { w, ox: (cw - w) * fx, oy: (ch - h) * fy };
    };
    const V = cover(W, H), S = cover(r.width, r.height), scale = S.w / V.w;
    return {
      clip: `inset(${r.top}px ${W - r.left - r.width}px ${H - r.top - r.height}px ${r.left}px)`,
      x: r.left + S.ox - scale * V.ox, y: r.top + S.oy - scale * V.oy, scale,
    };
  };
  let g = geo();
  gsap.set(imgA, { transformOrigin: '0 0' });
  gsap.set(frameA, { clipPath: 'inset(0px 0px 0px 0px)' });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: () => `+=${innerHeight * (mobile ? 1.2 : 1.5)}`,
      pin, scrub: mobile ? 0.65 : 0.9, anticipatePin: 1, invalidateOnRefresh: true,
      onRefreshInit: () => {
        gsap.set(frameA, { clipPath: 'inset(0px 0px 0px 0px)' });
        gsap.set(imgA, { x: 0, y: 0, scale: 1 });
        g = geo();
      },
      onToggle: layers([frameA, 'clip-path'], [imgA, 'transform']),
      onUpdate: (self) => {
        const v = self.progress > 0.5 ? '1' : '0';
        if (root.dataset.stageVision !== v) {
          root.dataset.stageVision = v;
          window.dispatchEvent(new Event('duetto:stage'));
        }
      },
    },
  });
  tl.to([hero, foot], { y: -60, autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 0)
    .to(scrim, { opacity: 0, duration: 0.3 }, 0.05)
    .to(frameA, { clipPath: () => g.clip, duration: 0.5, ease: 'power2.inOut' }, 0.1)
    .to(imgA, { x: () => g.x, y: () => g.y, scale: () => g.scale, duration: 0.5, ease: 'power2.inOut' }, 0.1)
    .fromTo(frameB, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.38, ease: 'power2.out' }, 0.42)
    .fromTo(imgB, { scale: 1.3 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0.42)
    .fromTo(copy.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 0.5)
    .fromTo(caps, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.78)
    .to({}, { duration: 0.12 });
  gsap.set(vision, { autoAlpha: 1 });
  const focus = () => {
    const st = tl.scrollTrigger!;
    if (st.progress < 0.8) window.scrollTo({ top: st.start + (st.end - st.start) * 0.9, behavior: 'instant' });
  };
  copy.addEventListener('focusin', focus);
  const cue = section.querySelector<HTMLAnchorElement>('.stage__cue');
  const goVision = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const st = tl.scrollTrigger!;
    history.replaceState(history.state, '', '#visao');
    window.scrollTo({ top: st.start + (st.end - st.start) * 0.92, behavior: 'smooth' });
  };
  cue?.addEventListener('click', goVision);
  return () => { copy.removeEventListener('focusin', focus); cue?.removeEventListener('click', goVision); };
}

/** Máscaras e recuo de câmera das fotografias no desktop. */
function masks(strength: number) {
  document.querySelectorAll<HTMLElement>('[data-mask]').forEach((el) => {
    const img = el.querySelector<HTMLElement>('[data-mask-img]');
    const inset = 16 * strength;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 30%', scrub: 0.6, onToggle: layers([el, 'clip-path'], [img, 'transform']) },
    });
    tl.fromTo(el, { clipPath: `inset(${inset}% ${inset * 0.6}% ${inset}% ${inset * 0.6}%)` }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0);
    if (img) tl.fromTo(img, { scale: 1 + 0.2 * strength }, { scale: 1 }, 0);
  });
}

function depth(amount = 1, alignPairs = false) {
  const grouped = new Set<HTMLElement>();
  if (alignPairs) {
    // Fotos na mesma linha se movem juntas para manter as bordas alinhadas.
    const pairs = ['.ch1__main, .ch1__aside', '.ch3__small, .ch3__tall', '.ch4__b, .ch4__c', '.hum__space-a, .hum__space-b'];
    pairs.forEach((selector) => {
      const photos = [...document.querySelectorAll<HTMLElement>(selector)];
      if (photos.length < 2) return;
      photos.forEach((photo) => grouped.add(photo));
      gsap.fromTo(photos, { yPercent: -6 * amount }, {
        yPercent: 6 * amount, ease: 'none',
        scrollTrigger: {
          trigger: photos[0].parentElement!, start: 'top bottom', end: 'bottom top', scrub: 0.4,
          onToggle: layers(...photos.map((photo): [HTMLElement, string] => [photo, 'transform'])),
        },
      });
    });
  }
  document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
    if (grouped.has(el)) return;
    const d = parseFloat(el.dataset.depth || '0') * amount;
    gsap.fromTo(el, { yPercent: -d * 60 }, {
      yPercent: d * 60, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4, onToggle: layers([el, 'transform']) },
    });
  });
}

/** Travelling horizontal conduzido pela rolagem vertical, também no celular. */
function hscroll() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-hscroll]').forEach((section) => {
    const pin = section.querySelector<HTMLElement>('[data-hscroll-pin]')!;
    const track = section.querySelector<HTMLElement>('[data-hscroll-track]')!;
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => `+=${Math.max(1, distance())}`,
        pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        onToggle: layers([track, 'transform']),
      },
    });
    const focus = (event: FocusEvent) => {
      const st = tween.scrollTrigger!;
      const target = event.target as HTMLElement;
      const p = Math.min(1, target.offsetLeft / Math.max(1, distance()));
      window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: 'instant' });
    };
    track.addEventListener('focusin', focus);
    cleanups.push(() => track.removeEventListener('focusin', focus));
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function aperture() {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-aperture]').forEach((stageEl) => {
    const img = stageEl.querySelector<HTMLElement>('[data-aperture-img]')!;
    const copy = stageEl.querySelector<HTMLElement>('[data-aperture-copy]')!;
    const photo = img.querySelector<HTMLImageElement>('.ph__img')!;
    const originalSizes = photo.sizes;
    const sizePhoto = () => {
      if (window.innerWidth < 900) photo.sizes = `${Math.ceil(Math.max(img.clientWidth, img.clientHeight * photo.width / photo.height))}px`;
    };
    sizePhoto();
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stageEl, start: 'top top', end: '+=80%', pin: true, scrub: 0.8, anticipatePin: 1, onToggle: layers([img, 'clip-path']), onRefresh: sizePhoto },
    });
    tl.fromTo(img, { clipPath: 'circle(16% at 50% 46%)' }, { clipPath: 'circle(76% at 50% 46%)', duration: 0.7, ease: 'power2.inOut' }, 0)
      .fromTo(img.querySelector('.ph__img'), { scale: 1.25 }, { scale: 1, duration: 0.8 }, 0)
      .fromTo(copy.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.25 }, 0.6);
    const focus = () => {
      if (tl.scrollTrigger && tl.progress() < 0.9) window.scrollTo({ top: tl.scrollTrigger.end, behavior: 'instant' });
    };
    copy.addEventListener('focusin', focus);
    cleanups.push(() => { copy.removeEventListener('focusin', focus); photo.sizes = originalSizes; });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function closing() {
  const el = document.querySelector<HTMLElement>('[data-aperture-close]');
  if (!el) return;
  gsap.fromTo(el, { clipPath: 'circle(8% at 50% 50%)' }, {
    clipPath: 'circle(75% at 50% 50%)', ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 95%', end: 'center 50%', scrub: 0.6, onToggle: layers([el, 'clip-path']) },
  });
}

function experience(): Cleanup {
  const wrap = document.querySelector<HTMLElement>('[data-exp]');
  if (!wrap) return;
  const fill = wrap.querySelector<HTMLElement>('[data-exp-fill]')!;
  const steps = [...wrap.querySelectorAll<HTMLElement>('[data-exp-step]')];
  let lastStep = -1;
  const set = (p: number) => {
    fill.style.setProperty('--p', p.toFixed(3));
    const step = Math.floor((p + 0.02) * (steps.length - 1));
    if (step === lastStep) return;
    lastStep = step;
    steps.forEach((el, i) => el.classList.toggle('is-on', i <= step));
  };
  set(0);
  ScrollTrigger.create({ trigger: wrap, start: 'top 70%', end: 'bottom 55%', onUpdate: (self) => set(self.progress), onLeave: () => set(1) });
  return () => { fill.style.removeProperty('--p'); steps.forEach((el) => el.classList.remove('is-on')); };
}

function heroDrift() {
  const section = document.querySelector<HTMLElement>('[data-stage]');
  if (!section) return;
  const frame = section.querySelector<HTMLElement>('[data-stage-a]')!;
  const img = section.querySelector<HTMLElement>('[data-stage-a-img]')!;
  const hero = section.querySelector<HTMLElement>('[data-stage-hero]')!;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: frame, start: 'top top', end: 'bottom top', scrub: 0.4, onToggle: layers([img, 'transform'], [hero, 'transform']) },
  });
  tl.fromTo(img, { scale: 1.06, yPercent: 0 }, { scale: 1.16, yPercent: 14 }, 0)
    .to(hero, { yPercent: -18, opacity: 0 }, 0);
}

function photoReveals(extraSkip = '') {
  const skip = '.stage__a, .ch3__img, .end__img, .arc__pv, .ch2__frame, .arc__thumb' + extraSkip;
  const targets = [...document.querySelectorAll<HTMLElement>('main .ph, main .hum__portrait picture')].filter((photo) => !photo.closest(skip));
  const fold = innerHeight * 0.9;
  targets.forEach((el) => {
    const frame = el.matches('picture') ? el : el.querySelector<HTMLElement>('.ph__frame') ?? el;
    const img = frame.querySelector<HTMLElement>('img');
    if (el.getBoundingClientRect().top < fold) return;
    gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' });
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      gsap.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'expo.out', clearProps: 'clipPath' });
      if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' });
    };
    ScrollTrigger.create({ trigger: el, start: 'top 92%', onEnter: reveal, onEnterBack: reveal, onLeave: reveal });
  });
}

function apertureInline() {
  document.querySelectorAll<HTMLElement>('[data-aperture-img]').forEach((img) => {
    gsap.fromTo(img, { clipPath: 'circle(18% at 50% 50%)' }, {
      clipPath: 'circle(75% at 50% 50%)', ease: 'none',
      scrollTrigger: { trigger: img, start: 'top 95%', end: 'bottom 55%', scrub: 0.5, onToggle: layers([img, 'clip-path']) },
    });
  });
}
