/**
 * AUREN CRÉATIF · Réalisations regroupées par catégorie
 * Chaque catégorie montre ses premiers visuels ; « Voir plus » affiche tous
 * les visuels de cette catégorie (les cartes gardent leur agrandissement).
 */
document.addEventListener('DOMContentLoaded', () => {
  const source = document.getElementById('portfolioSource');
  if (!source) return;

  const GROUPES = [
    ['affiches-pub', 'Affiches & Publicité', 'fa-bullhorn'],
    ['affiches-evenements', 'Affiches & Événements', 'fa-champagne-glasses'],
    ['flyers', 'Flyers & Promotions', 'fa-file-lines'],
    ['branding', 'Branding & Logos', 'fa-bullseye'],
    ['print', 'Carte de visite & Print', 'fa-id-card'],
    ['motion', 'Motion design & 3D', 'fa-film'],
    ['social', 'Réseaux sociaux', 'fa-hashtag']
  ];
  // Visuels montrés avant « Voir plus » : une rangée complète, selon la largeur de l'écran
  const visibles = grille => Math.max(1, getComputedStyle(grille).gridTemplateColumns.split(' ').filter(Boolean).length);

  const items = [...source.querySelectorAll('.portfolio-item')];
  const conteneur = document.createElement('div');
  conteneur.className = 'portfolio-groupes';
  const boutons = [];

  GROUPES.forEach(([cle, titre, icone]) => {
    const dansGroupe = items.filter(i => i.dataset.category === cle);
    if (!dansGroupe.length) return;

    const groupe = document.createElement('section');
    groupe.className = 'portfolio-groupe';
    groupe.innerHTML = `
      <div class="portfolio-groupe-tete">
        <h3><i class="fa-solid ${icone}"></i> ${titre}</h3>
        <span class="portfolio-groupe-nb">${dansGroupe.length} visuel${dansGroupe.length > 1 ? 's' : ''}</span>
      </div>`;
    const grille = document.createElement('div');
    grille.className = 'portfolio-grid';
    dansGroupe.forEach(i => grille.appendChild(i));
    groupe.appendChild(grille);

    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'portfolio-voir-plus';
    bouton.addEventListener('click', () => {
      const ouvert = groupe.classList.toggle('ouvert');
      majBouton(bouton, dansGroupe, grille, ouvert);
      if (!ouvert) groupe.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    groupe.appendChild(bouton);
    boutons.push([bouton, dansGroupe, groupe, grille]);
    conteneur.appendChild(groupe);
  });

  function majBouton(bouton, cartes, grille, ouvert) {
    const n = visibles(grille);
    cartes.forEach((c, i) => c.classList.toggle('en-plus', i >= n));
    const caches = cartes.length - n;
    bouton.hidden = caches <= 0;
    bouton.innerHTML = ouvert
      ? '<i class="fa-solid fa-chevron-up"></i> Voir moins'
      : `<i class="fa-solid fa-chevron-down"></i> Voir plus <span>(${caches} autre${caches > 1 ? 's' : ''})</span>`;
  }
  const majTout = () => boutons.forEach(([b, cartes, g, grille]) => majBouton(b, cartes, grille, g.classList.contains('ouvert')));

  source.replaceWith(conteneur);
  majTout();
  let attente;
  window.addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(majTout, 150); });
});
