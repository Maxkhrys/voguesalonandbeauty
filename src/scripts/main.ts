import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fixed nav: transparent over the hero, solid ivory once scrolled.
const nav = document.getElementById('site-nav');
const updateNav = () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
};
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

if (!prefersReducedMotion) {
  // Lenis smooth scroll driven by the GSAP ticker.
  const lenis = new Lenis({ lerp: 0.08 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Hero headline: word-by-word stagger fade-up on load.
  if (document.querySelector('.hero-word')) {
    gsap.to('.hero-word', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.25,
    });
  }

  // Sections: fade-up on scroll.
  document.querySelectorAll<HTMLElement>('.fade-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Card groups: staggered fade-up on scroll.
  document.querySelectorAll<HTMLElement>('.stagger-cards').forEach((group) => {
    gsap.to(group.children, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: group, start: 'top 82%' },
    });
  });

  // Botanical SVGs: slow sway loop.
  document.querySelectorAll<HTMLElement>('.botanical-sway').forEach((el, i) => {
    gsap.to(el, {
      rotation: i % 2 === 0 ? 4 : -4,
      y: 10,
      transformOrigin: '50% 100%',
      duration: 5.5 + i * 1.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });
}
