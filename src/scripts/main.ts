/**
 * Comportamentos globais: carregamento de imagens, tons de cena, indicador de cena,
 * revelações e toda a coreografia original de scroll, carregada sob demanda.
 */
import { initImages } from './images';
import { initTones } from './tones';
import { initSceneIndicator } from './scenes';
import { initReveals } from './reveals';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasScrollScenes = !!document.querySelector('[data-stage], [data-mask], [data-depth], [data-hscroll], [data-aperture], [data-aperture-close], [data-exp], [data-hero-line]');

initImages();
initTones();
initSceneIndicator();

let stopReveals = initReveals();
let stopMotion: (() => void) | undefined;
let motionVersion = 0;
const syncMotion = () => {
  const version = ++motionVersion;
  stopMotion?.();
  stopMotion = undefined;
  if (motionQuery.matches || !hasScrollScenes) return;
  import('./motion').then((module) => {
    if (version !== motionVersion || motionQuery.matches) return;
    stopMotion = module.initMotion();
  }).catch((error) => console.error('Não foi possível iniciar as animações de scroll.', error));
};
syncMotion();
motionQuery.addEventListener('change', () => {
  stopReveals();
  document.documentElement.classList.toggle('motion', !motionQuery.matches);
  stopReveals = initReveals();
  syncMotion();
});
