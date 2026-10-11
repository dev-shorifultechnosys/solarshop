const qs = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

const header = qs('.site-header');
const menuToggle = qs('.menu-toggle');
const mobileMenu = qs('#mobile-menu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
}, { passive: true });

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
  const bars = qsa('span', menuToggle);
  if (open) {
    bars[0].style.transform = 'translateY(4px) rotate(45deg)';
    bars[1].style.transform = 'translateY(-4px) rotate(-45deg)';
  } else {
    bars.forEach(bar => bar.style.transform = '');
  }
}

menuToggle?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
qsa('a', mobileMenu).forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') setMenu(false);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
qsa('.reveal').forEach(el => revealObserver.observe(el));

qsa('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = item.classList.contains('open');

    qsa('.faq-item').forEach(other => {
      other.classList.remove('open');
      other.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });

    if (!open) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const quickForm = qs('#quick-form');
const quickStatus = qs('#quick-status');
quickForm?.addEventListener('submit', e => {
  e.preventDefault();
  if (!quickForm.checkValidity()) {
    quickStatus.textContent = 'Please enter a postcode to continue.';
    quickStatus.className = 'quick-status error';
    quickForm.reportValidity();
    return;
  }
  quickStatus.textContent = 'Thanks — continue below and we’ll shape the right conversation.';
  quickStatus.className = 'quick-status success';
  qs('#quote')?.scrollIntoView({ behavior: 'smooth' });
});

const quoteForm = qs('#quote-form');
const formStatus = qs('#form-status');
quoteForm?.addEventListener('submit', e => {
  e.preventDefault();
  formStatus.className = 'form-status';
  if (!quoteForm.checkValidity()) {
    formStatus.textContent = 'Please complete the required fields before sending.';
    formStatus.classList.add('error');
    quoteForm.reportValidity();
    return;
  }
  formStatus.textContent = 'Thanks — your enquiry is ready to connect to your email or CRM endpoint.';
  formStatus.classList.add('success');
  quoteForm.reset();
});

qs('#year').textContent = new Date().getFullYear();

const counterEls = qsa('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      const formatted = decimals
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('en-GB');
      el.textContent = `${formatted}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.45 });

counterEls.forEach(el => counterObserver.observe(el));

const processGrid = qs('#process-grid');
if (processGrid) {
  const processObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        processGrid.classList.add('progress-visible');
        processObserver.unobserve(processGrid);
      }
    });
  }, { threshold: 0.3 });
  processObserver.observe(processGrid);
}

const contactWidget = qs('#contact-widget');
const contactToggle = qs('.contact-widget-toggle');
const contactPanel = qs('#contact-widget-panel');
const contactClose = qs('.contact-widget-close');

function setContactWidget(open) {
  if (!contactWidget || !contactToggle || !contactPanel) return;
  contactWidget.classList.toggle('open', open);
  contactToggle.setAttribute('aria-expanded', String(open));
  contactPanel.setAttribute('aria-hidden', String(!open));
}

contactToggle?.addEventListener('click', () => setContactWidget(!contactWidget.classList.contains('open')));
contactClose?.addEventListener('click', () => setContactWidget(false));
qsa('a', contactPanel || document.createElement('div')).forEach(link => link.addEventListener('click', () => setContactWidget(false)));
document.addEventListener('click', e => {
  if (contactWidget && contactWidget.classList.contains('open') && !contactWidget.contains(e.target)) {
    setContactWidget(false);
  }
});

const heroSlides = qsa('.hero-slide');
let currentSlide = 0;
if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 4600);
}

const bars = qsa('.mini-bars span');
if (bars.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const bases = bars.map(bar => Number(bar.dataset.base || 40));
  const animateBars = time => {
    bars.forEach((bar, i) => {
      const wave = Math.sin((time / 650) + (i * 0.55)) * 7;
      const drift = Math.cos((time / 1200) + (i * 0.35)) * 3;
      let value = Math.max(18, Math.min(98, bases[i] + wave + drift));
      bar.style.setProperty('--h', value.toFixed(1));
    });
    requestAnimationFrame(animateBars);
  };
  requestAnimationFrame(animateBars);
}

const sections = ['home', 'solutions', 'why-us', 'process', 'projects', 'faq']
  .map(id => qs(`#${id}`))
  .filter(Boolean);
const navLinks = qsa('.desktop-nav a');
if (sections.length && navLinks.length) {
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', active);
      });
    });
  }, { threshold: 0.55 });
  sections.forEach(section => activeObserver.observe(section));
}
