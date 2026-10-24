/**
 * AUREN CRÉATIF · Page de commande
 * Le client remplit son brief, ajoute ses fichiers, puis :
 *   1. la commande est enregistrée (script Google : Sheet + Drive + e-mails) ;
 *   2. il est redirigé vers le lien Chariow de son service et de son délai (50 %).
 * Sans script Google configuré, la page bascule sur WhatsApp (aucun faux envoi).
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
      payLink: (CONFIG.PAYMENT_LINKS || {})[`${state.serviceKey}|${state.delaiKey}`] || ''
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

  const waUrl = (msg) => `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  function overlay({ icon, title, text, ref, actions = '' }) {
    $('overlay').hidden = false;
    $('ovIcon').innerHTML = icon;
    $('ovTitle').textContent = title;
    $('ovText').textContent = text;
    $('ovRef').hidden = !ref;
    $('ovRef').innerHTML = ref ? `Votre référence : <strong>${ref}</strong>` : '';
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
    if ($('fWhatsapp').value.replace(/\D/g, '').length < 8) { $('fWhatsapp').focus(); return 'Numéro WhatsApp invalide.'; }
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
      payLink: c.payLink,
      projet: $('fProjet').value.trim(),
      destination: $('fDestination').value,
      textes: $('fTextes').value.trim(),
      style: $('fStyle').value.trim(),
      dimensions: $('fDimensions').value.trim(),
      infos: $('fInfos').value.trim(),
      lien: $('fLien').value.trim(),
      nom: $('fNom').value.trim(),
      whatsapp: $('fWhatsapp').value.trim(),
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

    // Sans script Google : WhatsApp puis paiement (aucun faux envoi)
    if (!CONFIG.ORDER_ENDPOINT) {
      overlay({
        icon: '<i class="fa-brands fa-whatsapp"></i>',
        title: 'Dernière étape',
        text: '1. Envoyez votre brief à Olivier sur WhatsApp. 2. Réglez 50 % sur la page de paiement sécurisée, en indiquant votre référence.',
        ref: order.reference,
        actions: `<a class="btn btn-whatsapp" href="${waUrl(waBriefMessage(order))}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Envoyer mon brief</a>` +
          (c.payLink ? `<a class="btn btn-primary" href="${c.payLink}"><i class="fa-solid fa-lock"></i> Payer 50 % · ${fmtFcfa(c.acompte)}</a>` : '') +
          `<button type="button" class="btn btn-outline" data-close>Modifier ma commande</button>`
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

      overlay({
        icon: '<i class="fa-solid fa-circle-check"></i>',
        title: 'Commande enregistrée',
        text: `Un e-mail de confirmation a été envoyé à ${order.email}. Redirection vers le paiement sécurisé de 50 %…`,
        ref: order.reference,
        actions: c.payLink ? `<a class="btn btn-primary" href="${c.payLink}"><i class="fa-solid fa-lock"></i> Payer 50 % · ${fmtFcfa(c.acompte)}</a>` : ''
      });
      if (c.payLink) setTimeout(() => { location.href = c.payLink; }, 2500);
    } catch (error) {
      $('submitBtn').disabled = false;
      overlay({
        icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
        title: 'La commande n’a pas pu être envoyée',
        text: 'Vérifiez votre connexion et réessayez, ou envoyez votre brief directement à Olivier sur WhatsApp.',
        ref: order.reference,
        actions: `<button type="button" class="btn btn-primary" data-close>Réessayer</button>` +
          `<a class="btn btn-whatsapp" href="${waUrl(waBriefMessage(order))}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Envoyer sur WhatsApp</a>`
      });
    }
  });

  $('overlay').addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) $('overlay').hidden = true;
  });

  renderDelais();
  update();
});
