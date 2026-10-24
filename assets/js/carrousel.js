/**
 * AUREN CRÉATIF · Carrousels mobiles (chiffres clés et témoignages)
 * Sur téléphone, les cartes défilent toutes seules. Le client peut aussi les
 * faire glisser au doigt : le défilement automatique s'arrête alors, puis
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
    points.setAttribute('aria-label', nom);
    cartes.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${nom} : élément ${i + 1} sur ${cartes.length}`);
      b.addEventListener('click', () => { pause(); aller(i); });
      points.appendChild(b);
    });
    piste.after(points);

    let enPauseJusqua = 0;

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
      [...points.children].forEach((b, j) => b.classList.toggle('actif', j === i));
    };

    function aller(i) {
      const c = cartes[i];
      const decalage = c.getBoundingClientRect().left - piste.getBoundingClientRect().left;
      piste.scrollTo({
        left: piste.scrollLeft + decalage - (piste.clientWidth - c.offsetWidth) / 2,
        behavior: mouvementReduit.matches ? 'auto' : 'smooth'
      });
    }

    // Le carrousel est-il à l'écran ? (mesuré directement, sans dépendre du navigateur)
    const aLEcran = () => {
      const r = piste.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight && r.height > 0;
    };

    // Le client touche ou fait glisser : on le laisse faire, puis on reprend
    const pause = () => { enPauseJusqua = Date.now() + REPRISE; };
    ['pointerdown', 'touchstart', 'touchmove', 'wheel', 'keydown'].forEach(ev => piste.addEventListener(ev, pause, { passive: true }));
    piste.addEventListener('scroll', majPoints, { passive: true });
    window.addEventListener('resize', majPoints);

    // Un seul minuteur, toujours actif : il avance quand c'est le moment
    setInterval(() => {
      if (!mobile.matches || Date.now() < enPauseJusqua || !aLEcran()) return;
      aller((actuelle() + 1) % cartes.length);
    }, INTERVALLE);

    majPoints();
  }

  const stats = document.querySelector('.stats-grid');
  const avis = document.querySelector('.testimonials-grid');
  if (stats) carrousel(stats, 'Chiffres clés');
  if (avis) carrousel(avis, 'Témoignages');
});
