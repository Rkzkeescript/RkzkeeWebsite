/* ─────────────────────────────────────────
   RKZKEE.COM — MAIN JS
   ───────────────────────────────────────── */

'use strict';

/* ── CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let tx = 0, ty = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  (function animateTrail() {
    trailX += (tx - trailX) * 0.14;
    trailY += (ty - trailY) * 0.14;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform  = 'translate(-50%, -50%) scale(1.6)';
      trail.style.opacity     = '0';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform  = 'translate(-50%, -50%) scale(1)';
      trail.style.opacity     = '1';
    });
  });
})();

/* ── PARTICLES ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.life    = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.hue = Math.random() > 0.5 ? '252, 92, 252' : '34, 211, 238';
    }

    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 1;

      if (this.x < -10 || this.x > W + 10 ||
          this.y < -10 || this.y > H + 10 ||
          this.life > this.maxLife) {
        this.reset();
        this.x = Math.random() * W;
        this.y = Math.random() * H;
      }
    }

    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue}, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 92, 252, ${alpha})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  loop();
})();

/* ── NAVBAR SCROLL ── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let last = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    last = y;
  }, { passive: true });
})();

/* ── HAMBURGER ── */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

/* ── COPY BUTTON ── */
(function initCopy() {
  const btn = document.getElementById('copy-btn');
  const txt = document.getElementById('loadstring-text');
  if (!btn || !txt) return;

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(txt.textContent.trim())
      .then(() => {
        btn.textContent = '✓ Copied!';
        btn.style.color = '#22d3ee';
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
          btn.style.color = '';
        }, 2200);
      })
      .catch(() => {});
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const reveals = document.querySelectorAll('[data-reveal]');
  const cards   = document.querySelectorAll('.feat-card, .game-card, .team-card, .stat-item');

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const idx      = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('in');
      }, idx * 60);
      cardObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObs.observe(el));
  cards.forEach(el   => cardObs.observe(el));
})();

/* ── STAT COUNTER ── */
(function initCounters() {
  const items = document.querySelectorAll('.stat-item[data-count]');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);

      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const label  = el.dataset.label  || '';
      const isDecimal = target % 1 !== 0;
      const duration  = 1800;
      const start     = performance.now();

      el.innerHTML = `
        <span class="stat-num" id="n-${Date.now()}">0${suffix}</span>
        <span class="stat-label-text">${label}</span>
      `;

      const numEl = el.querySelector('.stat-num');

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 4);
        const value    = target * ease;
        numEl.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  items.forEach(el => {
    el.innerHTML = `
      <span class="stat-num">—</span>
      <span class="stat-label-text">${el.dataset.label || ''}</span>
    `;
    obs.observe(el);
  });
})();

/* ── TILT EFFECT ── */
(function initTilt() {
  const tiles = document.querySelectorAll('[data-tilt]');

  tiles.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const maxRot = 6;

      el.style.transform = `perspective(1000px) rotateX(${-dy * maxRot}deg) rotateY(${dx * maxRot}deg) scale(1.015)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
})();

/* ── HERO TITLE SPLIT ANIMATION ── */
(function initHeroTitle() {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach((line, i) => {
    const inner = document.createElement('span');
    inner.textContent = line.textContent;
    line.textContent  = '';
    line.appendChild(inner);
    inner.style.animationDelay = (i * 0.12) + 's';
  });
})();

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
