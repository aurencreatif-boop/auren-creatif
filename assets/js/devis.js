/**
 * AUREN CRÉATIF · Service VIP (projets de plus de 100 000 FCFA)
 * Le client décrit son projet, la demande est enregistrée par le script Google,
 * puis il réserve sa consultation (10 000 FCFA) sur Chariow, référence déjà remplie.
 */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const PRIX = 10000;
  let reference = null;

  const nouvelleReference = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return 'SM-' + [...crypto.getRandomValues(new Uint8Array(6))].map(b => alphabet[b % alphabet.length]).join('');
  };

  const lienPaiement = () => {
    const lien = CONFIG.CONSULTATION_LINK || '';
    return lien ? `${lien}${lien.includes('?') ? '&' : '?'}reference=${encodeURIComponent(reference)}` : '';
  };

  function erreur(msg) { $('dError').hidden = !msg; $('dError').textContent = msg; }

  function fenetre({ icon, title, text, ref, actions }) {
    $('overlay').hidden = false;
    $('ovIcon').innerHTML = icon;
    $('ovTitle').textContent = title;
    $('ovText').textContent = text;
    $('ovRef').hidden = !ref;
    $('ovRef').innerHTML = ref ? `
      <span class="order-ref-label">Votre référence de projet</span>
      <span class="order-ref-code"><strong>${ref}</strong>
        <button type="button" class="order-ref-copy" data-copy="${ref}"><i class="fa-regular fa-copy"></i> Copier</button></span>
      <span class="order-ref-note"><i class="fa-solid fa-camera"></i> Gardez-la précieusement (faites une capture d’écran) : elle sert à suivre votre projet.</span>` : '';
    $('ovActions').innerHTML = actions || '';
  }

  function valider() {
    for (const id of ['dType', 'dBudget', 'dQuand', 'dProjet', 'dDescription', 'dNom', 'dTel', 'dEmail']) {
      if (!$(id).value.trim()) { $(id).focus(); return 'Merci de remplir tous les champs marqués d’un astérisque.'; }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('dEmail').value.trim())) { $('dEmail').focus(); return 'Adresse e-mail invalide.'; }
    if ($('dTel').value.replace(/\D/g, '').length < 8) { $('dTel').focus(); return 'Numéro de téléphone invalide : ajoutez l’indicatif du pays.'; }
    if (!$('dConsent').checked) return 'Merci d’accepter les conditions pour continuer.';
    return '';
  }

  $('devisForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = valider();
    erreur(err);
    if (err) return;
    if (!reference) reference = nouvelleReference();

    const demande = {
      action: 'order',
      type: 'devis',
      reference,
      serviceKey: 'projet_sur_mesure',
      service: `Service VIP · ${$('dType').value}`,
      delai: $('dQuand').value,
      livraisonTexte: 'à définir ensemble',
      total: PRIX, acompte: PRIX, solde: 0,
      options: [], optionKeys: [],
      payLink: lienPaiement(),
      projet: $('dProjet').value.trim(),
      destination: `Budget : ${$('dBudget').value}`,
      textes: $('dDescription').value.trim(),
      style: '', dimensions: '', infos: '',
      lien: $('dLien').value.trim(),
      nom: $('dNom').value.trim(),
      whatsapp: $('dTel').value.trim(),
      email: $('dEmail').value.trim(),
      website: $('dWebsite').value
    };

    $('dSubmit').disabled = true;
    fenetre({ icon: '<i class="fa-solid fa-spinner fa-spin"></i>', title: 'Envoi de votre demande…', text: 'Merci de patienter quelques secondes.' });

    try {
      if (!CONFIG.ORDER_ENDPOINT) throw new Error('Service indisponible');
      const res = await fetch(CONFIG.ORDER_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(demande) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur');
      fenetre({
        icon: '<i class="fa-solid fa-circle-check"></i>',
        title: 'Plus qu’une étape !',
        text: `Votre demande est enregistrée et un récapitulatif a été envoyé à ${demande.email}. Réservez votre consultation VIP : Olivier vous contacte en priorité sous 24 h ouvrées.`,
        ref: reference,
        actions: (demande.payLink ? `<a class="btn btn-primary btn-lg" href="${demande.payLink}"><i class="fa-solid fa-lock"></i> Réserver ma consultation VIP · 10 000 FCFA</a>
          <p class="order-pay-note">Paiement sécurisé par Chariow</p>
          <p class="order-ref-rappel"><i class="fa-solid fa-circle-exclamation"></i> Dans Chariow, vérifiez que le champ « Référence » indique bien <strong>${reference}</strong>. Sinon, corrigez-le avant de payer.</p>` : '') +
          `<button type="button" class="order-link-btn" data-close>Modifier ma demande</button>`
      });
    } catch (error) {
      $('dSubmit').disabled = false;
      fenetre({
        icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
        title: 'La demande n’a pas pu être envoyée',
        text: 'Vérifiez votre connexion internet, puis réessayez. Vos informations sont conservées.',
        actions: '<button type="button" class="btn btn-primary" data-close>Réessayer</button>'
      });
    }
  });

  $('overlay').addEventListener('click', (e) => {
    const copie = e.target.closest('[data-copy]');
    if (copie && navigator.clipboard) navigator.clipboard.writeText(copie.dataset.copy).then(() => { copie.innerHTML = '<i class="fa-solid fa-check"></i> Copiée'; });
    if (e.target.closest('[data-close]')) $('overlay').hidden = true;
  });
});
