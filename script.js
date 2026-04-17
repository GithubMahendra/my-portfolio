/**
 * MAHI PORTFOLIO — script.js
 * Handles: Loader, Custom Cursor, Navbar, Typing Effect,
 *          Scroll Animations, Skill Bars, Project Filters,
 *          Counter Animation, Form Validation, Dark Mode,
 *          Scroll-to-Top Button
 */

/* ─────────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Minimum 1.8s display so the animation is visible
  setTimeout(() => {
    loader.classList.add('hidden');
    // Kick off the hero reveal sequence after loader hides
    document.querySelectorAll('#home .reveal').forEach(el => el.classList.add('visible'));
    startCounters();
  }, 1900);
});

/* ─────────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────────── */
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mouseX = -100, mouseY = -100;
  let outX = -100, outY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth outline lag
  function animateOutline() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover state on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .service-card, .tech-chip');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─────────────────────────────────────────────────
   3. NAVBAR — scroll style & active link
───────────────────────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const navLinks   = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');

  // Scroll → add .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveSection();
  }, { passive: true });

  // Hamburger
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  function highlightActiveSection() {
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─────────────────────────────────────────────────
   4. DARK / LIGHT MODE TOGGLE
───────────────────────────────────────────────── */
(function initTheme() {
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('themeIcon');
  const root  = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';

  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
  }
})();

/* ─────────────────────────────────────────────────
   5. TYPING EFFECT
───────────────────────────────────────────────── */
(function initTyping() {
  const phrases = [
    'beautiful interfaces.',
    'fast web apps.',
    'pixel-perfect UI.',
    'clean, readable code.',
    'delightful experiences.',
  ];

  const el       = document.getElementById('typedText');
  if (!el) return;

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let typeSpeed  = 80;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    el.textContent = isDeleting
      ? currentPhrase.slice(0, charIdx - 1)
      : currentPhrase.slice(0, charIdx + 1);

    charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

    if (!isDeleting && charIdx === currentPhrase.length) {
      // Full phrase typed — pause then delete
      typeSpeed = 80;
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }

    if (isDeleting && charIdx === 0) {
      // Fully deleted — move to next phrase
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      typeSpeed  = 80;
    } else {
      typeSpeed = isDeleting ? 40 : 80;
    }

    setTimeout(type, typeSpeed);
  }

  // Start after loader
  setTimeout(type, 2200);
})();

/* ─────────────────────────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
───────────────────────────────────────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger skill bars when they enter view
          if (entry.target.classList.contains('skills-bars')) {
            animateSkillBars(entry.target);
          }
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  // Observe all .reveal elements except those in #home (handled after loader)
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.closest('#home')) observer.observe(el);
  });
})();

/* ─────────────────────────────────────────────────
   7. SKILL BAR ANIMATION
───────────────────────────────────────────────── */
function animateSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(fill => {
    const width = fill.getAttribute('data-width');
    // Small delay for stagger effect
    setTimeout(() => {
      fill.style.width = width + '%';
      fill.classList.add('animated');
    }, 150);
  });
}

/* ─────────────────────────────────────────────────
   8. COUNTER ANIMATION (Hero stats)
───────────────────────────────────────────────── */
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const target   = +counter.getAttribute('data-count');
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 16);
  });
}

/* ─────────────────────────────────────────────────
   9. PROJECT FILTER
───────────────────────────────────────────────── */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          // Trigger fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 20);
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ─────────────────────────────────────────────────
   10. CONTACT FORM VALIDATION
───────────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name:    { el: document.getElementById('fname'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('femail'),   err: document.getElementById('emailError') },
    subject: { el: document.getElementById('fsubject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('fmessage'), err: document.getElementById('messageError') },
  };

  // Real-time validation on blur
  Object.values(fields).forEach(({ el, err }) => {
    el.addEventListener('blur', () => validateField(el, err));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el, err);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, err }) => {
      if (!validateField(el, err)) valid = false;
    });

    if (valid) {
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';
      submitBtn.querySelector('i').className = 'ri-loader-4-line ri-spin';

      // Simulate async send (replace with real API call)
      setTimeout(() => {
        submitBtn.style.display = 'none';
        successMsg.classList.add('show');
        form.reset();
        // Reset after 5s
        setTimeout(() => {
          submitBtn.style.display = '';
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Send Message';
          submitBtn.querySelector('i').className = 'ri-send-plane-line';
          successMsg.classList.remove('show');
        }, 5000);
      }, 1500);
    }
  });

  function validateField(el, err) {
    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = 'Please enter a valid email address.';
    } else if (el.tagName === 'TEXTAREA' && value.length < 20) {
      message = 'Message must be at least 20 characters.';
    }

    if (message) {
      el.classList.add('error');
      err.textContent = message;
      return false;
    } else {
      el.classList.remove('error');
      err.textContent = '';
      return true;
    }
  }
})();

/* ─────────────────────────────────────────────────
   11. SCROLL TO TOP BUTTON
───────────────────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────────────
   12. PARALLAX on Hero orbs (subtle)
───────────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.glow-orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', e => {
    const { clientX: x, clientY: y } = e;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 15;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
})();

/* ─────────────────────────────────────────────────
   13. NAVBAR link — close mobile on outside click
───────────────────────────────────────────────── */
document.addEventListener('click', e => {
  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});
