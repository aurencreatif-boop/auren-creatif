/**
 * AUREN CRÉATIF · Page de commande
 * Le client remplit son brief, ajoute ses fichiers, puis :
 *   1. la commande est enregistrée (script Google : Sheet + Drive + e-mails) ;
 *   2. il est redirigé vers le lien Chariow de son service et de son délai (50 %).
 * Sans script Google configuré, la page propose d’écrire par e-mail (aucun faux envoi).
 */
document.addEventListener('DOMContentLoaded', () => {
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo par fichier
  const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25 Mo au total

  const $ = (id) => document.getElementById(id);
  const fmtFcfa = (v) => `${v.toLocaleString('fr-FR')} FCFA`;
  const fmtEur = (v) => `≈ ${Math.round(v / PRICING.taux).toLocaleString('fr-FR')} €`;
  const roundFcfa = (v) => Math.round(v / 500) * 500;

  const params = new URLSearchParams(location.search);
  const state = {
    serviceKey: PRICING.services[params.get('service')] ? params.get('service') : 'affiche_simple',
    delaiKey: 'standard',
    options: new Set(),
    files: [],
    reference: null
  };

  /* ---------- Construction de l'interface ---------- */
  const serviceSelect = $('serviceSelect');
  Object.entries(PRICING.services).forEach(([key, srv]) => {
    serviceSelect.add(new Option(`${srv.nom} · dès ${fmtFcfa(roundFcfa(srv.fcfa * 0.9))}`, key));
  });
  serviceSelect.value = state.serviceKey;
  serviceSelect.addEventListener('change', () => {
    state.serviceKey = serviceSelect.value;
    history.replaceState(null, '', `?service=${state.serviceKey}`);
    renderDelais();
    majFormat();
    update();
  });

  function renderDelais() {
    const delais = getDelaisFor(state.serviceKey);
    if (!delais[state.delaiKey]) state.delaiKey = 'standard';
    const srv = PRICING.services[state.serviceKey];
    $('delaiGroup').innerHTML = Object.entries(delais).map(([key, d]) => `
      <label class="order-delai ${key === state.delaiKey ? 'is-selected' : ''}">
        <input type="radio" name="delai" value="${key}" ${key === state.delaiKey ? 'checked' : ''}>
        <span class="order-delai-name">${d.libelle}</span>
        <span class="order-delai-price">${fmtFcfa(roundFcfa(srv.fcfa * d.coeff))}</span>
        <span class="order-delai-badge">${d.badge}</span>
      </label>`).join('');
    $('delaiGroup').querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        state.delaiKey = input.value;
        renderDelais();
        update();
      });
    });
  }

  /* ---------- Choix de la taille (dessins adaptés à chaque service) ---------- */
  const FORMATS = {
    affiche: { label: 'Taille de l’affiche', titre: 'Quelle taille pour votre affiche ?', items: [
      { nom: 'A4', desc: '21 × 29,7 cm · feuille classique', w: 21, h: 29.7, s: 44 },
      { nom: 'A3', desc: '29,7 × 42 cm · affiche murale', w: 29.7, h: 42, s: 56 },
      { nom: 'A2', desc: '42 × 59,4 cm · grande affiche', w: 42, h: 59.4, s: 70 },
      { nom: 'Panneau 4 × 3 m', desc: 'publicité en extérieur', w: 4, h: 3 },
      { nom: 'Statut WhatsApp', desc: 'à partager sur téléphone', w: 9, h: 16 },
      { nom: 'Carré', desc: 'publication Facebook, Instagram', w: 1, h: 1 }] },
    flyer: { label: 'Taille du flyer', titre: 'Quelle taille pour votre flyer ?', items: [
      { nom: 'A6', desc: '10,5 × 14,8 cm · petit flyer', w: 10.5, h: 14.8, s: 38 },
      { nom: 'A5', desc: '14,8 × 21 cm · flyer classique', w: 14.8, h: 21, s: 50 },
      { nom: 'A4', desc: '21 × 29,7 cm · grand flyer', w: 21, h: 29.7, s: 64 },
      { nom: 'Format long', desc: '10 × 21 cm · menu, programme', w: 10, h: 21 },
      { nom: 'Statut WhatsApp', desc: 'version téléphone', w: 9, h: 16 },
      { nom: 'Carré', desc: 'publication Facebook, Instagram', w: 1, h: 1 }] },
    reseaux: { label: 'Format', titre: 'Où sera publié votre visuel ?', items: [
      { nom: 'Carré', desc: 'publication Facebook, Instagram', w: 1, h: 1 },
      { nom: 'Portrait', desc: 'publication Instagram plus haute', w: 4, h: 5 },
      { nom: 'Statut / story', desc: 'statut WhatsApp, story Instagram', w: 9, h: 16 },
      { nom: 'Paysage', desc: 'couverture Facebook, YouTube', w: 16, h: 9 }] },
    carte: { label: 'Sens de la carte', titre: 'Quel modèle de carte de visite ?', items: [
      { nom: 'Horizontale', desc: '8,5 × 5,5 cm · la plus courante', w: 8.5, h: 5.5 },
      { nom: 'Verticale', desc: '5,5 × 8,5 cm · originale', w: 5.5, h: 8.5 },
      { nom: 'Carrée', desc: '6,5 × 6,5 cm · moderne', w: 6.5, h: 6.5 }] },
    logo: { label: 'Forme du logo', titre: 'Quelle forme pour votre logo ?', items: [
      { nom: 'Carré ou rond', desc: 'photo de profil, tampon', w: 1, h: 1 },
      { nom: 'Horizontal', desc: 'enseigne, en-tête, site', w: 3, h: 1 },
      { nom: 'Vertical', desc: 'symbole au-dessus du nom', w: 3, h: 4 }] },
    video: { label: 'Format de la vidéo', titre: 'Où sera diffusée votre animation ?', items: [
      { nom: 'Statut / story', desc: 'WhatsApp, Instagram, TikTok', w: 9, h: 16 },
      { nom: 'Carré', desc: 'publication Facebook, Instagram', w: 1, h: 1 },
      { nom: 'Paysage', desc: 'YouTube, écran, présentation', w: 16, h: 9 }] }
  };
  const GROUPE = {
    affiche_simple: 'affiche', affiche_premium: 'affiche', flyer_recto: 'flyer', flyer_rectoverso: 'flyer',
    visuel_reseaux: 'reseaux', pack_5_visuels: 'reseaux', carte_visite: 'carte',
    logo_simple: 'logo', identite_complete: 'logo', motion_design: 'video'
  };
  const JE_NE_SAIS_PAS = 'Je ne sais pas · Olivier me conseillera';

  function forme(w, h, max) {
    const ratio = w / h;
    const width = ratio >= 1 ? max : Math.round(max * ratio);
    const height = ratio >= 1 ? Math.round(max / ratio) : max;
    return `<span class="fmt-paper" style="width:${width}px;height:${height}px"></span>`;
  }

  function choisirFormat(item) {
    $('fDimensions').value = item ? `${item.nom} (${item.desc})` : JE_NE_SAIS_PAS;
    $('formatName').textContent = item ? item.nom : 'Je ne sais pas';
    $('formatDesc').textContent = item ? item.desc : 'Olivier vous conseillera';
    $('formatPreview').innerHTML = item ? forme(item.w, item.h, 28) : '<i class="fa-solid fa-circle-question"></i>';
    $('formatBtn').classList.add('is-chosen');
  }

  function majFormat() {
    const g = FORMATS[GROUPE[state.serviceKey]];
    $('formatLabel').textContent = g.label;
    $('fDimensions').value = '';
    $('formatName').textContent = 'Choisir';
    $('formatDesc').textContent = 'Touchez pour voir les tailles possibles';
    $('formatPreview').innerHTML = '<i class="fa-solid fa-ruler-combined"></i>';
    $('formatBtn').classList.remove('is-chosen');
  }

  function ouvrirFormats() {
    const g = FORMATS[GROUPE[state.serviceKey]];
    $('fmtTitle').textContent = g.titre;
    $('formatGrid').innerHTML = g.items.map((it, i) => `
      <button type="button" class="fmt-tile" data-i="${i}">
        <span class="fmt-shape">${forme(it.w, it.h, it.s || 64)}</span>
        <strong>${it.nom}</strong><small>${it.desc}</small>
      </button>`).join('') + `
      <button type="button" class="fmt-tile fmt-tile-unknown" data-i="-1">
        <span class="fmt-shape"><i class="fa-solid fa-circle-question"></i></span>
        <strong>Je ne sais pas</strong><small>Olivier vous conseillera</small>
      </button>`;
    $('formatGrid').querySelectorAll('.fmt-tile').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.i;
        choisirFormat(i >= 0 ? g.items[i] : null);
        fermerFormats();
      });
    });
    $('formatModal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('formatGrid').querySelector('.fmt-tile').focus();
  }

  function fermerFormats() {
    $('formatModal').hidden = true;
    document.body.style.overflow = '';
    $('formatBtn').focus();
  }

  $('formatBtn').addEventListener('click', ouvrirFormats);
  $('formatModal').addEventListener('click', e => { if (e.target.closest('[data-fmt-close]')) fermerFormats(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('formatModal').hidden) fermerFormats(); });

  /* ---------- Calcul du prix ---------- */
  function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  function calc() {
    const srv = PRICING.services[state.serviceKey];
    const delai = getDelaisFor(state.serviceKey)[state.delaiKey];
    const servicePrice = roundFcfa(srv.fcfa * delai.coeff);
    const acompte = servicePrice / 2;
    const options = [...state.options].map(k => ({ key: k, ...PRICING.options[k] }));
    const optionsTotal = options.reduce((s, o) => s + o.fcfa, 0);
    const date = addDays(delai.jours);
    return {
      srv, delai, servicePrice, acompte, options, optionsTotal,
      total: servicePrice + optionsTotal,
      later: acompte + optionsTotal,
      date,
      dateText: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      payLink: (CONFIG.PAYMENT_LINKS || {})[`${state.serviceKey}|${state.delaiKey}`] || '',
      soldeLink: (CONFIG.SOLDE_LINKS || {})[`${state.serviceKey}|${state.delaiKey}`] || ''
    };
  }

  function update() {
    const c = calc();
    $('heroTitle').textContent = c.srv.nom;
    $('heroDesc').textContent = `${c.srv.desc}. Dites-nous ce que vous voulez, ajoutez vos photos et réglez 50 % pour lancer votre projet.`;
    $('heroIcon').innerHTML = `<i class="fa-solid ${c.srv.icon}"></i>`;
    document.title = `Commander · ${c.srv.nom} · AUREN CRÉATIF`;

    $('delaiNotice').hidden = !c.delai.notice;
    $('delaiNotice').textContent = c.delai.notice;

    $('sService').textContent = c.srv.nom;
    $('sDelai').textContent = c.delai.libelle;
    $('sDate').textContent = c.dateText;
    $('sOptionsRow').hidden = !c.options.length;
    $('sOptions').textContent = c.options.map(o => o.nom).join(', ');
    $('sTotal').textContent = fmtFcfa(c.total);
    $('sNow').textContent = fmtFcfa(c.acompte);
    $('sNowEur').textContent = fmtEur(c.acompte);
    $('sLater').textContent = fmtFcfa(c.later);
    $('submitLabel').textContent = `Commander et payer 50 % · ${fmtFcfa(c.acompte)}`;
  }

  /* ---------- Fichiers (galerie, appareil photo, documents) ---------- */
  const fileInput = $('fFiles');
  const dropZone = $('dropZone');
  const formatSize = (b) => b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`;

  function addFiles(list) {
    const errors = [];
    [...list].forEach(file => {
      if (state.files.length >= MAX_FILES) { errors.push(`5 fichiers maximum.`); return; }
      if (file.size > MAX_FILE_SIZE) { errors.push(`« ${file.name} » dépasse 10 Mo : envoyez-le par lien de partage.`); return; }
      const total = state.files.reduce((s, f) => s + f.size, 0) + file.size;
      if (total > MAX_TOTAL_SIZE) { errors.push(`25 Mo au total maximum : utilisez un lien de partage pour les gros fichiers.`); return; }
      if (state.files.some(f => f.name === file.name && f.size === file.size)) return;
      state.files.push(file);
    });
    renderFiles();
    showError(errors.length ? [...new Set(errors)].join(' ') : '');
  }

  function renderFiles() {
    $('fileList').innerHTML = state.files.map((f, i) => {
      const isImage = f.type.startsWith('image/');
      const thumb = isImage ? `<img src="${URL.createObjectURL(f)}" alt="">` : `<i class="fa-solid ${f.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file'}"></i>`;
      return `<li><span class="order-file-thumb">${thumb}</span><span class="order-file-name">${escapeHtml(f.name)}<small>${formatSize(f.size)}</small></span><button type="button" data-i="${i}" aria-label="Retirer ${escapeHtml(f.name)}"><i class="fa-solid fa-xmark"></i></button></li>`;
    }).join('');
    $('fileList').querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => { state.files.splice(+btn.dataset.i, 1); renderFiles(); });
    });
  }

  fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
  ['dragenter', 'dragover'].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.add('is-drag'); }));
  ['dragleave', 'drop'].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.remove('is-drag'); }));
  dropZone.addEventListener('drop', e => addFiles(e.dataTransfer.files));

  const readAsBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  /* ---------- Utilitaires ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function showError(msg) {
    $('formError').hidden = !msg;
    $('formError').textContent = msg;
  }

  function generateReference() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    return 'AC-' + [...bytes].map(b => alphabet[b % alphabet.length]).join('');
  }

  function overlay({ icon, title, text, ref, actions = '' }) {
    $('overlay').hidden = false;
    $('ovIcon').innerHTML = icon;
    $('ovTitle').textContent = title;
    $('ovText').textContent = text;
    $('ovRef').hidden = !ref;
    $('ovRef').innerHTML = ref ? `
      <span class="order-ref-label">Votre référence de commande</span>
      <span class="order-ref-code"><strong>${ref}</strong>
        <button type="button" class="order-ref-copy" data-copy="${ref}"><i class="fa-regular fa-copy"></i> Copier</button></span>
      <span class="order-ref-note"><i class="fa-solid fa-camera"></i> Gardez-la précieusement (faites une capture d’écran) : elle sert à suivre votre commande et à régler le solde.</span>` : '';
    $('ovActions').innerHTML = actions;
  }

  /* ---------- Validation et envoi ---------- */
  function validate() {
    const required = ['fProjet', 'fTextes', 'fNom', 'fWhatsapp', 'fEmail'];
    for (const id of required) {
      const el = $(id);
      if (!el.value.trim()) { el.focus(); return 'Merci de remplir tous les champs marqués d’un astérisque.'; }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('fEmail').value.trim())) { $('fEmail').focus(); return 'Adresse e-mail invalide : elle sert à vous envoyer votre projet.'; }
    if ($('fWhatsapp').value.replace(/\D/g, '').length < 8) { $('fWhatsapp').focus(); return 'Numéro de téléphone invalide : ajoutez l’indicatif du pays.'; }
    if (!$('fConsent').checked) return 'Merci d’accepter les conditions pour continuer.';
    return '';
  }

  function buildOrder(c) {
    return {
      action: 'order',
      reference: state.reference,
      serviceKey: state.serviceKey,
      service: c.srv.nom,
      delaiKey: state.delaiKey,
      delai: c.delai.libelle,
      livraisonPrevue: c.date.toISOString().slice(0, 10),
      livraisonTexte: c.dateText,
      total: c.total,
      acompte: c.acompte,
      solde: c.later,
      options: c.options.map(o => o.nom),
      optionKeys: c.options.map(o => o.key),
      payLink: lienPaiement(c.payLink),
      soldeLink: lienPaiement(c.soldeLink),
      projet: $('fProjet').value.trim(),
      destination: $('fDestination').value,
      textes: $('fTextes').value.trim(),
      style: $('fStyle').value.trim(),
      dimensions: $('fDimensions').value.trim(),
      infos: $('fInfos').value.trim(),
      lien: $('fLien').value.trim(),
      nom: $('fNom').value.trim(),
      whatsapp: $('fWhatsapp').value.trim() + ($('fHasWhatsapp').checked ? '' : ' (pas de WhatsApp : appel ou SMS)'),
      email: $('fEmail').value.trim(),
      website: $('fWebsite').value // champ piège
    };
  }

  function waBriefMessage(order) {
    return `Bonjour Olivier, voici ma commande AUREN CRÉATIF.\n\n` +
      `🔖 Référence : ${order.reference}\n📌 ${order.service} · ${order.delai}\n📅 Livraison prévue : ${order.livraisonTexte}\n` +
      `💰 Total : ${fmtFcfa(order.total)} (50 % aujourd’hui : ${fmtFcfa(order.acompte)})\n` +
      (order.options.length ? `🧩 Options : ${order.options.join(', ')}\n` : '') +
      `\n🏷️ Projet : ${order.projet}\n🎯 Utilisation : ${order.destination}\n💬 Textes : ${order.textes}\n` +
      (order.style ? `🎨 Style : ${order.style}\n` : '') + (order.dimensions ? `📐 Format : ${order.dimensions}\n` : '') +
      (order.infos ? `ℹ️ ${order.infos}\n` : '') + (order.lien ? `📎 Fichiers : ${order.lien}\n` : '') +
      `\n👤 ${order.nom} · ${order.whatsapp} · ${order.email}` +
      (state.files.length ? `\n\nJe vous envoie mes fichiers ici dans la discussion.` : '');
  }

  // Lien Chariow avec la référence déjà remplie dans le champ « Référence »
  function lienPaiement(lien) {
    if (!lien) return '';
    return `${lien}${lien.includes('?') ? '&' : '?'}reference=${encodeURIComponent(state.reference)}`;
  }

  // Écran final : la référence et un seul bouton de paiement
  function ecranPaiement(order, c, texte) {
    overlay({
      icon: '<i class="fa-solid fa-circle-check"></i>',
      title: 'Plus qu’une étape !',
      text: texte,
      ref: order.reference,
      actions: (order.payLink ? `<a class="btn btn-primary btn-lg" href="${order.payLink}"><i class="fa-solid fa-lock"></i> Payer 50 % · ${fmtFcfa(c.acompte)}</a>
        <p class="order-pay-note">Paiement sécurisé par Chariow · votre référence est déjà remplie</p>` : '') +
        `<button type="button" class="order-link-btn" data-close>Modifier ma commande</button>`
    });
  }

  function saveLocally(order) {
    try { localStorage.setItem('auren_last_order', JSON.stringify({ reference: order.reference, service: order.service, date: new Date().toISOString() })); } catch (e) { /* stockage indisponible */ }
  }

  $('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = validate();
    showError(err);
    if (err) return;

    const c = calc();
    if (!state.reference) state.reference = generateReference();
    const order = buildOrder(c);
    saveLocally(order);

    // Sans script Google : on ne fait pas semblant d'envoyer
    if (!CONFIG.ORDER_ENDPOINT) {
      overlay({
        icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
        title: 'Service momentanément indisponible',
        text: `La commande en ligne est indisponible pour le moment. Écrivez à Olivier à ${CONFIG.EMAIL_CONTACT}, en indiquant votre référence.`,
        ref: order.reference,
        actions: `<a class="btn btn-primary" href="mailto:${CONFIG.EMAIL_CONTACT}?subject=${encodeURIComponent('Commande ' + order.reference)}"><i class="fa-solid fa-envelope"></i> Écrire par e-mail</a>` +
          `<button type="button" class="order-link-btn" data-close>Modifier ma commande</button>`
      });
      return;
    }

    $('submitBtn').disabled = true;
    overlay({ icon: '<i class="fa-solid fa-spinner fa-spin"></i>', title: 'Envoi de votre commande…', text: state.files.length ? 'Vos fichiers sont en cours d’envoi, merci de patienter.' : 'Merci de patienter quelques secondes.' });

    try {
      order.files = await Promise.all(state.files.map(async f => ({ name: f.name, type: f.type || 'application/octet-stream', data: await readAsBase64(f) })));
      const res = await fetch(CONFIG.ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // évite la requête préalable CORS
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Erreur inconnue');

      ecranPaiement(order, c, `Votre commande est enregistrée et un récapitulatif a été envoyé à ${order.email}. Réglez 50 % pour lancer la création.`);
    } catch (error) {
      $('submitBtn').disabled = false;
      overlay({
        icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
        title: 'La commande n’a pas pu être envoyée',
        text: 'Vérifiez votre connexion internet, puis réessayez. Vos informations sont conservées.',
        ref: '',
        actions: `<button type="button" class="btn btn-primary" data-close>Réessayer</button>`
      });
    }
  });

  $('overlay').addEventListener('click', (e) => {
    const copie = e.target.closest('[data-copy]');
    if (copie && navigator.clipboard) {
      navigator.clipboard.writeText(copie.dataset.copy).then(() => { copie.innerHTML = '<i class="fa-solid fa-check"></i> Copiée'; });
    }
    if (e.target.closest('[data-close]')) $('overlay').hidden = true;
  });

  renderDelais();
  majFormat();
  update();
});
