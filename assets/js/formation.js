/**
 * ==========================================================================
 * AUREN CRÉATIF — Scripts & Redirections Chariow
 * ==========================================================================
 */

// ==========================================
// 1. LIENS DE PAIEMENT DIRECTS (CHARIOW)
// ==========================================
const CHECKOUT_LINKS = {
  // Offre Principale : Formation CapCut sur smartphone (7 500 FCFA)
  FORMATION_CAPCUT: "https://tuvdexdr.mychariow.store/prd_c04chs9p",

  // Offre 1 : Pack de polices (+ de 3 600 polices) (2 500 FCFA)
  PACK_POLICES: "https://tuvdexdr.mychariow.store/prd_iw3ffe09",

  // Offre 2 : Templates After Effects & Photoshop (+ de 10 000 templates) (5 000 FCFA)
  TEMPLATES_AE_PS: "https://tuvdexdr.mychariow.store/prd_tgdw7n98",

  // Pack Complet : Bundle 3 en 1 (12 000 FCFA)
  BUNDLE_COMPLET: "https://tuvdexdr.mychariow.store/prd_4jzd6cl0"
};

// Rétrocompatibilité
const CHARIOW_LINKS = CHECKOUT_LINKS;

// ==========================================
// 2. DRAPEAUX OFFICIELS VECTORIELS (AFRIQUE & EUROPE)
// ==========================================
const FLAG_SVGS = {
  TG: `<svg class="flag-svg" viewBox="0 0 500 300" width="18" height="12" aria-label="Drapeau Togo"><rect width="500" height="300" fill="#006A4E"/><rect y="60" width="500" height="60" fill="#FFCE00"/><rect y="180" width="500" height="60" fill="#FFCE00"/><rect width="180" height="180" fill="#D21034"/><polygon points="90,30 108,86 166,86 119,120 137,176 90,142 43,176 61,120 14,86 72,86" fill="#FFFFFF"/></svg>`,
  FR: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau France"><rect width="150" height="300" fill="#002395"/><rect x="150" width="150" height="300" fill="#FFFFFF"/><rect x="300" width="150" height="300" fill="#ED2939"/></svg>`,
  CI: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Côte d'Ivoire"><rect width="150" height="300" fill="#F77F00"/><rect x="150" width="150" height="300" fill="#FFFFFF"/><rect x="300" width="150" height="300" fill="#009E60"/></svg>`,
  BE: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Belgique"><rect width="150" height="300" fill="#2D2926"/><rect x="150" width="150" height="300" fill="#FDDA24"/><rect x="300" width="150" height="300" fill="#EF3340"/></svg>`,
  BJ: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Bénin"><rect width="180" height="300" fill="#008751"/><rect x="180" width="270" height="150" fill="#FCD116"/><rect x="180" y="150" width="270" height="150" fill="#E8112D"/></svg>`,
  CH: `<svg class="flag-svg" viewBox="0 0 300 300" width="13" height="13" aria-label="Drapeau Suisse"><rect width="300" height="300" fill="#D52B1E" rx="3"/><rect x="125" y="50" width="50" height="200" fill="#FFFFFF"/><rect x="50" y="125" width="200" height="50" fill="#FFFFFF"/></svg>`,
  SN: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Sénégal"><rect width="150" height="300" fill="#00853F"/><rect x="150" width="150" height="300" fill="#FDEF42"/><rect x="300" width="150" height="300" fill="#E31B23"/><polygon points="225,100 234,128 263,128 240,145 249,173 225,156 201,173 210,145 187,128 216,128" fill="#00853F"/></svg>`,
  CM: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Cameroun"><rect width="150" height="300" fill="#007A3D"/><rect x="150" width="150" height="300" fill="#CE1126"/><rect x="300" width="150" height="300" fill="#FCD116"/><polygon points="225,100 234,128 263,128 240,145 249,173 225,156 201,173 210,145 187,128 216,128" fill="#FCD116"/></svg>`,
  ML: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Mali"><rect width="150" height="300" fill="#14B53A"/><rect x="150" width="150" height="300" fill="#FCD116"/><rect x="300" width="150" height="300" fill="#CE1126"/></svg>`,
  GA: `<svg class="flag-svg" viewBox="0 0 450 300" width="18" height="12" aria-label="Drapeau Gabon"><rect width="450" height="100" fill="#009E60"/><rect y="100" width="450" height="100" fill="#FCD116"/><rect y="200" width="450" height="100" fill="#3A75C4"/></svg>`
};

