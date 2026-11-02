/**
 * Valentin Vance Portfolio — Core Controller
 * Orchestrates:
 * 1. 3D Geometric Scene (Three.js) & Mouse Interactions
 * 2. Floating Navigation Bar (Appears strictly after scrolling past Hero)
 * 3. Parallax Layers & Fallbacks
 * 4. 3D Tilt & Specular Glare on Glassmorphism Cards
 * 5. Interactive 3D Lab Deck
 * 6. Web Audio Synthesizer Feedback
 * 7. Form Handling & Toast Notifications
 */

import GeometricScene from './three-scene.js';
import AudioSynthesizer from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Subsystems
  const scene = new GeometricScene('webgl-canvas');
  const sound = new AudioSynthesizer();

  // 2. Cursor Glow Follower
  initCursorTracker();

  // 3. Floating Navigation Bar (Appears after scrolling past Hero)
  initFloatingNavBar(sound);

  // 4. Parallax Scroll Fallback (if native CSS scroll-timeline is unsupported)
  initParallaxFallback();

  // 5. Glassmorphism Card 3D Tilt & Dynamic Specular Glare
  initGlassCards(sound);

  // 6. General Micro-interactions & Form
  initInteractions(sound);

  // 7. Live Clock
  initLiveClock();
});

/* ==========================================================================
   2. Custom Cursor Follower
   ========================================================================== */
function initCursorTracker() {
  const cursor = document.getElementById('cursor-tracker');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

/* ==========================================================================
   3. Floating Navigation Bar
   Appears dynamically AFTER scrolling past the hero section!
   ========================================================================== */
function initFloatingNavBar(sound) {
  const floatingHeader = document.getElementById('floating-header');
  const heroSentinel = document.getElementById('hero-sentinel');
  const audioToggle = document.getElementById('audio-toggle');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!floatingHeader) return;

  // Use IntersectionObserver on heroSentinel + scroll position fallback
  if (heroSentinel && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When heroSentinel is above the viewport (boundingClientRect.top < 0),
        // user has scrolled completely past the hero section!
        const scrolledPastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (scrolledPastHero) {
          floatingHeader.classList.add('is-scrolled');
        } else {
          floatingHeader.classList.remove('is-scrolled');
          if (mobileDrawer) mobileDrawer.classList.remove('is-open');
        }
      });
    }, {
      root: null,
      threshold: 0
    });

    observer.observe(heroSentinel);
  } else {
    // Fallback: window scroll listener
    window.addEventListener('scroll', () => {
      const heroHeight = document.getElementById('hero')?.offsetHeight || 700;
      if (window.scrollY > heroHeight - 120) {
        floatingHeader.classList.add('is-scrolled');
      } else {
        floatingHeader.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // Active Section Spy for Floating Nav Links
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });

  // Audio Toggle Button
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      const soundIcon = audioToggle.querySelector('.icon-sound');
      if (soundIcon) {
        if (isEnabled) {
          soundIcon.classList.add('is-active');
          showToast('Audio Feedback Enabled');
        } else {
          soundIcon.classList.remove('is-active');
          showToast('Audio Muted');
        }
      }
    });
  }

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      sound.playClick();
    });

    // Close drawer when any mobile link is clicked
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        sound.playClick();
      });
    });
  }
}

/* ==========================================================================
   4. Parallax Scroll Fallback
   For browsers without native CSS scroll-driven animations
   ========================================================================== */
function initParallaxFallback() {
  const supportsCSSScroll = CSS.supports && CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  if (supportsCSSScroll) {
    // Native CSS Scroll-Driven animations are active
    return;
  }

  const hudLayer = document.querySelector('.layer-hud');
  const cardLayer = document.querySelector('.layer-floating-cards');
  const contentLayer = document.querySelector('.layer-core-content');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        if (scrollY <= vh) {
          if (hudLayer) {
            hudLayer.style.transform = `translateY(${scrollY * 0.15}px)`;
          }
          if (cardLayer) {
            cardLayer.style.transform = `translateY(${scrollY * 0.35}px)`;
          }
          if (contentLayer) {
            contentLayer.style.transform = `translateY(${scrollY * 0.65}px)`;
            contentLayer.style.opacity = `${Math.max(0, 1 - (scrollY / (vh * 0.8)))}`;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   5. Glassmorphism Card 3D Tilt & Specular Glare Follower
   ========================================================================== */
function initGlassCards(sound) {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return; // Skip 3D tilt on touch devices for battery & ergonomics

  const cards = document.querySelectorAll('.glass-card.interactive-tilt');

  cards.forEach(card => {
    let bounds = null;

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      sound.playClick();
    });

    card.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Update CSS variables for specular glare radial gradient
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);

      // Calculate 3D tilt angles (max +/- 10 degrees)
      const percentX = (mouseX / bounds.width) - 0.5;
      const percentY = (mouseY / bounds.height) - 0.5;

      const rotX = -percentY * 12;
      const rotY = percentX * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      bounds = null;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });
}

/* ==========================================================================
   6. Form Handling & Micro-Interactions
   ========================================================================== */
function initInteractions(sound) {
  // Copy Email Button
  const copyBtn = document.getElementById('copy-email-btn');
  const emailEl = document.getElementById('email-address');

  if (copyBtn && emailEl) {
    copyBtn.addEventListener('click', async () => {
      const email = emailEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const copyText = copyBtn.querySelector('.copy-text');
        if (copyText) copyText.textContent = 'Copied!';
        sound.playChime(880, 0.2);
        showToast('Email Copied to Clipboard!');
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy';
        }, 2500);
      } catch {
        showToast('Direct email: valentin@vance-spatial.dev');
      }
    });
  }

  // Contact Form Submission
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        sound.playClick();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        const text = submitBtn.querySelector('.btn-text');
        if (text) text.textContent = 'Encrypting & Transmitting...';
      }

      sound.playChime(640, 0.3);

      setTimeout(() => {
        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.textContent = '✓ Transmission verified. Valentin Vance will respond within 24 hours.';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          const text = submitBtn.querySelector('.btn-text');
          if (text) text.textContent = 'Signal Sent!';
        }
        sound.playChime(960, 0.35);
        showToast('Transmission Received Successfully');
        form.reset();
      }, 1200);
    });
  }

  // Smooth scroll links with auditory feedback
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        sound.playClick();
      }
    });
  });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>◈</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ==========================================================================
   8. Live Time Display (UTC-8 San Francisco)
   ========================================================================== */
function initLiveClock() {
  const timeDisplay = document.getElementById('live-time-display');
  if (!timeDisplay) return;

  function update() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      timeDisplay.textContent = `SAN FRANCISCO // ${timeStr} PST`;
    } catch {
      timeDisplay.textContent = 'SAN FRANCISCO // PST';
    }
  }

  update();
  setInterval(update, 1000);
}

