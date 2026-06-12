import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

/* ---- Fixed nav: transparent over the hero, solid once scrolled ---- */
const nav = document.getElementById('site-nav');
const updateNav = () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
};
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

/* ---- Mobile menu: fullscreen dark overlay ---- */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const setMenu = (open: boolean) => {
  mobileMenu?.classList.toggle('open', open);
  document.body.classList.toggle('menu-locked', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
};
menuToggle?.addEventListener('click', () => {
  setMenu(!mobileMenu?.classList.contains('open'));
});
mobileMenu?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => setMenu(false));
});

/* ---- FAQ accordion ---- */
document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
  const button = item.querySelector('button');
  button?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ---- Motion ---- */
if (prefersReducedMotion) {
  document.documentElement.classList.add('no-motion');
} else {
  // Lenis smooth scroll driven by the GSAP ticker.
  const lenis = new Lenis({ lerp: 0.08 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Hero: rings + logo drift in, headline staggers word by word.
  gsap.to('.hero-fade', {
    opacity: 1,
    duration: 1.6,
    ease: 'power2.out',
    stagger: 0.2,
  });
  gsap.to('.hero-word', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.09,
    delay: 0.35,
  });

  // Sections: fade-up on scroll.
  document.querySelectorAll<HTMLElement>('.fade-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });

  // Card groups: staggered fade-up on scroll.
  document.querySelectorAll<HTMLElement>('.stagger-cards').forEach((group) => {
    gsap.to(group.children, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: { trigger: group, start: 'top 84%' },
    });
  });

  // Imagery: gentle parallax drift while scrolling through.
  document.querySelectorAll<HTMLElement>('.parallax-img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  // Concentric rings: a slow breathing scale on top of the CSS rotation.
  document.querySelectorAll<HTMLElement>('.rings-breathe').forEach((el) => {
    gsap.to(el, {
      scale: 1.05,
      transformOrigin: '50% 50%',
      duration: 7,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });
}
