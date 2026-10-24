/**
 * AUREN CRÉATIF · Carrousels mobiles (chiffres clés et témoignages)
 * Sur téléphone, les cartes défilent toutes seules. Dès que le client touche
 * ou fait glisser le carrousel, le défilement automatique s'arrête, puis
 * reprend quelques secondes après sa dernière action.
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobile = window.matchMedia('(max-width: 600px)');
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVALLE = 3500;      // temps d'affichage de chaque carte
  const REPRISE = 6000;         // reprise après une action du client

  function carrousel(piste, nom) {
    const cartes = [...piste.children];
    if (cartes.length < 2) return;

    // Points de position sous le carrousel (cliquables)
    const points = document.createElement('div');
    points.className = 'carrousel-points';
    points.setAttribute('role', 'tablist');
    points.setAttribute('aria-label', nom);
    cartes.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${nom} : élément ${i + 1} sur ${cartes.length}`);
      b.addEventListener('click', () => { pause(); aller(i); });
      points.appendChild(b);
    });
    piste.after(points);

    let minuteur = null, reprise = null, visible = false;

    // Carte la plus proche du centre de la piste
    const actuelle = () => {
      const centre = piste.getBoundingClientRect().left + piste.clientWidth / 2;
      let meilleure = 0, ecart = Infinity;
      cartes.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - centre);
        if (d < ecart) { ecart = d; meilleure = i; }
      });
      return meilleure;
    };

    const majPoints = () => {
      const i = actuelle();
      [...points.children].forEach((b, j) => {
        b.classList.toggle('actif', j === i);
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
    };

    function aller(i) {
      const c = cartes[i];
      const decalage = c.getBoundingClientRect().left - piste.getBoundingClientRect().left;
      piste.scrollTo({ left: piste.scrollLeft + decalage - (piste.clientWidth - c.offsetWidth) / 2, behavior: mouvementReduit.matches ? 'auto' : 'smooth' });
    }

    const actif = () => mobile.matches && !mouvementReduit.matches && visible && !document.hidden;

    function demarrer() {
      clearInterval(minuteur);
      minuteur = null;
      if (!actif()) return;
      minuteur = setInterval(() => aller((actuelle() + 1) % cartes.length), INTERVALLE);
    }

    // Le client prend la main : on arrête, puis on reprend plus tard
    function pause() {
      clearInterval(minuteur);
      minuteur = null;
      clearTimeout(reprise);
      reprise = setTimeout(demarrer, REPRISE);
    }

    // Seul un geste du client met en pause (le défilement automatique, lui, ne compte pas)
    ['pointerdown', 'touchstart', 'wheel', 'keydown', 'focusin'].forEach(ev => piste.addEventListener(ev, pause, { passive: true }));
    piste.addEventListener('scroll', majPoints, { passive: true });

    // Défile seulement quand le carrousel est à l'écran
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; demarrer(); }, { threshold: 0.4 }).observe(piste);
    } else {
      visible = true;
    }
    document.addEventListener('visibilitychange', demarrer);
    mobile.addEventListener('change', demarrer);
    window.addEventListener('resize', majPoints);
    majPoints();
    demarrer();
  }

  const stats = document.querySelector('.stats-grid');
  const avis = document.querySelector('.testimonials-grid');
  if (stats) carrousel(stats, 'Chiffres clés');
  if (avis) carrousel(avis, 'Témoignages');
});
