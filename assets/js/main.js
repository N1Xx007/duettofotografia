/* Duetto — interações mínimas: menu, filtro do portfólio, foto ampliada e barra de agendamento. */
(() => {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');

  /* Cabeçalho com linha ao rolar */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu no celular */
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* Filtro do portfólio */
  const chips = document.querySelectorAll('.chip');
  const items = [...document.querySelectorAll('.gallery li')];
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      items.forEach((li) => { li.hidden = f !== 'todos' && li.dataset.cat !== f; });
    });
  });

  /* Foto ampliada */
  const box = document.querySelector('.lightbox');
  const boxImg = box.querySelector('img');
  let current = 0;
  const visible = () => items.filter((li) => !li.hidden);
  const show = (i) => {
    const list = visible();
    current = (i + list.length) % list.length;
    const img = list[current].querySelector('img');
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
  };
  items.forEach((li) => {
    li.querySelector('button').addEventListener('click', () => {
      show(visible().indexOf(li));
      box.showModal();
    });
  });
  box.querySelector('.lightbox__close').addEventListener('click', () => box.close());
  box.querySelector('.lightbox__nav--prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lightbox__nav--next').addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* Barra de agendamento no celular: aparece depois da abertura e some no contato */
  const bar = document.querySelector('.sticky-cta');
  const heroActions = document.getElementById('hero-actions');
  const contact = document.getElementById('contato');
  if (bar && 'IntersectionObserver' in window) {
    const state = { pastHero: false, inContact: false };
    const update = () => {
      const on = state.pastHero && !state.inContact;
      bar.classList.toggle('is-visible', on);
      bar.setAttribute('aria-hidden', String(!on));
      bar.querySelector('a').tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(([e]) => {
      state.pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    }).observe(heroActions);
    new IntersectionObserver(([e]) => {
      state.inContact = e.isIntersecting;
      update();
    }, { rootMargin: '0px 0px -30% 0px' }).observe(contact);
  }

  /* Ano no rodapé */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
