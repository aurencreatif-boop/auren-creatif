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

  function afficherQuota(restantes) {
    $('rtQuota').innerHTML = restantes > 0
      ? `<i class="fa-solid fa-gift"></i> <strong>${restantes} retouche${restantes > 1 ? 's' : ''} offerte${restantes > 1 ? 's' : ''}</strong> sur 2 après la livraison.`
      : '<i class="fa-solid fa-circle-info"></i> Vos 2 retouches offertes sont utilisées. Pour une nouvelle modification, écrivez à Olivier sur WhatsApp : il vous propose un petit tarif.';
    $('rtRetoucheChamps').hidden = restantes <= 0;
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
      afficherQuota(info.restantes);
      if (info.avis) avisTermine('Merci, votre avis a bien été reçu !');
      if (!info.livre) {
        document.querySelector('.rt-hero h1').textContent = 'Votre projet AUREN CRÉATIF';
        $('rtRetoucheChamps').hidden = true;
        $('rtQuota').textContent = 'Votre projet n’est pas encore livré : pour une modification sur l’aperçu, répondez à Olivier sur WhatsApp (deux tours inclus).';
      }
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
      message('rtOk', 'C’est noté ! Olivier a reçu votre demande et vous renvoie votre fichier corrigé par e-mail.');
    } catch (err) {
      message('rtError', err.message && !/Failed to fetch/i.test(err.message) ? err.message : 'L’envoi n’a pas abouti. Vérifiez votre connexion puis réessayez.');
    }
    bouton.disabled = false;
    bouton.innerHTML = '<i class="fa-solid fa-pen-ruler"></i> Envoyer ma demande de retouche';
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
