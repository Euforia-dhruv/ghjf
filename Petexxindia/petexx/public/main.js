const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 36);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const form = document.querySelector('#inquiry-form');
const note = document.querySelector('#form-note');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `New buyer brief from ${data.get('name')}`;
  const body = `Name: ${data.get('name')}\nWork email: ${data.get('email')}\n\nBrief:\n${data.get('brief')}`;
  window.location.href = `mailto:amit@petexxindia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (note) note.textContent = 'Opening your email client — the brief is ready to send.';
});

const hero = document.querySelector('.hero-media');
window.addEventListener('scroll', () => {
  if (hero && window.scrollY < window.innerHeight) hero.style.transform = `scale(1.02) translateY(${window.scrollY * 0.08}px)`;
}, { passive: true });

if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelector('.hero-video')?.pause();
