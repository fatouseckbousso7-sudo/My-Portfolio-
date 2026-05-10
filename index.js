/* =====================================================
   PORTFOLIO — RÉFÉRENTE DIGITALE
   script.js
   ===================================================== */

'use strict';

/* ──────────────────────────────────────────
   1. NAVBAR — scroll & hamburger
────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navOverlay= document.getElementById('navOverlay');
const backToTop = document.getElementById('backToTop');

// Scroll : ajoute .scrolled au navbar
window.addEventListener('scroll', handleScroll, { passive: true });

function handleScroll() {
  const scrollY = window.scrollY;

  // Navbar
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Bouton retour en haut
  backToTop.classList.toggle('show', scrollY > 400);

  // Lien actif dans la nav
  highlightActiveLink();
}

// Hamburger — ouvre/ferme le menu mobile
hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', closeMenu);

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function toggleMenu() {
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
}

function openMenu() {
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

/* ──────────────────────────────────────────
   2. LIEN ACTIF AU SCROLL
────────────────────────────────────────── */
function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollMid = window.scrollY + window.innerHeight / 3;

  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (!link) return;

    if (scrollMid >= top && scrollMid < bottom) {
      navLinks.querySelectorAll('.nav-link').forEach(l => l.removeAttribute('style'));
      link.style.color = 'var(--blue-mid)';
    }
  });
}

/* ──────────────────────────────────────────
   3. BOUTON RETOUR EN HAUT
────────────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────
   4. SCROLL REVEAL
────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Décalage en cascade pour les grilles
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = `${Math.min(idx * 100, 400)}ms`;

    entry.target.classList.add('active');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────
   5. BARRES DE COMPÉTENCES ANIMÉES
────────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const pct = el.getAttribute('data-pct');

    // Légère pause avant animation
    setTimeout(() => {
      el.style.width = pct + '%';
      el.classList.add('animated');
    }, 300);

    skillObserver.unobserve(el);
  });
}, { threshold: 0.4 });

skillFills.forEach(el => skillObserver.observe(el));

/* ──────────────────────────────────────────
   6. EFFET TILT 3D sur les cartes (subtil)
────────────────────────────────────────── */
const tiltCards = document.querySelectorAll('.service-card, .project-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ──────────────────────────────────────────
   7. COMPTEUR ANIMÉ (stats hero)
────────────────────────────────────────── */
function animateCount(el, target, suffix = '') {
  let current = 0;
  const duration = 1800;
  const step = duration / target;
  const timer = setInterval(() => {
    current++;
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

// Déclenche au scroll sur la section hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  let counted = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      const statNums = heroStats.querySelectorAll('.stat-n');
      const values = [5, 50, 100];
      const suffixes = ['+', '+', '+'];
      statNums.forEach((el, i) => animateCount(el, values[i], suffixes[i]));
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

/* ──────────────────────────────────────────
   8. FORMULAIRE DE CONTACT — validation
────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) submitForm();
  });

  // Validation en temps réel au blur
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });
}

function validateForm() {
  const fields = {
    fname    : { minLen: 2,  msg: 'Veuillez entrer votre nom (min. 2 caractères).' },
    femail   : { email: true, msg: 'Veuillez entrer une adresse email valide.' },
    fsubject : { minLen: 3,  msg: 'Veuillez préciser le sujet (min. 3 caractères).' },
    fmessage : { minLen: 10, msg: 'Votre message doit contenir au moins 10 caractères.' },
  };

  let isValid = true;

  Object.entries(fields).forEach(([id, rules]) => {
    const field = document.getElementById(id);
    if (!field) return;
    const val = field.value.trim();
    let error = '';

    if (!val) {
      error = 'Ce champ est requis.';
    } else if (rules.minLen && val.length < rules.minLen) {
      error = rules.msg;
    } else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      error = rules.msg;
    }

    if (error) {
      showError(field, id + 'Error', error);
      isValid = false;
    } else {
      clearError(field, id + 'Error');
    }
  });

  return isValid;
}

function validateField(field) {
  const id = field.id;
  const val = field.value.trim();

  if (!val) {
    showError(field, id + 'Error', 'Ce champ est requis.');
    return;
  }

  if (id === 'femail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    showError(field, id + 'Error', 'Email invalide.');
  } else {
    clearError(field, id + 'Error');
  }
}

function showError(field, errorId, message) {
  field.closest('.input-wrap').querySelector('input, textarea')?.classList.add('error');
  field.classList.add('error');
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = message;
}

function clearError(field, errorId) {
  field.classList.remove('error');
  if (errorId) {
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = '';
  }
}

function submitForm() {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;

  // État de chargement
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Envoi en cours…</span> <i class="fa-solid fa-spinner fa-spin"></i>';

  // Simulation d'envoi (remplace par ton vrai endpoint si besoin)
  setTimeout(() => {
    submitBtn.innerHTML = '<span>Message envoyé !</span> <i class="fa-solid fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
    formSuccess.classList.add('show');

    // Scroll vers le message de succès
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Reset après 4s
    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = originalHTML;
      submitBtn.style.background = '';
      formSuccess.classList.remove('show');
    }, 4000);
  }, 1500);
}

/* ──────────────────────────────────────────
   9. CURSEUR PERSONNALISÉ (desktop)
────────────────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position:fixed; top:0; left:0; width:20px; height:20px;
    border:2px solid rgba(37,99,235,.6); border-radius:50%;
    pointer-events:none; z-index:9999; transition:transform .1s, opacity .2s;
    transform:translate(-50%,-50%); mix-blend-mode:multiply;
  `;
  document.body.appendChild(cursor);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
      cursor.style.borderColor = 'rgba(6,182,212,.8)';
      cursor.style.background = 'rgba(6,182,212,.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.borderColor = 'rgba(37,99,235,.6)';
      cursor.style.background = 'transparent';
    });
  });
}

/* ──────────────────────────────────────────
   10. INIT au chargement
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  handleScroll(); // Applique l'état initial de la navbar
});