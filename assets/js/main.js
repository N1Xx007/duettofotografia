/* Duetto — menu, animações de entrada, carrossel de fotos, foto ampliada e botões de agendamento. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  /* Animações de entrada: itens dentro de [data-stagger] entram um após o outro */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--delay', `${i * 0.09}s`);
    });
  });
  const hero = document.querySelector('.hero');
  hero.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.setProperty('--delay', `${0.1 + i * 0.1}s`);
  });

  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  }

  /* Carrossel contínuo com arraste.
     As fotos são duplicadas para a volta ficar sem emenda. O deslocamento é controlado aqui:
     anda sozinho, pausa com o mouse em cima, pode ser arrastado (com embalo ao soltar)
     e continua andando de onde a pessoa deixou. */
  document.querySelectorAll('.marquee').forEach((marquee) => {
    const track = marquee.querySelector('.marquee__track');
    [...track.children].forEach((li) => {
      const copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelector('button').tabIndex = -1;
      track.appendChild(copy);
    });

    const reverse = marquee.classList.contains('marquee--reverse');
    const dir = reverse ? 1 : -1;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    let period = 1;           // largura de uma volta completa (metade do trilho)
    let speed = 0;            // px por segundo
    let x = 0;
    let hovered = false;
    let dragging = false;
    let moved = 0;
    let startX = 0;
    let startOffset = 0;
    let velocity = 0;         // embalo depois de soltar (px por quadro)
    let lastMoveX = 0;
    let lastMoveT = 0;
    let pointerId = null;

    const measure = () => {
      period = (track.scrollWidth + gap) / 2 || 1;
      speed = period / (reverse ? 80 : 70);
    };
    const wrap = (v) => ((v % period) - period) % period;   // mantém x entre -period e 0
    const render = () => { track.style.transform = `translate3d(${x}px,0,0)`; };

    measure();
    if (reverse) x = -period / 2;
    render();
    window.addEventListener('resize', measure);
    track.querySelectorAll('img').forEach((img) => img.addEventListener('load', measure, { once: true }));

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!dragging) {
        if (Math.abs(velocity) > 0.1) {
          x += velocity;
          velocity *= 0.94;
        } else if (!hovered && !reduceMotion) {
          x += dir * speed * dt;
        }
        x = wrap(x);
        render();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    marquee.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hovered = true; });
    marquee.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hovered = false; });
    marquee.addEventListener('focusin', () => { hovered = true; });
    marquee.addEventListener('focusout', () => { hovered = false; });

    marquee.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      moved = 0;
      velocity = 0;
      startX = lastMoveX = e.clientX;
      startOffset = x;
      lastMoveT = performance.now();
      pointerId = e.pointerId;
    });
    marquee.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && !marquee.classList.contains('is-dragging')) {
        marquee.classList.add('is-dragging');
        marquee.setPointerCapture(e.pointerId);
      }
      const now = performance.now();
      const frames = Math.max((now - lastMoveT) / 16.7, 1);
      velocity = (e.clientX - lastMoveX) / frames;
      lastMoveX = e.clientX;
      lastMoveT = now;
      x = wrap(startOffset + dx);
      render();
    });
    const endDrag = (e) => {
      if (!dragging || (e && e.pointerId !== pointerId)) return;
      dragging = false;
      marquee.classList.remove('is-dragging');
      if (performance.now() - lastMoveT > 80) velocity = 0;   // soltou parado: sem embalo
      if (moved <= 6) velocity = 0;
    };
    marquee.addEventListener('pointerup', endDrag);
    marquee.addEventListener('pointercancel', endDrag);
    /* Se a pessoa arrastou, o soltar não conta como clique na foto */
    marquee.addEventListener('click', (e) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });

  /* Foto ampliada (somente as fotos originais, sem as cópias do carrossel) */
  const box = document.querySelector('.lightbox');
  const boxImg = box.querySelector('img');
  const shots = [...document.querySelectorAll('.shot')];
  const originals = shots.filter((b) => !b.closest('[aria-hidden="true"]'));
  let current = 0;
  const show = (i) => {
    current = (i + originals.length) % originals.length;
    const img = originals[current].querySelector('img');
    boxImg.src = img.currentSrc || img.src;
    boxImg.alt = img.alt;
  };
  shots.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.querySelector('img').getAttribute('src');
      show(originals.findIndex((b) => b.querySelector('img').getAttribute('src') === src));
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

  /* Botão de WhatsApp: aparece depois da abertura e some no contato */
  const bar = document.querySelector('.sticky-cta');
  const float = document.querySelector('.wa-float');
  const heroActions = document.getElementById('hero-actions');
  const contact = document.getElementById('contato');
  if ('IntersectionObserver' in window) {
    const state = { pastHero: false, inContact: false };
    const update = () => {
      const on = state.pastHero && !state.inContact;
      bar.classList.toggle('is-visible', on);
      bar.setAttribute('aria-hidden', String(!on));
      bar.querySelector('a').tabIndex = on ? 0 : -1;
      float.classList.toggle('is-visible', on);
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