// ==========================================
// 3. DONNÉES DU POPUP TÉMOIGNAGES (PAYS AVEC DRAPEAU, DÉLAIS DYNAMIQUES VARIÉS)
// Délais : minutes, 1 heure, 2 heures, 1 journée, jours, 2 semaines, 1 mois
// ==========================================
const TESTIMONIALS_DATA = [
  {
    name: "Koffi Mensah",
    country: "Togo",
    city: "Lomé",
    flagCode: "TG",
    flagEmoji: "🇹🇬",
    initials: "KM",
    bgGrad: "linear-gradient(135deg, #2563EB, #00D2FF)",
    product: "Formation CapCut Mobile",
    quote: "« Vues doublées en 2 jours grâce aux coupes rythmées ! »",
    timeframes: ["il y a 30 min", "il y a 1h", "il y a 2h", "il y a 1 jour"]
  },
  {
    name: "Thibault Mercier",
    country: "France",
    city: "Paris",
    flagCode: "FR",
    flagEmoji: "🇫🇷",
    initials: "TM",
    bgGrad: "linear-gradient(135deg, #102A56, #2563EB)",
    product: "Pack de polices",
    quote: "« Typographies magnifiques pour mes carrousels. »",
    timeframes: ["il y a 1h", "il y a 1 jour", "en 2 sem.", "il y a 3 jours"]
  },
  {
    name: "Amina Diallo",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    flagCode: "CI",
    flagEmoji: "🇨🇮",
    initials: "AD",
    bgGrad: "linear-gradient(135deg, #059669, #10B981)",
    product: "Templates AE & Photoshop",
    quote: "« Je gagne plus d'une heure par projet client. »",
    timeframes: ["il y a 2h", "il y a 30 min", "en 2 sem.", "il y a 1 jour"]
  },
  {
    name: "Sarah Vandamme",
    country: "Belgique",
    city: "Bruxelles",
    flagCode: "BE",
    flagEmoji: "🇧🇪",
    initials: "SV",
    bgGrad: "linear-gradient(135deg, #7C3AED, #A855F7)",
    product: "Formation CapCut Mobile",
    quote: "« Plus besoin d'ordi, je monte mes Reels au smartphone. »",
    timeframes: ["il y a 1 jour", "il y a 1h", "en 2 sem.", "il y a 30 min"]
  },
  {
    name: "Marc Lawson",
    country: "Bénin",
    city: "Cotonou",
    flagCode: "BJ",
    flagEmoji: "🇧🇯",
    initials: "ML",
    bgGrad: "linear-gradient(135deg, #D97706, #F59E0B)",
    product: "Pack Complet (3-en-1)",
    quote: "« Pack rentabilisé dès la 1ère semaine. Très efficace ! »",
    timeframes: ["il y a 3 jours", "en 1 mois", "il y a 2h", "en 2 sem."]
  },
  {
    name: "Lucas Favre",
    country: "Suisse",
    city: "Genève",
    flagCode: "CH",
    flagEmoji: "🇨🇭",
    initials: "LF",
    bgGrad: "linear-gradient(135deg, #DC2626, #EF4444)",
    product: "Templates AE & Photoshop",
    quote: "« Templates After Effects fluides et faciles à adapter. »",
    timeframes: ["en 2 sem.", "il y a 4h", "il y a 1 jour", "en 1 mois"]
  },
  {
    name: "Ibrahima Ndiaye",
    country: "Sénégal",
    city: "Dakar",
    flagCode: "SN",
    flagEmoji: "🇸🇳",
    initials: "IN",
    bgGrad: "linear-gradient(135deg, #0D9488, #14B8A6)",
    product: "Formation CapCut Mobile",
    quote: "« Les sous-titres animés changent absolument tout. »",
    timeframes: ["en 1 mois", "il y a 30 min", "il y a 1 jour", "en 2 sem."]
  },
  {
    name: "Emmanuelle Fotso",
    country: "Cameroun",
    city: "Douala",
    flagCode: "CM",
    flagEmoji: "🇨🇲",
    initials: "EF",
    bgGrad: "linear-gradient(135deg, #2563EB, #4F46E5)",
    product: "Pack Complet (3-en-1)",
    quote: "« Rapport qualité/prix imbattable pour un créateur. »",
    timeframes: ["il y a 1h", "en 2 sem.", "il y a 1 jour", "en 1 mois"]
  },
  {
    name: "Boubacar Traoré",
    country: "Mali",
    city: "Bamako",
    flagCode: "ML",
    flagEmoji: "🇲🇱",
    initials: "BT",
    bgGrad: "linear-gradient(135deg, #059669, #3B82F6)",
    product: "Pack de polices",
    quote: "« Les typographies donnent une vraie identité à mes designs. »",
    timeframes: ["il y a 2h", "il y a 30 min", "en 1 mois", "il y a 1 jour"]
  },
  {
    name: "Clémence Ondo",
    country: "Gabon",
    city: "Libreville",
    flagCode: "GA",
    flagEmoji: "🇬🇦",
    initials: "CO",
    bgGrad: "linear-gradient(135deg, #0284C7, #06B6D4)",
    product: "Formation CapCut Mobile",
    quote: "« En moins d'une semaine mes vidéos ont pris du niveau. »",
    timeframes: ["il y a 1 jour", "en 2 sem.", "il y a 1h", "en 1 mois"]
  }
];

