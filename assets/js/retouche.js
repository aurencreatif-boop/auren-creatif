/**
 * AUREN CRÉATIF · Après la livraison : demande de retouche et avis du client
 * Le client arrive depuis l'e-mail de livraison (retouche.html?ref=AC-XXXXXX).
 * Les demandes sont enregistrées par le script Google et apparaissent dans l'espace privé.
 */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const MAX_FICHIERS = 3;
  const MAX_OCTETS = 8 * 1024 * 1024;
  let reference = '';

  $('rtWa').href = `https://wa.me/${CONFIG.WA_NUMBER}`;

  const appel = async (donnees) => {
    const res = await fetch(CONFIG.ORDER_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(donnees) });
    const j = await res.json();
    if (!j.ok) throw new Error(j.error || 'Erreur');
    return j;
  };

  const message = (id, texte) => { $(id).hidden = !texte; $(id).textContent = texte || ''; };

  const lireFichier = (f) => new Promise((ok, ko) => {
    const r = new FileReader();
    r.onload = () => ok({ name: f.name, type: f.type || 'application/octet-stream', data: String(r.result).split(',')[1] });
    r.onerror = ko;
    r.readAsDataURL(f);
  });

  let etape = 'livre', offertes = 2;
  // Textes selon l'étape : modification de l'aperçu (avant le solde) ou retouche (après la livraison)
  const mot = () => etape === 'apercu' ? 'modification' : 'retouche';
  const boutonTexte = () => `<i class="fa-solid fa-pen-ruler"></i> Envoyer ma demande de ${mot()}`;

  function afficherQuota(restantes) {
    const quand = etape === 'apercu' ? 'sur l’aperçu, avant le paiement du solde' : 'après la livraison';
    $('rtQuota').innerHTML = restantes > 0
      ? `<i class="fa-solid fa-gift"></i> <strong>${restantes} ${mot()}${restantes > 1 ? 's' : ''} incluse${restantes > 1 ? 's' : ''}</strong> sur ${offertes} ${quand}.`
      : `<i class="fa-solid fa-circle-info"></i> Vos ${offertes} ${mot()}s incluses sont utilisées. Vous pouvez quand même en demander une autre ici : elle est payante, et Olivier vous envoie le tarif par e-mail avant de commencer.`;
    $('rtQuota').classList.toggle('rt-quota-plus', restantes <= 0);
  }

  function preparerEtape(info) {
    etape = info.etape || (info.livre ? 'livre' : 'attente');
    offertes = info.offertes || 2;
    const titre = $('rtForm').querySelector('h2');
    if (etape === 'apercu') {
      document.querySelector('.rt-hero h1').textContent = 'Votre aperçu est prêt 👀';
      document.querySelector('.rt-hero p').textContent = 'Quelque chose à changer avant la version finale ? Dites-le ici.';
      titre.innerHTML = '<span class="order-num">1</span> Demander une modification de l’aperçu';
      $('rtTexte').placeholder = 'Ex. : changer la couleur du titre en rouge, corriger l’adresse, agrandir le logo…';
    } else if (etape === 'attente') {
      document.querySelector('.rt-hero h1').textContent = 'Votre projet AUREN CRÉATIF';
      document.querySelector('.rt-hero p').textContent = 'Olivier travaille sur votre création.';
      titre.innerHTML = '<span class="order-num">1</span> Demander une modification';
    }
    $('rtEnvoyer').innerHTML = boutonTexte();
    $('rtRetoucheChamps').hidden = etape === 'attente';
    if (etape === 'attente') {
      $('rtQuota').innerHTML = '<i class="fa-solid fa-hourglass-half"></i> Votre aperçu n’est pas encore prêt. Dès que vous le recevez par e-mail, revenez ici pour demander une modification (2 incluses).';
    } else {
      afficherQuota(info.restantes);
    }
    // L'avis se donne une fois le projet livré
    $('avForm').hidden = etape !== 'livre';
  }

  // Avis envoyé : on ne garde que le titre et le remerciement
  function avisTermine(texte) {
    [...$('avForm').children].forEach(el => { if (el.tagName !== 'H2' && el.id !== 'avOk') el.hidden = true; });
    message('avOk', texte);
  }

  async function charger(ref) {
    message('rtRefError', '');
    try {
      const info = await appel({ action: 'retour-info', reference: ref });
      reference = ref;
      $('rtRefCard').hidden = true;
      $('rtContenu').hidden = false;
      $('rtProjet').hidden = false;
      $('rtProjet').textContent = `${ref} · ${info.service}`;
      preparerEtape(info);
      if (info.avis) avisTermine('Merci, votre avis a bien été reçu !');
    } catch (e) {
      $('rtRefCard').hidden = false;
      message('rtRefError', e.message === 'Commande introuvable'
        ? 'Référence introuvable. Vérifiez-la dans vos e-mails (ex. AC-7K2P9M).'
        : 'Connexion impossible pour le moment. Vérifiez votre connexion internet puis réessayez.');
    }
  }

  // Retouche
  $('rtForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    message('rtError', ''); message('rtOk', '');
    const texte = $('rtTexte').value.trim();
    if (texte.length < 5) { $('rtTexte').focus(); message('rtError', 'Décrivez en quelques mots ce qu’il faut changer.'); return; }
    const choisis = [...$('rtFichiers').files];
    if (choisis.length > MAX_FICHIERS) { message('rtError', `${MAX_FICHIERS} fichiers maximum.`); return; }
    if (choisis.some(f => f.size > MAX_OCTETS)) { message('rtError', 'Un fichier est trop lourd (8 Mo maximum par fichier).'); return; }

    const bouton = $('rtEnvoyer');
    bouton.disabled = true;
    bouton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';
    try {
      const r = await appel({ action: 'retour', type: 'retouche', reference, texte, files: await Promise.all(choisis.map(lireFichier)), website: $('rtWebsite').value });
      $('rtTexte').value = ''; $('rtFichiers').value = '';
      afficherQuota(r.restantes);
      message('rtOk', r.enPlus
        ? 'C’est noté ! Cette demande dépasse les modifications incluses : Olivier vous envoie le tarif par e-mail avant de commencer.'
        : `C’est noté ! Olivier a reçu votre demande et vous renvoie ${etape === 'apercu' ? 'un nouvel aperçu' : 'votre fichier corrigé'} par e-mail.`);
    } catch (err) {
      message('rtError', err.message && !/Failed to fetch/i.test(err.message) ? err.message : 'L’envoi n’a pas abouti. Vérifiez votre connexion puis réessayez.');
    }
    bouton.disabled = false;
    bouton.innerHTML = boutonTexte();
  });

  // Avis
  $('avForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    message('avError', '');
    const note = Number(($('avForm').querySelector('input[name=note]:checked') || {}).value || 0);
    if (!note) { message('avError', 'Choisissez une note en cliquant sur les étoiles.'); return; }
    const bouton = $('avEnvoyer');
    bouton.disabled = true;
    try {
      await appel({ action: 'retour', type: 'avis', reference, note, texte: $('avTexte').value.trim(), publier: $('avPublier').checked, website: $('rtWebsite').value });
      avisTermine('Merci beaucoup pour votre avis ! 💙');
    } catch (err) {
      bouton.disabled = false;
      message('avError', err.message && !/Failed to fetch/i.test(err.message) ? err.message : 'L’envoi n’a pas abouti. Vérifiez votre connexion puis réessayez.');
    }
  });

  $('rtRefOk').addEventListener('click', () => {
    const ref = $('rtRef').value.trim().toUpperCase();
    if (!/^(AC|SM)-[A-Z0-9]{6}$/.test(ref)) { message('rtRefError', 'Format attendu : AC- suivi de 6 caractères (ex. AC-7K2P9M).'); return; }
    charger(ref);
  });
  $('rtRef').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('rtRefOk').click(); });

  const refUrl = (new URLSearchParams(location.search).get('ref') || '').toUpperCase();
  if (/^(AC|SM)-[A-Z0-9]{6}$/.test(refUrl)) charger(refUrl);
  else $('rtRefCard').hidden = false;
});
