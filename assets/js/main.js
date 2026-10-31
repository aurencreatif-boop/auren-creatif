/**
 * AUREN CRÉATIF · OLIVIER, GRAPHISTE DESIGNER
 * Interactive Script for Portfolio, Stepper Wizard, Lightbox & WhatsApp Integration
 */

/* ==========================================================================
   2. DONNÉES DE PRIX (Configuration unique pour Olivier)
   Facile à modifier : toutes les valeurs tarifaires proviennent exclusivement
   de cet objet. Aucune valeur de prix n'est codée en dur ailleurs.
   ========================================================================== */
const PRICING = {
  taux: 655.957,   // 1 € = 655,957 FCFA, taux fixe
  delais: {
    express:  { libelle: "Express 24 h",            coeff: 1.50, badge: "+50 %", notice: "Soumis à la disponibilité d'Olivier, confirmée avant tout paiement." },
    rapide:   { libelle: "Rapide 48 h",             coeff: 1.25, badge: "+25 %", notice: "" },
    standard: { libelle: "Standard 3 jours (3 à 5)", coeff: 1.00, badge: "Prix normal", notice: "" },
    flexible: { libelle: "Flexible 7 jours ou plus", coeff: 0.90, badge: "−10 %", notice: "" }
  },
  services: {
    affiche_simple:   { nom: "Affiche simple",              fcfa: 15000,  eur: 50 },
    affiche_premium:  { nom: "Affiche premium",             fcfa: 30000,  eur: 90 },
    flyer_recto:      { nom: "Flyer recto",                 fcfa: 12000,  eur: 40 },
    flyer_rectoverso: { nom: "Flyer recto-verso",           fcfa: 20000,  eur: 65 },
    visuel_reseaux:   { nom: "Visuel réseaux sociaux",      fcfa: 7500,   eur: 25 },
    pack_5_visuels:   { nom: "Pack 5 visuels réseaux",      fcfa: 30000,  eur: 100 },
    carte_visite:     { nom: "Carte de visite",             fcfa: 10000,  eur: 35 },
    logo_simple:      { nom: "Logo simple",                 fcfa: 35000,  eur: 120 },
    identite_complete:{ nom: "Identité visuelle complète",  fcfa: 100000, eur: 300 },
    motion_design:    { nom: "Animation motion design",     fcfa: 40000,  eur: 110 }
  },
  options: {
    revision: { nom: "Révision supplémentaire", fcfa: 3000, eur: 5 },
    format:   { nom: "Format supplémentaire",   fcfa: 5000, eur: 12 },
    sources:  { nom: "Fichiers sources",        fcfa: 5000, eur: 15 }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Coordonnées officielles d'Olivier (Auren Créatif)
  const WA_PHONE = "22896990329"; // +228 96 99 03 29
  const CONTACT_EMAIL = "aurencreatif@gmail.com";

  /* ==========================================================================
     Navbar Scroll & Mobile Toggle
     ========================================================================== */
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  function openMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  }

  function closeMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  }

  if (menuToggle && navMenu) {
    // Immediate touch & click handler with zero 300ms delay
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on backdrop tap
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
      navBackdrop.addEventListener('touchstart', (e) => {
        e.preventDefault();
        closeMobileMenu();
      }, { passive: false });
    }

    // Close when tapping any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Auto-close when resizing to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    }, { passive: true });
  }

  /* ==========================================================================
     Active Nav Link Highlighting on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });

  /* ==========================================================================
     Portfolio Data & Filtering
     ========================================================================== */
  const portfolioData = [
    {
      id: 1,
      title: "Libre de Faire Votre Choix — SMG Plug",
      category: "affiches",
      categoryName: "Affiche Publicitaire",
      image: "assets/images/affiche-smg-plug.png",
      description: "Affiche promotionnelle e-commerce high-tech pour SMG Plug. Mise en avant de smartphones nouvelle génération, iPad, casques audio et écouteurs sans fil avec un fond bleuté futuriste et un call-to-action percutant pour la livraison partout."
    },
    {
      id: 2,
      title: "Votre Vidéas — Joh Production",
      category: "affiches",
      categoryName: "Affiche Événementielle",
      image: "assets/images/affiche-joh-production-videas.png",
      description: "Conception visuelle dynamique pour la couverture d'événements de prestige : Mariage, Anniversaire, Dote, Clips et Concerts. Composition moderne intégrant appareil photo reflex, vignettes immersives et signature créative."
    },
    {
      id: 3,
      title: "Ten Over Ten Store — Boutique Tout-en-Un",
      category: "affiches",
      categoryName: "Affiche Commerciale",
      image: "assets/images/affiche-ten-over-ten.png",
      description: "Visuel publicitaire complet présentant l'ensemble du catalogue Ten Over Ten Store : sneakers tendance, prêt-à-porter, montres de luxe, parfums et accessoires high-tech dans une composition commerciale haut de gamme."
    },
    {
      id: 4,
      title: "Transformez Vos Souvenirs — Studio & Vidéo",
      category: "affiches",
      categoryName: "Affiche & Photographie",
      image: "assets/images/affiche-transformez-vos-souvenirs.jpg",
      description: "Affiche percutante célébrant l'art visuel et la création : montage vidéo créatif, shooting photo pro en studio et extérieur, vidéos événementielles avec une esthétique dorée et noire contrastée."
    },
    {
      id: 5,
      title: "The Winner — Spa & Massothérapie",
      category: "flyers",
      categoryName: "Flyer & Santé",
      image: "assets/images/flyer-winner-spa-massage.jpg",
      description: "Flyer apaisant et chaleureux aux teintes cacao et crème pour The Winner Spa & Massage. Présentation soignée des services de massage therapy, réflexologie et relaxation corporelle."
    },
    {
      id: 6,
      title: "Glow Esthétique — Anniversaire -50%",
      category: "flyers",
      categoryName: "Flyer Promotionnel",
      image: "assets/images/flyer-glow-esthetique-anniversaire.png",
      description: "Conception éclatante pour la célébration des 2 ans de la Maison de Beauté Glow Esthétique. Intégration de visuels percutants, macarons de réduction -50% et grille claire des prestations cosmétiques."
    },
    {
      id: 7,
      title: "La Passion — Mockups Identité de Marque",
      category: "branding",
      categoryName: "Branding & Mockups",
      image: "assets/images/branding-la-passion-mockup.png",
      description: "Déclinaison complète d'identité visuelle sur supports de marque réels : sac shopping kraft haut de gamme, casquette brodée, polo corporate, tablier professionnel et carte de visite épurée."
    },
    {
      id: 8,
      title: "La Passion — Logo Officiel Couronné",
      category: "branding",
      categoryName: "Création de Logo",
      image: "assets/images/logo-la-passion.png",
      description: "Création d'un logo raffiné alliant silhouette féminine stylisée, couronne royale et ciseaux de haute coiffure dans une typographie sur mesure pleine d'élégance et de caractère."
    },
    {
      id: 12,
      title: "Joh Production — Logo Signature Doré",
      category: "branding",
      categoryName: "Création de Logo",
      image: "assets/images/logo-joh-production.png",
      description: "Logo signature de prestige pour Joh Production. Typographie manuscrite dorée avec objectif photo et silhouette intégrée, traduisant le dynamisme de la production audiovisuelle et événementielle haut de gamme."
    },
    {
      id: 13,
      title: "Ten Over Ten Store — Emblème E-commerce",
      category: "branding",
      categoryName: "Création de Logo",
      image: "assets/images/logo-ten-over-ten.png",
      description: "Identité de marque moderne pour Ten Over Ten Store. Chariot de courses stylisé surmonté du badge '10' et curseur d'interaction mobile, évoquant la perfection et l'expérience client 10/10."
    },
    {
      id: 14,
      title: "Light Paint Group Togo — Logo 3D Relief",
      category: "branding",
      categoryName: "Logo 3D & Identité",
      image: "assets/images/logo-lpgt-togo.jpg",
      description: "Logo 3D en haut-relief pour Light Paint Group Togo (LPGT). Dôme géodésique jaune éclatant, rouleau d'application pourpre et typographie sculptée sur fond d'atelier moderne."
    },
    {
      id: 9,
      title: "Geny Braid — Carte de Visite & Print",
      category: "print",
      categoryName: "Carte de Visite Recto-Verso",
      image: "assets/images/carte-visite-geny-braid.png",
      description: "Carte de visite haut de gamme recto-verso pour salon de coiffure afro. Recto avec présentation des services (Tresse, Perruque, Locks) et photos réelles, verso épuré avec slogan 'La beauté sans compromis'."
    },
    {
      id: 10,
      title: "Team Joh Production — Showcase 3D Écrans",
      category: "motion",
      categoryName: "Motion & Rendu 3D",
      image: "assets/images/showcase-team-joh-3d.jpg",
      description: "Composition 3D futuriste avec podium noir, éclairages de studio et écrans flottants en lévitation illustrant le savoir-faire de l'équipe : photographie, vidéographie et graphic design."
    },
    {
      id: 11,
      title: "Auren Design — Vœux & Heureuse Année 2026",
      category: "social",
      categoryName: "Visuel Réseaux Sociaux",
      image: "assets/images/carte-voeux-auren-design-2026.jpg",
      description: "Visuel festif pour les fêtes et la nouvelle année 2026 : rideau de velours rouge théâtral, typographie dorée éclatante et message de remerciement aux clients autour des valeurs Créativité, Qualité et Engagement."
    }
  ];

  const tabButtons = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     Lightbox Modal
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');

  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = portfolioData[index];
    if (!item) return;

    lightboxImg.src = item.image;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.categoryName;
    lightboxDesc.textContent = item.description;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % portfolioData.length;
    openLightbox(currentLightboxIndex);
  }

  function showPrevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + portfolioData.length) % portfolioData.length;
    openLightbox(currentLightboxIndex);
  }

  // Bind clicks on portfolio cards
  document.querySelectorAll('.open-lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = trigger.closest('.portfolio-item');
      if (parentItem) {
        const itemId = parseInt(parentItem.getAttribute('data-id'), 10);
        const index = portfolioData.findIndex(p => p.id === itemId);
        if (index !== -1) {
          openLightbox(index);
        }
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevLightbox);

  // Close when clicking backdrop
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextLightbox();
    if (e.key === 'ArrowLeft') showPrevLightbox();
  });

  // Action button in lightbox: order a similar design
  if (lightboxOrderBtn) {
    lightboxOrderBtn.addEventListener('click', () => {
      const currentItem = portfolioData[currentLightboxIndex];
      closeLightbox();
      goToOrderWithPreselection(currentItem.category, currentItem.title);
    });
  }

  /* ==========================================================================
     Preselection from Services Section & Lightbox
     ========================================================================== */
  /* ==========================================================================
     3. MOTEUR DE PRIX DYNAMIQUE & GESTION D'ÉTAT DU FORMULAIRE
     ========================================================================== */
  const orderState = {
    region: 'afrique',          // 'afrique' | 'europe' | 'autre'
    serviceKey: 'affiche_simple', // clé dans PRICING.services ou 'sur_devis'
    delaiKey: 'standard',       // 'express' | 'rapide' | 'standard' | 'flexible'
    options: new Set(),         // Set de clés ('revision', 'format', 'sources')
    files: []                   // Tableau d'objets fichiers { name, size, type, formattedSize, previewUrl }
  };

  // Arrondi FCFA au multiple de 500 le plus proche (au-dessus en cas d'égalité)
  function roundFcfa(amount) {
    return Math.round(amount / 500) * 500;
  }

  // Arrondi Euros à l'euro le plus proche (au-dessus en cas d'égalité)
  function roundEur(amount) {
    return Math.round(amount);
  }

  // Calcul dynamique complet de l'estimation selon la région, le service, le délai et les options
  function calculateOrderPricing() {
    const projectFormatInput = document.getElementById('projectFormat');
    const isFormatCustom = projectFormatInput && projectFormatInput.value.includes('sur-mesure') || projectFormatInput && projectFormatInput.value.includes('personnalisé');
    const isSurDevis = (orderState.serviceKey === 'sur_devis' || isFormatCustom);
    const isFcfa = (orderState.region === 'afrique');
    const primaryCurrency = isFcfa ? 'FCFA' : '€';
    const secondaryCurrency = isFcfa ? '€' : 'FCFA';

    if (isSurDevis) {
      return {
        isSurDevis: true,
        serviceKey: 'sur_devis',
        serviceName: "Format personnalisé / Autre demande",
        basePrice: null,
        baseFormatted: "Sur devis",
        delaiKey: orderState.delaiKey,
        delaiLibelle: (PRICING.delais[orderState.delaiKey] || {}).libelle || "Standard",
        delaiBadge: (PRICING.delais[orderState.delaiKey] || {}).badge || "",
        delaiNotice: (PRICING.delais[orderState.delaiKey] || {}).notice || "",
        optionsList: [],
        optionsTotal: 0,
        servicePrice: null,
        total: null,
        totalFormatted: "Sur devis",
        equivAmount: null,
        equivFormatted: "Devis personnalisé sous 2h",
        primaryCurrency: "Sur devis",
        secondaryCurrency: ""
      };
    }

    const srv = PRICING.services[orderState.serviceKey] || PRICING.services.affiche_simple;
    const delai = PRICING.delais[orderState.delaiKey] || PRICING.delais.standard;
    const basePrice = isFcfa ? srv.fcfa : srv.eur;
    const baseFormatted = isFcfa ? `${basePrice.toLocaleString('fr-FR')} FCFA` : `${basePrice} €`;

    // Prix du service = prix de base × coeff du délai, puis arrondi
    const rawServicePrice = basePrice * delai.coeff;
    const servicePrice = isFcfa ? roundFcfa(rawServicePrice) : roundEur(rawServicePrice);

    // Options : montants fixes de la devise principale, ajoutés sans coefficient
    let optionsTotal = 0;
    const optionsList = [];
    orderState.options.forEach(optKey => {
      const opt = PRICING.options[optKey];
      if (opt) {
        const optVal = isFcfa ? opt.fcfa : opt.eur;
        optionsTotal += optVal;
        optionsList.push({
          key: optKey,
          nom: opt.nom,
          amount: optVal,
          formatted: isFcfa ? `+${optVal.toLocaleString('fr-FR')} FCFA` : `+${optVal} €`
        });
      }
    });

    // Total = prix du service arrondi + somme des options
    const total = servicePrice + optionsTotal;
    const totalFormatted = isFcfa ? `${total.toLocaleString('fr-FR')} FCFA` : `${total} €`;

    // Équivalent dans l'autre devise précédé de « ≈ »
    let equivAmount = 0;
    let equivFormatted = '';
    if (isFcfa) {
      equivAmount = roundEur(total / PRICING.taux);
      equivFormatted = `≈ ${equivAmount} €`;
    } else {
      equivAmount = roundFcfa(total * PRICING.taux);
      equivFormatted = `≈ ${equivAmount.toLocaleString('fr-FR')} FCFA`;
    }

    return {
      isSurDevis: false,
      serviceKey: orderState.serviceKey,
      serviceName: srv.nom,
      basePrice,
      baseFormatted,
      delaiKey: orderState.delaiKey,
      delaiLibelle: delai.libelle,
      delaiBadge: delai.badge,
      delaiNotice: delai.notice,
      optionsList,
      optionsTotal,
      servicePrice,
      total,
      totalFormatted,
      equivAmount,
      equivFormatted,
      primaryCurrency,
      secondaryCurrency
    };
  }

  // Animation douce du changement de montant (respecte prefers-reduced-motion)
  function animatePriceChange(element) {
    if (!element) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    element.classList.remove('price-animated');
    // Force reflow
    void element.offsetWidth;
    element.classList.add('price-animated');
  }

  // Mise à jour de l'interface en temps réel
  function updateOrderPricingUI() {
    const calc = calculateOrderPricing();
    const isFcfa = (orderState.region === 'afrique');

    // 1. Mettre à jour les étiquettes de prix de base sur les cartes services (Étape 1)
    Object.keys(PRICING.services).forEach(srvKey => {
      const tag = document.querySelector(`[data-price-tag="${srvKey}"]`);
      if (tag) {
        const item = PRICING.services[srvKey];
        tag.textContent = isFcfa ? `${item.fcfa.toLocaleString('fr-FR')} FCFA` : `${item.eur} €`;
      }
    });

    // 2. Mettre à jour les badges de prix des options (Étape 2)
    Object.keys(PRICING.options).forEach(optKey => {
      const pill = document.querySelector(`[data-option-price="${optKey}"]`);
      if (pill) {
        const opt = PRICING.options[optKey];
        pill.textContent = isFcfa ? `+${opt.fcfa.toLocaleString('fr-FR')} FCFA` : `+${opt.eur} €`;
      }
    });

    // 3. Alerte délai Express 24h
    const expressAlert = document.getElementById('delaiExpressAlert');
    if (expressAlert) {
      expressAlert.style.display = (orderState.delaiKey === 'express') ? 'flex' : 'none';
    }

    // 4. Mettre à jour la carte collante « Votre estimation »
    const estServiceNom = document.getElementById('estServiceNom');
    const estPrixBase = document.getElementById('estPrixBase');
    const estDelaiLigne = document.getElementById('estDelaiLigne');
    const estOptionsLigne = document.getElementById('estOptionsLigne');
    const estOptionsList = document.getElementById('estOptionsList');
    const estTotalMain = document.getElementById('estTotalMain');
    const estTotalEquiv = document.getElementById('estTotalEquiv');
    const estMobileTotal = document.getElementById('estMobileTotal');

    if (estServiceNom) estServiceNom.textContent = calc.serviceName;
    if (estPrixBase) estPrixBase.textContent = calc.baseFormatted;
    if (estDelaiLigne) {
      estDelaiLigne.textContent = calc.isSurDevis ? calc.delaiLibelle : `${calc.delaiLibelle} (${calc.delaiBadge})`;
    }

    if (estOptionsLigne) {
      estOptionsLigne.textContent = calc.optionsList.length > 0 ? `${calc.optionsList.length} sélectionnée(s)` : 'Aucune';
    }

    if (estOptionsList) {
      if (calc.optionsList.length > 0) {
        estOptionsList.style.display = 'flex';
        estOptionsList.innerHTML = calc.optionsList.map(opt =>
          `<div class="est-option-item"><span>• ${opt.nom}</span><strong>${opt.formatted}</strong></div>`
        ).join('');
      } else {
        estOptionsList.style.display = 'none';
        estOptionsList.innerHTML = '';
      }
    }

    if (estTotalMain) {
      if (estTotalMain.textContent !== calc.totalFormatted) {
        estTotalMain.textContent = calc.totalFormatted;
        animatePriceChange(estTotalMain);
      }
    }

    if (estTotalEquiv) {
      estTotalEquiv.textContent = calc.equivFormatted;
      estTotalEquiv.style.display = calc.isSurDevis ? 'none' : 'block';
    }

    if (estMobileTotal) {
      estMobileTotal.textContent = calc.totalFormatted;
    }

    // Si on est sur l'étape 3, mettre à jour le résumé
    if (currentStep === 3) {
      populateSummary();
    }

    return calc;
  }

  // 6. ENREGISTREMENT & SUIVI PRIVÉ DES COMMANDES
  function recordOrderData(orderPayload) {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('auren_orders_log') || '[]');
      existingOrders.push(orderPayload);
      localStorage.setItem('auren_orders_log', JSON.stringify(existingOrders));
      localStorage.setItem('auren_last_order', JSON.stringify(orderPayload));

      // Événement custom pour intégration sans rechargement
      window.dispatchEvent(new CustomEvent('auren:orderCreated', { detail: orderPayload }));

      // Si un service de collecte webhook/Google Sheets privé est configuré
      if (window.AUREN_COLLECTION_URL) {
        fetch(window.AUREN_COLLECTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("Enregistrement local de commande :", err);
    }
  }

  // Pré-sélection depuis les boutons de la page (ex: grille de services ou portfolio)
  function goToOrderWithPreselection(categoryKey, referenceTitle = '') {
    const orderSection = document.getElementById('commander');
    if (!orderSection) return;

    orderSection.scrollIntoView({ behavior: 'smooth' });

    // Mapper les catégories de cartes aux 10 services PRICING
    let targetKey = 'affiche_simple';
    const key = (categoryKey || '').toLowerCase();

    if (key.includes('affiche_premium')) targetKey = 'affiche_premium';
    else if (key.includes('affiche')) targetKey = 'affiche_simple';
    else if (key.includes('flyer_rectoverso') || key.includes('recto-verso')) targetKey = 'flyer_rectoverso';
    else if (key.includes('flyer')) targetKey = 'flyer_recto';
    else if (key.includes('identite') || key.includes('charte')) targetKey = 'identite_complete';
    else if (key.includes('logo') || key.includes('branding')) targetKey = 'logo_simple';
    else if (key.includes('pack_5') || key.includes('pack')) targetKey = 'pack_5_visuels';
    else if (key.includes('reseaux') || key.includes('social')) targetKey = 'visuel_reseaux';
    else if (key.includes('carte') || key.includes('print')) targetKey = 'carte_visite';
    else if (key.includes('motion') || key.includes('3d')) targetKey = 'motion_design';
    else if (key.includes('devis') || key.includes('sur_devis')) targetKey = 'sur_devis';

    // Mettre à jour le radio correspondant
    const radio = document.querySelector(`input[name="serviceType"][value="${targetKey}"]`);
    if (radio) {
      radio.checked = true;
      document.querySelectorAll('.service-option-card').forEach(card => card.classList.remove('selected'));
      const parentCard = radio.closest('.service-option-card');
      if (parentCard) parentCard.classList.add('selected');
      orderState.serviceKey = targetKey;
      updateOrderPricingUI();
    }

    // Référence d'inspiration
    if (referenceTitle) {
      const briefInput = document.getElementById('projectBrief');
      if (briefInput && !briefInput.value.includes(referenceTitle)) {
        briefInput.value = `Inspiration souhaitée : "${referenceTitle}".\n` + briefInput.value;
      }
    }

    goToStep(1);
  }

  // Écoute des boutons de la section services ("Demander un devis")
  document.querySelectorAll('.service-btn[data-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      goToOrderWithPreselection(serviceKey);
    });
  });

  /* ==========================================================================
     Écouteurs d'Événements du Formulaire (Région, Service, Délai, Options)
     ========================================================================== */

  // a) Changement manuel de région (Afrique / Europe / Autre)
  document.querySelectorAll('input[name="orderRegion"]').forEach(radio => {
    radio.addEventListener('change', () => {
      orderState.region = radio.value;
      document.querySelectorAll('.region-pill').forEach(pill => pill.classList.remove('selected'));
      const pill = radio.closest('.region-pill');
      if (pill) pill.classList.add('selected');
      updateOrderPricingUI();
    });
  });

  // b) Sélection de service (un seul choix parmi les 10 + sur devis)
  document.querySelectorAll('.service-option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        orderState.serviceKey = radio.value;
        updateOrderPricingUI();
      }
    });
  });

  // c) Choix du délai (cartes cliquables avec libellé et écart de prix)
  document.querySelectorAll('.delai-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.delai-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        orderState.delaiKey = radio.value;
        updateOrderPricingUI();
      }
    });
  });

  // d) Cases à cocher des options (cliquables sur toute la carte, montants fixes)
  document.querySelectorAll('.option-check-card').forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    const toggleOption = () => {
      checkbox.checked = !checkbox.checked;
      const isChecked = checkbox.checked;
      card.classList.toggle('checked', isChecked);
      card.setAttribute('aria-checked', isChecked ? 'true' : 'false');

      if (isChecked) {
        orderState.options.add(checkbox.value);
      } else {
        orderState.options.delete(checkbox.value);
      }
      updateOrderPricingUI();
    };

    // Clic n'importe où sur la carte
    card.addEventListener('click', (e) => {
      e.preventDefault();
      toggleOption();
    });

    // Navigation et sélection au clavier (Espace ou Entrée)
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleOption();
      }
    });
  });

  // Détection du format personnalisé dans le sélecteur
  const projectFormatSelect = document.getElementById('projectFormat');
  if (projectFormatSelect) {
    projectFormatSelect.addEventListener('change', () => {
      updateOrderPricingUI();
    });
  }

  // Accordéon mobile pour la carte d'estimation collante
  const estimationToggleMobile = document.getElementById('estimationToggleMobile');
  const orderEstimationCard = document.getElementById('orderEstimationCard');
  if (estimationToggleMobile && orderEstimationCard) {
    estimationToggleMobile.addEventListener('click', () => {
      const isExpanded = orderEstimationCard.classList.toggle('expanded');
      estimationToggleMobile.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  }

  /* ==========================================================================
     Interactive 4-Step Order Wizard (COMMANDER)
     ========================================================================== */
  let currentStep = 1;
  const totalSteps = 4;

  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const stepperSteps = document.querySelectorAll('.stepper-step');
  const progressBar = document.getElementById('stepperProgressBar');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  function updateProgressBar() {
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressBar) progressBar.style.width = `${percentage}%`;

    stepperSteps.forEach((step, idx) => {
      const stepNum = idx + 1;
      step.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        step.classList.add('active');
      } else if (stepNum < currentStep) {
        step.classList.add('completed');
      }
    });

    // Visibilité et libellé des boutons
    if (prevStepBtn) {
      prevStepBtn.style.visibility = (currentStep === 1 || currentStep === 4) ? 'hidden' : 'visible';
    }

    if (nextStepBtn) {
      if (currentStep === 3) {
        nextStepBtn.innerHTML = 'Confirmer et envoyer sur WhatsApp <i class="fa-brands fa-whatsapp"></i>';
        nextStepBtn.classList.remove('btn-primary');
        nextStepBtn.classList.add('btn-whatsapp');
        nextStepBtn.style.display = 'inline-flex';
      } else if (currentStep === 4) {
        nextStepBtn.style.display = 'none';
      } else {
        nextStepBtn.innerHTML = 'Continuer <i class="fa-solid fa-arrow-right"></i>';
        nextStepBtn.classList.add('btn-primary');
        nextStepBtn.classList.remove('btn-whatsapp');
        nextStepBtn.style.display = 'inline-flex';
      }
    }
  }

  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > totalSteps) return;

    // Validation stricte avant d'avancer
    if (stepNumber > currentStep) {
      if (currentStep === 1) {
        const selectedRadio = document.querySelector('input[name="serviceType"]:checked');
        if (!selectedRadio) {
          alert("Veuillez sélectionner un service pour continuer.");
          return;
        }
      }
      if (currentStep === 2) {
        const projectName = document.getElementById('projectName').value.trim();
        if (!projectName) {
          alert("Veuillez indiquer le nom de votre projet ou marque.");
          document.getElementById('projectName').focus();
          return;
        }
      }
    }

    currentStep = stepNumber;

    stepPanes.forEach(pane => {
      pane.classList.remove('active');
      if (parseInt(pane.getAttribute('data-step'), 10) === currentStep) {
        pane.classList.add('active');
      }
    });

    if (currentStep === 3) {
      populateSummary();
    }

    if (currentStep === 4) {
      prepareFinalWhatsAppAction();
    }

    updateProgressBar();
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  // Stepper Header clickability
  stepperSteps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      const targetStep = idx + 1;
      if (targetStep < currentStep) {
        goToStep(targetStep);
      }
    });
  });

  // Boutons de correction depuis l'étape 3
  const editServiceBtn = document.getElementById('editServiceBtn');
  if (editServiceBtn) {
    editServiceBtn.addEventListener('click', () => {
      goToStep(1);
    });
  }

  const editSummaryBtn = document.getElementById('editSummaryBtn');
  if (editSummaryBtn) {
    editSummaryBtn.addEventListener('click', () => {
      goToStep(2);
    });
  }

  // 5. Remplir le résumé de l'Étape 3 avec l'estimation détaillée
  function populateSummary() {
    const calc = calculateOrderPricing();
    const regionNames = { afrique: "Afrique (FCFA)", europe: "Europe (€)", autre: "Autre (€)" };
    const projectName = document.getElementById('projectName').value.trim() || 'Non précisé';
    const projectFormat = document.getElementById('projectFormat').value || 'Format Digital / Réseaux sociaux';
    const projectStyle = document.getElementById('projectStyle').value.trim() || 'Style moderne et dynamique';
    const projectBrief = document.getElementById('projectBrief').value.trim() || 'Brief à détailler avec Olivier';

    const sumRegion = document.getElementById('summaryRegion');
    const sumService = document.getElementById('summaryService');
    const sumPrixBase = document.getElementById('summaryPrixBase');
    const sumDeadline = document.getElementById('summaryDeadline');
    const sumOptions = document.getElementById('summaryOptions');
    const sumTotalMain = document.getElementById('summaryTotalMain');
    const sumTotalEquiv = document.getElementById('summaryTotalEquiv');
    const sumProject = document.getElementById('summaryProject');
    const sumFormat = document.getElementById('summaryFormat');
    const sumStyle = document.getElementById('summaryStyle');
    const sumBrief = document.getElementById('summaryBrief');

    if (sumRegion) sumRegion.textContent = regionNames[orderState.region] || "Afrique (FCFA)";
    if (sumService) sumService.textContent = calc.serviceName;
    if (sumPrixBase) sumPrixBase.textContent = calc.baseFormatted;
    if (sumDeadline) {
      sumDeadline.textContent = calc.isSurDevis ? calc.delaiLibelle : `${calc.delaiLibelle} (${calc.delaiBadge})`;
    }
    if (sumOptions) {
      if (calc.optionsList.length > 0) {
        sumOptions.textContent = calc.optionsList.map(o => `${o.nom} (${o.formatted})`).join(', ');
      } else {
        sumOptions.textContent = 'Aucune';
      }
    }
    if (sumTotalMain) sumTotalMain.textContent = calc.totalFormatted;
    if (sumTotalEquiv) {
      sumTotalEquiv.textContent = calc.equivFormatted;
      sumTotalEquiv.style.display = calc.isSurDevis ? 'none' : 'inline-block';
    }

    if (sumProject) sumProject.textContent = projectName;
    if (sumFormat) sumFormat.textContent = projectFormat;
    if (sumStyle) sumStyle.textContent = projectStyle;
    if (sumBrief) sumBrief.textContent = projectBrief;

    const sumFiles = document.getElementById('summaryFiles');
    if (sumFiles) {
      if (orderState.files && orderState.files.length > 0) {
        const fileNames = orderState.files.map(f => `${f.name} (${f.formattedSize})`).join(', ');
        sumFiles.textContent = `📎 ${orderState.files.length} fichier(s) : ${fileNames}`;
      } else {
        sumFiles.textContent = 'Aucun fichier joint';
      }
    }
  }

  // 6. Préparer l'Étape 4, le message WhatsApp complet et l'enregistrement
  function prepareFinalWhatsAppAction() {
    const calc = calculateOrderPricing();
    const regionNames = { afrique: "Afrique (FCFA)", europe: "Europe (€)", autre: "Autre (€)" };
    const projectName = document.getElementById('projectName').value.trim() || 'Mon Projet';
    const projectFormat = document.getElementById('projectFormat').value || 'Digital / Web';
    const projectStyle = document.getElementById('projectStyle').value.trim() || 'Style moderne et dynamique';
    const projectBrief = document.getElementById('projectBrief').value.trim() || 'Demande de devis et informations complémentaires.';
    const now = new Date();
    const dateFr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const optionsStr = calc.optionsList.length > 0 ?
      calc.optionsList.map(o => `• ${o.nom} (${o.formatted})`).join('\n') :
      'Aucune option complémentaire';

    const filesStr = orderState.files && orderState.files.length > 0 ?
      `📎 *Fichiers / Logo prêts (${orderState.files.length}) :*\n` + orderState.files.map(f => `  • ${f.name} (${f.formattedSize})`).join('\n') +
      `\n*(Je vous les transmets directement ici dans le chat)*\n\n` : '';

    // Données structurées envoyées au service de collecte (tableau privé)
    const orderPayload = {
      region: orderState.region,
      region_libelle: regionNames[orderState.region],
      service_cle: calc.serviceKey,
      service: calc.serviceName,
      delai_cle: calc.delaiKey,
      delai: `${calc.delaiLibelle} (${calc.delaiBadge})`,
      options: calc.optionsList.map(o => o.nom),
      options_detail: calc.optionsList,
      prix_de_base: calc.isSurDevis ? 'Sur devis' : calc.basePrice,
      prix_de_base_texte: calc.baseFormatted,
      total_estime: calc.isSurDevis ? 'Sur devis' : calc.total,
      total_estime_texte: calc.totalFormatted,
      equivalent_estime: calc.isSurDevis ? 'Sur devis' : calc.equivFormatted,
      devise: calc.primaryCurrency,
      date_de_la_demande: now.toISOString(),
      date_fr: dateFr,
      nom_projet: projectName,
      format_souhaite: projectFormat,
      style_couleurs: projectStyle,
      brief: projectBrief,
      fichiers_joints: orderState.files.map(f => `${f.name} (${f.formattedSize})`),
      nombre_fichiers: orderState.files.length,
      statut_prix: 'Estimation indicative (devis final confirmé par Olivier)'
    };

    // Enregistrement dans les données de suivi sans supprimer les entrées existantes
    recordOrderData(orderPayload);

    // Construction du message WhatsApp complet et structuré
    const message = `Bonjour Olivier (Auren Créatif) ! 👋\n` +
      `Je viens de compléter mon brief et mon estimation sur votre site internet :\n\n` +
      `📊 *RÉSUMÉ DE LA DEMANDE :*\n` +
      `🌍 *Région :* ${regionNames[orderState.region]}\n` +
      `📌 *Service :* ${calc.serviceName}\n` +
      `💵 *Prix de base :* ${calc.baseFormatted}\n` +
      `⏱️ *Délai :* ${calc.delaiLibelle} (${calc.delaiBadge})\n` +
      `🧩 *Options :*\n${optionsStr}\n` +
      `💰 *Total estimé :* ${calc.totalFormatted} ${calc.isSurDevis ? '' : '(' + calc.equivFormatted + ')'}\n` +
      `📅 *Date de la demande :* ${dateFr}\n\n` +
      `📝 *DÉTAILS DU PROJET :*\n` +
      `🏷️ *Projet / Marque :* ${projectName}\n` +
      `📐 *Support / Format :* ${projectFormat}\n` +
      `🎨 *Style & Couleurs :* ${projectStyle}\n` +
      `💬 *Texte & Brief :*\n${projectBrief}\n\n` +
      filesStr +
      `⚠️ *Note :* Cette estimation est indicative. Pourriez-vous me confirmer vos disponibilités ainsi que le devis final ? Merci beaucoup !`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodedMessage}`;

    const sendWABtn = document.getElementById('sendWhatsAppBriefBtn');
    if (sendWABtn) {
      sendWABtn.href = waUrl;
    }
  }

  // ==========================================================================
  // GESTION DES FICHIERS JOINTS AU BRIEF (LOGO, IMAGES, INSPIRATIONS)
  // ==========================================================================
  function initBriefFileUpload() {
    const fileInput = document.getElementById('clientFileUpload');
    const briefPlusBtn = document.getElementById('briefPlusBtn');
    const briefActionPopover = document.getElementById('briefActionPopover');
    const popoverAddFilesBtn = document.getElementById('popoverAddFilesBtn');
    const briefPlusBadge = document.getElementById('briefPlusBadge');
    const dropZone = document.getElementById('briefDropZone');
    const previewContainer = document.getElementById('uploadedFilesPreview');
    const filesList = document.getElementById('uploadedFilesList');
    const countLabel = document.getElementById('uploadedCountLabel');
    const btnClearAll = document.getElementById('btnClearAllFiles');

    if (!fileInput) return;

    // Gestion de l'ouverture / fermeture du Pop-up au clic sur le bouton PLUS
    function togglePopover(forceOpen = null) {
      if (!briefActionPopover || !briefPlusBtn) return;
      const isOpen = forceOpen !== null ? forceOpen : !briefActionPopover.classList.contains('open');
      briefActionPopover.classList.toggle('open', isOpen);
      briefPlusBtn.classList.toggle('active', isOpen);
      briefPlusBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function closePopover() {
      togglePopover(false);
    }

    if (briefPlusBtn) {
      briefPlusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePopover();
      });
    }

    // Clic sur l'action "Ajouter des photos et fichiers" dans le Pop-up
    if (popoverAddFilesBtn) {
      popoverAddFilesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closePopover();
        // Ouvre directement le sélecteur de fichiers / galerie photos
        fileInput.click();
      });
    }

    // Fermer le Pop-up si on clique en dehors
    document.addEventListener('click', (e) => {
      if (briefActionPopover && briefActionPopover.classList.contains('open')) {
        const container = document.querySelector('.brief-plus-container');
        if (container && !container.contains(e.target)) {
          closePopover();
        }
      }
    });

    // Fermer le Pop-up avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && briefActionPopover && briefActionPopover.classList.contains('open')) {
        closePopover();
      }
    });

    function formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 Ko';
      const k = 1024;
      const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function addFiles(newFiles) {
      const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 Mo max
      let hasAdded = false;

      Array.from(newFiles).forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`Le fichier "${file.name}" dépasse la taille maximale autorisée de 25 Mo.`);
          return;
        }

        const alreadyExists = orderState.files.some(f => f.name === file.name && f.size === file.size);
        if (alreadyExists) return;

        let previewUrl = null;
        if (file.type.startsWith('image/')) {
          try {
            previewUrl = URL.createObjectURL(file);
          } catch (err) {
            previewUrl = null;
          }
        }

        orderState.files.push({
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          formattedSize: formatFileSize(file.size),
          previewUrl: previewUrl
        });
        hasAdded = true;
      });

      if (hasAdded) {
        renderUploadedFiles();
      }
    }

    function renderUploadedFiles() {
      const total = orderState.files.length;

      if (total === 0) {
        if (previewContainer) previewContainer.style.display = 'none';
        if (briefPlusBadge) {
          briefPlusBadge.style.display = 'none';
          briefPlusBadge.textContent = '0';
        }
        return;
      }

      if (previewContainer) previewContainer.style.display = 'block';
      if (countLabel) {
        countLabel.textContent = `${total} fichier${total > 1 ? 's' : ''} sélectionné${total > 1 ? 's' : ''}`;
      }
      if (briefPlusBadge) {
        briefPlusBadge.style.display = 'flex';
        briefPlusBadge.textContent = total;
      }

      if (filesList) {
        filesList.innerHTML = '';
        orderState.files.forEach((f, idx) => {
          const card = document.createElement('div');
          card.className = 'file-preview-card';

          let thumbHtml = '';
          if (f.previewUrl) {
            thumbHtml = `<img src="${f.previewUrl}" alt="${f.name}" class="file-thumb-img">`;
          } else {
            let iconClass = 'fa-file-lines';
            if (f.name.endsWith('.pdf')) iconClass = 'fa-file-pdf';
            else if (f.name.endsWith('.ai') || f.name.endsWith('.eps') || f.name.endsWith('.svg')) iconClass = 'fa-bezier-curve';
            else if (f.name.endsWith('.psd')) iconClass = 'fa-file-image';
            else if (f.name.endsWith('.zip')) iconClass = 'fa-file-zipper';
            thumbHtml = `<div class="file-thumb-icon"><i class="fa-solid ${iconClass}"></i></div>`;
          }

          card.innerHTML = `
            ${thumbHtml}
            <div class="file-info-col">
              <span class="file-info-name" title="${f.name}">${f.name}</span>
              <span class="file-info-size">${f.formattedSize}</span>
            </div>
            <button type="button" class="file-delete-btn" data-index="${idx}" title="Supprimer ce fichier" aria-label="Supprimer ${f.name}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          `;

          const deleteBtn = card.querySelector('.file-delete-btn');
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(idx);
          });

          filesList.appendChild(card);
        });
      }
    }

    function removeFile(index) {
      if (orderState.files[index] && orderState.files[index].previewUrl) {
        try { URL.revokeObjectURL(orderState.files[index].previewUrl); } catch (e) {}
      }
      orderState.files.splice(index, 1);
      renderUploadedFiles();
    }

    if (btnClearAll) {
      btnClearAll.addEventListener('click', (e) => {
        e.preventDefault();
        orderState.files.forEach(f => {
          if (f.previewUrl) {
            try { URL.revokeObjectURL(f.previewUrl); } catch (err) {}
          }
        });
        orderState.files = [];
        fileInput.value = '';
        renderUploadedFiles();
      });
    }

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
        fileInput.value = '';
      }
    });

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('drag-over');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          addFiles(e.dataTransfer.files);
        }
      });
    }
  }

  initBriefFileUpload();

  // Initialiser les tarifs au chargement de la page
  updateOrderPricingUI();

  /* ==========================================================================
     Contact Choice Modal (Pop-up WhatsApp & Email)
     ========================================================================== */
  const contactChoiceModal = document.getElementById('contactChoiceModal');
  const contactModalClose = document.getElementById('contactModalClose');
  const contactModalBackdrop = document.getElementById('contactModalBackdrop');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailText = document.getElementById('copyEmailText');

  function openContactModal() {
    if (!contactChoiceModal) return;
    contactChoiceModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeContactModal() {
    if (!contactChoiceModal) return;
    contactChoiceModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Ouvrir la pop-up sur tous les boutons "Me contacter"
  document.querySelectorAll('.open-contact-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  if (contactModalClose) {
    contactModalClose.addEventListener('click', closeContactModal);
  }

  if (contactModalBackdrop) {
    contactModalBackdrop.addEventListener('click', closeContactModal);
  }

  // Fermer la modal avec la touche Échap
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactChoiceModal && contactChoiceModal.classList.contains('active')) {
      closeContactModal();
    }
  });

  // Copie rapide de l'adresse email dans le presse-papier avec feedback visuel
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        copyEmailBtn.classList.add('copied');
        if (copyEmailText) copyEmailText.textContent = "Email copié !";
        setTimeout(() => {
          copyEmailBtn.classList.remove('copied');
          if (copyEmailText) copyEmailText.textContent = "Copier l'adresse email";
        }, 2200);
      }).catch(() => {
        prompt("Copiez l'adresse email d'Olivier :", CONTACT_EMAIL);
      });
    });
  }

  /* ==========================================================================
     Fast Contact Form & Direct Actions
     ========================================================================== */
  const fastContactForm = document.getElementById('fastContactForm');
  if (fastContactForm) {
    fastContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim() || 'Client';
      const channel = document.getElementById('contactChannel').value;
      const coords = document.getElementById('contactCoords').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (channel === 'Email') {
        const emailSubject = `Nouveau message de ${name} (Site Auren Créatif)`;
        const emailBody = `Bonjour Olivier,\n\n` +
          `Nom : ${name}\n` +
          `Coordonnées : ${coords}\n` +
          `Canal préféré : Email\n\n` +
          `Message :\n${message}\n`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(gmailUrl, '_blank');
        alert("La rédaction d'un nouveau message Gmail s'ouvre pour envoyer votre message directement à Olivier (aurencreatif@gmail.com).");
      } else {
        const waText = `Bonjour Olivier (Auren Créatif) !\n` +
          `Nouveau message depuis le formulaire du site :\n` +
          `👤 *Nom :* ${name}\n` +
          `📞 *Contact (${channel}) :* ${coords}\n` +
          `💬 *Message :*\n${message}`;

        const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
        alert("Merci pour votre message ! La conversation WhatsApp s'ouvre pour échanger directement avec Olivier.");
      }

      fastContactForm.reset();
    });
  }

  // Anciens liens directs WhatsApp (ex: footer)
  document.querySelectorAll('.open-wa-direct').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultText = "Bonjour Olivier ! Je vous contacte via votre site internet Auren Créatif pour un projet de design graphique.";
      window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(defaultText)}`, '_blank');
    });
  });

  /* ==========================================================================
     Interactive Animations: Stats Counter, Services & Processus Scroll Reveal
     ========================================================================== */

  // Smooth cubic ease-out counter
  function animateCounter(element, target, duration = 1600) {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: swift start with a smooth decelerating landing
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(start + (target - start) * easeOutProgress);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Stats Section Animated Count-Up
  function initStatsCounter() {
    const statsSection = document.getElementById('statsSection');
    if (!statsSection) return;

    const statItems = statsSection.querySelectorAll('.stat-item[data-counter="true"]');
    let hasAnimated = false;

    const startAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      statItems.forEach((item, index) => {
        const counterEl = item.querySelector('.counter-number');
        const target = parseInt(item.getAttribute('data-target'), 10);
        if (!counterEl || isNaN(target)) {
          item.classList.add('revealed');
          return;
        }

        setTimeout(() => {
          item.classList.add('revealed');
          counterEl.textContent = '0';
          const duration = target >= 200 ? 1700 : target >= 50 ? 1400 : 1000;
          animateCounter(counterEl, target, duration);
        }, index * 120);
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAnimation();
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
      });

      observer.observe(statsSection);
    } else {
      startAnimation();
    }
  }

  // Scroll Reveals for Services Marketplace & 4-Step Process
  function initScrollReveals() {
    const revealSections = [
      { containerSelector: '.services-grid', itemSelector: '.service-card', staggerDelay: 90 },
      { containerSelector: '.steps-grid', itemSelector: '.step-card', staggerDelay: 130 }
    ];

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.service-card, .step-card, .stat-item').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    revealSections.forEach(({ containerSelector, itemSelector, staggerDelay }) => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const items = container.querySelectorAll(itemSelector);
      let revealed = false;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !revealed) {
            revealed = true;
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('revealed');
              }, index * staggerDelay);
            });
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      observer.observe(container);
    });

    // Safety fallback: after 2.5s, reveal all cards in case scroll listener didn't trigger
    setTimeout(() => {
      document.querySelectorAll('.service-card, .step-card, .stat-item').forEach(el => {
        if (!el.classList.contains('revealed')) {
          el.classList.add('revealed');
        }
      });
    }, 2500);
  }

  /* ==========================================================================
     Legal Documents Modal Controller (Internationalisé & Multi-onglets)
     ========================================================================== */
  const legalModal = document.getElementById('legalModal');
  const legalModalClose = document.getElementById('legalModalClose');
  const legalModalBackdrop = document.getElementById('legalModalBackdrop');
  const legalModalOkBtn = document.getElementById('legalModalOkBtn');
  const legalTabs = document.querySelectorAll('.legal-tab-btn');
  const legalPanels = document.querySelectorAll('.legal-tab-panel');

  function openLegalModal(tabKey = 'mentions') {
    if (!legalModal) return;
    switchLegalTab(tabKey);
    legalModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function switchLegalTab(tabKey) {
    legalTabs.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', match);
    });
    legalPanels.forEach(panel => {
      const match = panel.id === `panel-${tabKey}`;
      panel.classList.toggle('active', match);
    });
    const activePanel = document.getElementById(`panel-${tabKey}`);
    if (activePanel) {
      const modalBody = activePanel.closest('.legal-modal-body');
      if (modalBody) modalBody.scrollTop = 0;
    }
  }

  legalTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchLegalTab(tab);
    });
  });

  document.querySelectorAll('.open-legal-modal').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabKey = link.getAttribute('data-legal-tab') || 'mentions';
      openLegalModal(tabKey);
    });
  });

  if (legalModalClose) legalModalClose.addEventListener('click', closeLegalModal);
  if (legalModalBackdrop) legalModalBackdrop.addEventListener('click', closeLegalModal);
  if (legalModalOkBtn) legalModalOkBtn.addEventListener('click', closeLegalModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && legalModal.classList.contains('active')) {
      closeLegalModal();
    }
  });

  // Initialize animations
  initStatsCounter();
  initScrollReveals();

  // Initial step setup
  updateProgressBar();
});