// ==========================================
// 4. INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollProgressBar();
  initMobileNav();
  initFaqAccordion();
  initDirectCheckoutRedirects();
  initLegalModals();
  initSmoothScroll();
  initSocialProofToast();
  initScrollReveal();
});

// ==========================================
// 4. HEADER COLLANT & BARRE DE DÉFILEMENT
// ==========================================
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });
}

// ==========================================
// 5. MENU MOBILE FLUIDE & RESPONSIVE
// ==========================================
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileCta = document.querySelector('.mobile-nav-cta');

  if (!toggleBtn || !mainNav) return;

  const openMenu = () => {
    mainNav.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Fermer le menu');
  };

  const closeMenu = () => {
    mainNav.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Ouvrir le menu');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  if (mobileCta) {
    mobileCta.addEventListener('click', closeMenu);
  }

  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

// ==========================================
// 6. REDIRECTION VERS LES PAGES DE PAIEMENT (SYSTEME.IO / CHARIOW)
// ==========================================
function initDirectCheckoutRedirects() {
  const buttons = document.querySelectorAll('[data-product]');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product');
      let url = CHECKOUT_LINKS.BUNDLE_COMPLET;

      switch (product) {
        case 'capcut':
        case 'formation':
          url = CHECKOUT_LINKS.FORMATION_CAPCUT;
          break;
        case 'fonts':
          url = CHECKOUT_LINKS.PACK_POLICES;
          break;
        case 'templates_ae_ps':
          url = CHECKOUT_LINKS.TEMPLATES_AE_PS;
          break;
        case 'bundle':
          url = CHECKOUT_LINKS.BUNDLE_COMPLET;
          break;
        default:
          url = CHECKOUT_LINKS.BUNDLE_COMPLET;
          break;
      }

      if (url && url !== '#' && !url.includes('systeme.io/ex') && url !== 'https://systeme.io') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Si le lien n'est pas encore configuré, défiler doucement vers le récapitulatif
        const target = document.getElementById('produits') || document.getElementById('bundle');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ==========================================
// 7. TOAST POPUP TÉMOIGNAGES (ROTATION 5s, PAYS AVEC DRAPEAU, DÉLAIS DYNAMIQUES)
// ==========================================
function initSocialProofToast() {
  const toast = document.getElementById('social-proof-toast');
  const closeBtn = document.getElementById('toast-close-btn');
  const avatarEl = document.getElementById('toast-avatar');
  const nameEl = document.getElementById('toast-name');
  const countryNameEl = document.getElementById('toast-country-name');
  const flagBoxEl = document.getElementById('toast-flag-box');
  const cityNameEl = document.getElementById('toast-city-name');
  const timeEl = document.getElementById('toast-time');
  const productEl = document.getElementById('toast-product');
  const quoteEl = document.getElementById('toast-quote');

  if (!toast) return;

  let currentIndex = 0;
  let isClosed = false;
  let isPaused = false;
  let timeoutId = null;
  // Compteur d'affichage par profil pour alterner dynamiquement les délais
  const appearanceCounts = {};

  function updateToastContent(index) {
    const item = TESTIMONIALS_DATA[index];
    if (!item) return;

    appearanceCounts[index] = (appearanceCounts[index] || 0) + 1;
    const timeIndex = (appearanceCounts[index] - 1) % item.timeframes.length;
    const currentTime = item.timeframes[timeIndex];

    if (avatarEl) {
      avatarEl.textContent = item.initials;
      avatarEl.style.background = item.bgGrad;
    }
    if (nameEl) nameEl.textContent = item.name;
    if (countryNameEl) countryNameEl.textContent = item.country;
    if (flagBoxEl) {
      flagBoxEl.innerHTML = FLAG_SVGS[item.flagCode] || item.flagEmoji;
    }
    if (cityNameEl) cityNameEl.textContent = `· ${item.city}`;
    if (timeEl) timeEl.textContent = currentTime;
    if (productEl) productEl.textContent = item.product;
    if (quoteEl) quoteEl.textContent = item.quote;
  }

  function scheduleNext(delayMs) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (isClosed || isPaused) return;

      toast.classList.remove('show');

      // Pause élégante avant le témoignage suivant (non intrusive)
      setTimeout(() => {
        if (!isClosed && !isPaused) {
          currentIndex = (currentIndex + 1) % TESTIMONIALS_DATA.length;
          showToast();
        }
      }, 7500);
    }, delayMs);
  }

  function showToast() {
    if (isClosed) return;

    updateToastContent(currentIndex);
    toast.classList.add('show');
    scheduleNext(4800); // Durée d'affichage idéale : 4.8 secondes
  }

  // Premier affichage 1.5 secondes après l'arrivée sur la page
  setTimeout(showToast, 1500);

  // Pause au survol (souris / tactile) pour une lecture sans précipitation
  toast.addEventListener('mouseenter', () => {
    isPaused = true;
    if (timeoutId) clearTimeout(timeoutId);
  });

  toast.addEventListener('mouseleave', () => {
    if (isClosed) return;
    isPaused = false;
    scheduleNext(2500);
  });

  toast.addEventListener('touchstart', () => {
    isPaused = true;
    if (timeoutId) clearTimeout(timeoutId);
  }, { passive: true });

  toast.addEventListener('touchend', () => {
    if (isClosed) return;
    isPaused = false;
    scheduleNext(2500);
  }, { passive: true });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isClosed = true;
      toast.classList.remove('show');
      if (timeoutId) clearTimeout(timeoutId);
    });
  }
}

// ==========================================
// 8. ACCORDÉON FAQ FLUIDE
// ==========================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

// ==========================================
// 9. MODALES LÉGALES
// ==========================================
function initLegalModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn')) {
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal-overlay.active');
      activeModals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

// ==========================================
// 10. DÉFILEMENT FLUIDE & RETOUR EN HAUT (LOGO / ACCUEIL)
// ==========================================
function initSmoothScroll() {
  // Clic sur le logo / marque pour retour immédiat et fluide en haut de page
  document.querySelectorAll('.logo-wrapper').forEach(logo => {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || this.hasAttribute('data-open-modal')) {
        return;
      }

      if (href === '#header' || href === '#top' || href === '#hero' || this.classList.contains('logo-wrapper')) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight + 10 : 76;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// 11. ANIMATIONS D'APPARITION FLUIDES AU SCROLL (EXPERT)
// ==========================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.product-row, .bundle-highlight-card, .testimonial-card, .faq-item, .section-header');
  elements.forEach(el => el.classList.add('reveal-on-scroll'));

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  });

  elements.forEach(el => observer.observe(el));
}
