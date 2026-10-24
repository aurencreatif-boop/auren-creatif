/**
 * AUREN CRÉATIF · Commandes, e-mails, livraison et tableau de bord
 *
 * Installation (une seule fois) : voir GUIDE-MISE-EN-PLACE.md, étape 1.
 *   1. Google Sheet « Commandes AUREN CRÉATIF » > Extensions > Apps Script.
 *   2. Coller Code.gs et le fichier HTML « Dashboard ».
 *   3. Exécuter installer(), puis Déployer > Application Web
 *      (Exécuter en tant que : Moi · Qui a accès : Tout le monde).
 *   4. Menu AUREN > « Afficher mes liens » : copier les 3 liens.
 *
 * Fonctionnement :
 *   - La page de commande du site envoie la commande (brief + fichiers) ici :
 *     Sheet + dossier Drive + e-mail au client + e-mail à Olivier.
 *   - Olivier dépose l'aperçu et le fichier final depuis le tableau de bord :
 *     le client reçoit l'aperçu et le lien du solde.
 *   - Chariow (Pulse) signale chaque paiement : le fichier final part
 *     automatiquement au client dès que le solde est payé.
 */

// Lancée en premier : sélectionnée par défaut dans l'éditeur (bouton « Exécuter »)
function installerAuren() { installer(); }

const AUREN = {
  EMAIL: 'aurencreatif@gmail.com',
  NOM: 'AUREN CRÉATIF',
  WHATSAPP: '+228 96 99 03 29',
  WA_NUMBER: '22896990329',
  SHEET: 'Commandes',
  SHEET_JOURNAL: 'Journal Chariow',
  SHEET_CONFIG: 'Configuration',
  DRIVE_RACINE: 'AUREN CRÉATIF',
  DRIVE_COMMANDES: '01 Commandes',
  SOUS_DOSSIERS: ['01 Fichiers reçus', '02 Travail', '03 Aperçus', '04 Livraison finale'],
  MAX_FICHIERS: 5,
  MAX_OCTETS_FICHIER: 10 * 1024 * 1024,

  STATUTS: ['Nouvelle · paiement à vérifier', 'Acompte payé', 'En cours', 'Aperçu envoyé · solde demandé', 'Soldé · fichiers livrés', 'Archivé'],

  COLONNES: ['Référence', 'Date', 'Statut', 'Nom', 'WhatsApp', 'E-mail', 'Service', 'Délai', 'Livraison prévue',
             'Total (FCFA)', 'Acompte (FCFA)', 'Solde (FCFA)', 'Options', 'Projet', 'Utilisation', 'Textes', 'Style',
             'Dimensions', 'Infos', 'Lien fichiers client', 'Dossier Drive', 'Lien paiement', 'Liens options',
             'Date paiement 1/2', 'Date aperçu', 'Date paiement 2/2', 'ID fichier final', 'Solde reçu avant livraison', 'Notes']
};

const COL = {}; AUREN.COLONNES.forEach((c, i) => { COL[c] = i + 1; });
const fcfa = n => (Number(n) || 0).toLocaleString('fr-FR') + ' FCFA';
const props = () => PropertiesService.getScriptProperties();

/* ==========================================================================
   Menu et installation
   ========================================================================== */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('AUREN')
    .addItem('1. Installer (une seule fois)', 'installer')
    .addItem('2. Afficher mes liens (après déploiement)', 'afficherLiens')
    .addToUi();
}

function installer() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(AUREN.SHEET) || ss.insertSheet(AUREN.SHEET, 0);
  sh.getRange(1, 1, 1, AUREN.COLONNES.length).setValues([AUREN.COLONNES])
    .setFontWeight('bold').setBackground('#1d4ed8').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange(2, COL['Statut'], sh.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(AUREN.STATUTS, true).build());
  if (!ss.getSheetByName(AUREN.SHEET_JOURNAL)) {
    ss.insertSheet(AUREN.SHEET_JOURNAL).appendRow(['Date', 'Référence trouvée', 'Action', 'Données reçues']);
  }
  const racine = dossier_(DriveApp.getRootFolder(), AUREN.DRIVE_RACINE);
  dossier_(racine, AUREN.DRIVE_COMMANDES);
  try { DriveApp.getFileById(ss.getId()).moveTo(racine); } catch (e) { /* déjà rangé */ }

  if (!props().getProperty('ADMIN_KEY')) props().setProperty('ADMIN_KEY', Utilities.getUuid().replace(/-/g, ''));
  if (!props().getProperty('CHARIOW_KEY')) props().setProperty('CHARIOW_KEY', Utilities.getUuid().replace(/-/g, ''));

  alerte_('Installation terminée.\n\nÉtape suivante : Déployer > Nouveau déploiement > Application Web\n' +
    '· Exécuter en tant que : Moi\n· Qui a accès : Tout le monde\n\nPuis menu AUREN > « Afficher mes liens ».');
}

function afficherLiens() {
  const url = ScriptApp.getService().getUrl();
  if (!url) { alerte_('Déployez d’abord l’application Web (Déployer > Nouveau déploiement).'); return; }
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(AUREN.SHEET_CONFIG) || ss.insertSheet(AUREN.SHEET_CONFIG);
  sh.clear();
  sh.getRange('A1:C4').setValues([
    ['Lien', 'Valeur', 'À quoi il sert'],
    ['ORDER_ENDPOINT (site)', url, 'À coller dans assets/js/config.js : reçoit les commandes du site.'],
    ['Tableau de bord (PRIVÉ)', url + '?k=' + props().getProperty('ADMIN_KEY'), 'Votre espace : commandes, aperçus, livraisons. Ne le partagez avec personne.'],
    ['Pulse Chariow (PRIVÉ)', url + '?k=' + props().getProperty('CHARIOW_KEY'), 'À coller dans Chariow > Automatisations > Pulses (vente réussie).']
  ]);
  sh.getRange('A1:C1').setFontWeight('bold');
  sh.setColumnWidth(1, 220); sh.setColumnWidth(2, 620); sh.setColumnWidth(3, 420);
  alerte_('Vos 3 liens sont dans l’onglet « Configuration ».');
}

// Message visible dans la feuille, ou dans le journal d'exécution si lancé depuis l'éditeur
function alerte_(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { console.log(msg); }
}

function dossier_(parent, nom) {
  const it = parent.getFoldersByName(nom);
  return it.hasNext() ? it.next() : parent.createFolder(nom);
}

/* ==========================================================================
   Points d'entrée Web
   ========================================================================== */
function doGet(e) {
  if ((e.parameter.k || '') === props().getProperty('ADMIN_KEY')) {
    const t = HtmlService.createTemplateFromFile('Dashboard');
    t.adminKey = e.parameter.k;
    t.apiUrl = ScriptApp.getService().getUrl();
    t.data = JSON.stringify(getDashboardData(e.parameter.k)).replace(/</g, '\u003c');
    return t.evaluate().setTitle('Tableau de bord · AUREN CRÉATIF').addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createHtmlOutput('<p style="font-family:sans-serif">AUREN CRÉATIF</p>');
}

function doPost(e) {
  try {
    const body = (e.postData && e.postData.contents) || '';
    if ((e.parameter.k || '') === props().getProperty('CHARIOW_KEY')) {
      return json_(evenementChariow_(body));
    }
    const data = JSON.parse(body);
    if (data.action === 'order') return json_(enregistrerCommande_(data));
    if (data.action === 'admin') return json_(actionAdmin_(data));
    return json_({ ok: false, error: 'Action inconnue' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Erreur serveur' });
  }
}

// Actions de l'espace privé (appelées par fetch, protégées par la clé)
function actionAdmin_(d) {
  const permises = { getDashboardData, setStatut, setNotes, envoyerApercu, livrerManuellement };
  if (!permises[d.fn]) return { ok: false, error: 'Action inconnue' };
  try {
    return { ok: true, data: permises[d.fn].apply(null, [d.key].concat(d.args || [])) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ==========================================================================
   1. Nouvelle commande depuis le site
   ========================================================================== */
function enregistrerCommande_(d) {
  if (d.website) return { ok: true, reference: d.reference }; // robot : on ignore sans le dire
  const ref = String(d.reference || '');
  if (!/^AC-[A-Z0-9]{6}$/.test(ref)) return { ok: false, error: 'Référence invalide' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '') || !d.nom || !d.projet) return { ok: false, error: 'Champs manquants' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = feuille_();
    if (ligne_(ref) > 0) return { ok: true, reference: ref }; // déjà reçue (double clic)

    const racine = dossier_(dossier_(DriveApp.getRootFolder(), AUREN.DRIVE_RACINE), AUREN.DRIVE_COMMANDES);
    const dossier = racine.createFolder(`${ref} – ${String(d.nom).slice(0, 60)}`);
    const sous = {};
    AUREN.SOUS_DOSSIERS.forEach(n => { sous[n] = dossier.createFolder(n); });

    const fichiers = (d.files || []).slice(0, AUREN.MAX_FICHIERS);
    const recus = []; // fichiers du client : rangés dans Drive, joints à l'e-mail d'Olivier, cliquables dans le PDF
    fichiers.forEach(f => {
      const octets = Utilities.base64Decode(f.data || '');
      if (octets.length > AUREN.MAX_OCTETS_FICHIER) return;
      const blob = Utilities.newBlob(octets, f.type || 'application/octet-stream', String(f.name || 'fichier').slice(0, 120));
      const fichier = sous['01 Fichiers reçus'].createFile(blob);
      recus.push({ nom: fichier.getName(), url: fichier.getUrl(), blob: blob, taille: octets.length });
    });

    const liensOptions = (d.optionKeys || []).map(k => k).join(',');
    const ligne = AUREN.COLONNES.map(() => '');
    const set = (c, v) => { ligne[COL[c] - 1] = v; };
    set('Référence', ref); set('Date', new Date()); set('Statut', AUREN.STATUTS[0]);
    set('Nom', d.nom); set('WhatsApp', "'" + (d.whatsapp || '')); set('E-mail', d.email);
    set('Service', d.service); set('Délai', d.delai); set('Livraison prévue', d.livraisonPrevue ? new Date(d.livraisonPrevue) : '');
    set('Total (FCFA)', Number(d.total) || ''); set('Acompte (FCFA)', Number(d.acompte) || ''); set('Solde (FCFA)', Number(d.solde) || '');
    set('Options', (d.options || []).join(', ')); set('Projet', d.projet); set('Utilisation', d.destination);
    set('Textes', d.textes); set('Style', d.style); set('Dimensions', d.dimensions); set('Infos', d.infos);
    set('Lien fichiers client', recus.map(r => `${r.nom} | ${r.url}`).concat(d.lien ? [`Lien du client | ${d.lien}`] : []).join('\n')); set('Dossier Drive', dossier.getUrl()); set('Lien paiement', d.payLink);
    set('Liens options', liensOptions);
    sh.appendRow(ligne);

    const pdf = bonDeCommandePdf_(d, recus);
    dossier.createFile(pdf); // copie du bon de commande dans le dossier du client
    mailClientCommande_(d, recus.length, pdf);
    mailOlivierCommande_(d, dossier.getUrl(), recus, pdf);
    return { ok: true, reference: ref };
  } finally {
    lock.releaseLock();
  }
}

/* ==========================================================================
   2. Paiements Chariow (Pulse « vente réussie »)
   ========================================================================== */
function evenementChariow_(body) {
  const texte = String(body || '');
  const m = texte.match(/AC-[A-Z0-9]{6}/);
  const ref = m ? m[0] : '';
  let action = 'Référence absente : vérifiez le champ « Référence » de la vente dans Chariow';

  if (ref) {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const n = ligne_(ref);
      if (n < 0) {
        action = 'Référence inconnue dans le Sheet';
      } else {
        const statut = val_(n, 'Statut');
        if (statut === AUREN.STATUTS[0]) {
          ecrire_(n, 'Statut', AUREN.STATUTS[1]);
          ecrire_(n, 'Date paiement 1/2', new Date());
          mailClientAcompte_(n);
          action = 'Acompte enregistré';
        } else if (statut === AUREN.STATUTS[3] && val_(n, 'ID fichier final')) {
          livrerFichierFinal_(n);
          action = 'Solde reçu : fichier final livré automatiquement';
        } else if (statut !== AUREN.STATUTS[4]) {
          ecrire_(n, 'Solde reçu avant livraison', 'Oui');
          ecrire_(n, 'Date paiement 2/2', new Date());
          action = 'Second paiement reçu avant l’aperçu : le fichier partira dès son dépôt';
        } else {
          action = 'Paiement supplémentaire (option ?) sur une commande déjà livrée';
        }
      }
    } finally {
      lock.releaseLock();
    }
  }
  SpreadsheetApp.getActive().getSheetByName(AUREN.SHEET_JOURNAL).appendRow([new Date(), ref, action, texte.slice(0, 4000)]);
  return { ok: true };
}

/* ==========================================================================
   3. Livraison depuis le tableau de bord
   ========================================================================== */
function envoyerApercu(key, ref, apercu, final, message) {
  verifier_(key);
  const n = ligne_(ref);
  if (n < 0) throw new Error('Commande introuvable');
  if (!apercu || !final) throw new Error('Ajoutez l’aperçu et le fichier final');

  const dossier = DriveApp.getFolderById(idDossier_(val_(n, 'Dossier Drive')));
  const sousDossier = nom => dossier_(dossier, nom);
  const blobApercu = Utilities.newBlob(Utilities.base64Decode(apercu.data), apercu.type, apercu.name);
  const fichierApercu = sousDossier('03 Aperçus').createFile(blobApercu);
  const fichierFinal = sousDossier('04 Livraison finale').createFile(
    Utilities.newBlob(Utilities.base64Decode(final.data), final.type, final.name));

  ecrire_(n, 'ID fichier final', fichierFinal.getId());
  ecrire_(n, 'Date aperçu', new Date());
  ecrire_(n, 'Statut', AUREN.STATUTS[3]);
  mailClientApercu_(n, fichierApercu, message);

  // Solde déjà payé avant l'aperçu : livraison immédiate
  if (val_(n, 'Solde reçu avant livraison') === 'Oui') livrerFichierFinal_(n);
  return getDashboardData(key);
}

function livrerManuellement(key, ref) {
  verifier_(key);
  const n = ligne_(ref);
  if (n < 0 || !val_(n, 'ID fichier final')) throw new Error('Déposez d’abord le fichier final');
  livrerFichierFinal_(n);
  return getDashboardData(key);
}

function livrerFichierFinal_(n) {
  const fichier = DriveApp.getFileById(val_(n, 'ID fichier final'));
  fichier.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const lien = 'https://drive.google.com/uc?export=download&id=' + fichier.getId();
  ecrire_(n, 'Statut', AUREN.STATUTS[4]);
  if (!val_(n, 'Date paiement 2/2')) ecrire_(n, 'Date paiement 2/2', new Date());
  mail_(val_(n, 'E-mail'), `Vos fichiers finaux sont prêts · ${val_(n, 'Référence')}`,
    `<p>Bonjour ${prenom_(val_(n, 'Nom'))},</p>
     <p>Merci pour le règlement du solde ! Votre <strong>${val_(n, 'Service')}</strong> en haute définition est prêt.</p>
     ${bouton_(lien, 'Télécharger mes fichiers')}
     <p>Lien de secours : <a href="${fichier.getUrl()}">${fichier.getUrl()}</a></p>
     <p>Merci pour votre confiance. N’hésitez pas à m’écrire sur WhatsApp au ${AUREN.WHATSAPP}.</p>`);
}

/* ==========================================================================
   E-mails
   ========================================================================== */
function mail_(to, sujet, html, piecesJointes) {
  const corps = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a;line-height:1.6">
    <div style="padding:16px 0;border-bottom:3px solid #2563eb;font-weight:800;font-size:18px">${AUREN.NOM}</div>
    ${html}
    <p style="margin-top:28px;font-size:12px;color:#64748b">${AUREN.NOM} · Olivier, graphiste · WhatsApp ${AUREN.WHATSAPP} · ${AUREN.EMAIL}</p></div>`;
  const opts = { htmlBody: corps, name: AUREN.NOM, replyTo: AUREN.EMAIL };
  if (piecesJointes) opts.attachments = piecesJointes;
  MailApp.sendEmail(to, sujet, 'Ouvrez ce message dans un lecteur compatible HTML.', opts);
}

function bouton_(url, texte) {
  return `<p style="margin:22px 0"><a href="${url}" style="background:#2563eb;color:#fff;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">${texte}</a></p>`;
}

function prenom_(nom) { return String(nom || '').split(' ')[0] || 'Bonjour'; }
function esc_(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function mailClientCommande_(d, nbFichiers, pdf) {
  mail_(d.email, `Commande ${d.reference} reçue · ${d.service}`,
    `<p>Bonjour ${esc_(prenom_(d.nom))},</p>
     <p>Votre commande est bien enregistrée. Gardez précieusement votre référence : <strong>${d.reference}</strong>.</p>
     <table style="width:100%;border-collapse:collapse;font-size:14px">
       <tr><td style="padding:6px 0;color:#64748b">Service</td><td><strong>${esc_(d.service)}</strong></td></tr>
       <tr><td style="padding:6px 0;color:#64748b">Projet</td><td>${esc_(d.projet)}</td></tr>
       <tr><td style="padding:6px 0;color:#64748b">Délai</td><td>${esc_(d.delai)}</td></tr>
       <tr><td style="padding:6px 0;color:#64748b">Livraison prévue</td><td><strong>${esc_(d.livraisonTexte)}</strong></td></tr>
       <tr><td style="padding:6px 0;color:#64748b">Total</td><td>${fcfa(d.total)}</td></tr>
       <tr><td style="padding:6px 0;color:#64748b">Acompte (50 %)</td><td>${fcfa(d.acompte)}</td></tr>
       <tr><td style="padding:6px 0;color:#64748b">À la livraison</td><td>${fcfa(d.solde)}</td></tr>
       ${nbFichiers ? `<tr><td style="padding:6px 0;color:#64748b">Fichiers reçus</td><td>${nbFichiers}</td></tr>` : ''}
     </table>
     <p><strong>Et ensuite ?</strong></p>
     <ol>
       <li>Si ce n’est pas déjà fait, réglez l’acompte de 50 % avec votre référence :</li>
     </ol>
     ${d.payLink ? bouton_(d.payLink, 'Régler l’acompte de 50 %') : ''}
     <ol start="2">
       <li>Olivier réalise votre création. Revenez consulter vos e-mails le <strong>${esc_(d.livraisonTexte)}</strong> : vous recevrez votre aperçu.</li>
       <li>Après validation, vous réglez le solde et recevez automatiquement vos fichiers finaux.</li>
     </ol>
     <p>📄 Votre bon de commande est en pièce jointe.</p>`, pdf ? [pdf] : null);
}

// Bon de commande en PDF : une page claire, facile à lire et à imprimer
function bonDeCommandePdf_(d, recus) {
  const bloc = (titre, lignes) => `
    <h2 style="font-size:13pt;color:#1d4ed8;margin:18px 0 6px;border-bottom:1px solid #cbd5e1;padding-bottom:4px">${titre}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:11pt">
      ${lignes.filter(l => l[1]).map(l => `<tr><td style="width:34%;padding:5px 8px 5px 0;color:#475569;vertical-align:top">${l[0]}</td>
        <td style="padding:5px 0;white-space:pre-wrap;color:#0f172a">${esc_(l[1])}</td></tr>`).join('')}
    </table>`;
  const html = `<html><body style="font-family:Arial,sans-serif;color:#0f172a;margin:24px">
    <table style="width:100%"><tr>
      <td><div style="font-size:20pt;font-weight:bold">${AUREN.NOM}</div><div style="color:#475569">Bon de commande</div></td>
      <td style="text-align:right"><div style="font-size:16pt;font-weight:bold;color:#1d4ed8">${d.reference}</div>
        <div style="color:#475569">${Utilities.formatDate(new Date(), 'Africa/Lome', 'dd/MM/yyyy à HH:mm')}</div></td>
    </tr></table>
    ${bloc('Client', [['Nom', d.nom], ['Téléphone', d.whatsapp], ['E-mail', d.email]])}
    ${bloc('Commande', [['Service', d.service], ['Délai', d.delai], ['Livraison prévue', d.livraisonTexte],
      ['Total', fcfa(d.total)], ['Acompte (50 %)', fcfa(d.acompte)], ['Solde à la livraison', fcfa(d.solde)]])}
    ${bloc('Ce que veut le client', [['Projet', d.projet], ['Utilisation', d.destination], ['Textes à mettre', d.textes],
      ['Couleurs / ambiance', d.style], ['Taille', d.dimensions], ['Autres remarques', d.infos]])}
    <h2 style="font-size:13pt;color:#1d4ed8;margin:18px 0 6px;border-bottom:1px solid #cbd5e1;padding-bottom:4px">Fichiers du client</h2>
    <p style="font-size:11pt;margin:4px 0">${recus.length ? recus.map(r => `• <a href="${r.url}" style="color:#1d4ed8">${esc_(r.nom)}</a>`).join('<br>') + '<br><span style="color:#64748b;font-size:9pt">Cliquez sur un nom pour ouvrir le fichier. Ils sont aussi joints à l’e-mail.</span>' : 'Aucun fichier déposé'}
    ${d.lien ? `<br>Lien envoyé par le client : <a href="${esc_(d.lien)}" style="color:#1d4ed8">${esc_(d.lien)}</a>` : ''}</p>
    <p style="margin-top:22px;font-size:9pt;color:#64748b">Le paiement de l’acompte apparaît dans Chariow avec la référence ${d.reference}.</p>
  </body></html>`;
  return Utilities.newBlob(html, 'text/html', 'commande.html').getAs('application/pdf').setName(`Commande ${d.reference} - ${String(d.nom).slice(0, 40)}.pdf`);
}

function mailOlivierCommande_(d, dossierUrl, recus, pdf) {
  // Les fichiers du client sont joints s'ils tiennent dans la limite de Gmail (environ 20 Mo au total)
  let total = 0;
  const joints = recus.filter(r => (total += r.taille) < 18 * 1024 * 1024).map(r => r.blob);
  mail_(AUREN.EMAIL, `🆕 Commande ${d.reference} · ${d.service} · ${d.nom}`,
    `<p>Nouvelle commande depuis le site : <strong>${esc_(d.service)}</strong> pour <strong>${esc_(d.nom)}</strong>, livraison prévue le ${esc_(d.livraisonTexte)}.</p>
     <p>📄 Le bon de commande complet est en <strong>pièce jointe (PDF)</strong>${joints.length ? `, avec les <strong>${joints.length} fichier(s) du client</strong>` : ''}.</p>
     ${bouton_(dossierUrl, 'Ouvrir le dossier du client')}
     <p><a href="https://wa.me/${String(d.whatsapp).replace(/\D/g, '')}">Écrire au client sur WhatsApp</a></p>`, [pdf].concat(joints));
}

function mailClientAcompte_(n) {
  mail_(val_(n, 'E-mail'), `Acompte reçu · ${val_(n, 'Référence')}`,
    `<p>Bonjour ${esc_(prenom_(val_(n, 'Nom')))},</p>
     <p>Votre acompte pour <strong>${esc_(val_(n, 'Service'))}</strong> est bien enregistré. Olivier démarre votre création.</p>
     <p>Revenez consulter vos e-mails le <strong>${Utilities.formatDate(new Date(val_(n, 'Livraison prévue')), 'Africa/Lome', 'dd/MM/yyyy')}</strong> : vous recevrez votre aperçu.</p>`);
}

function mailClientApercu_(n, fichierApercu, message) {
  const ref = val_(n, 'Référence');
  const options = String(val_(n, 'Liens options') || '').split(',').filter(Boolean);
  const blob = fichierApercu.getBlob();
  const joindre = blob.getBytes().length < 20 * 1024 * 1024 && /^image\/|pdf/.test(blob.getContentType());
  if (!joindre) fichierApercu.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  mail_(val_(n, 'E-mail'), `Votre projet est prêt · ${ref}`,
    `<p>Bonjour ${esc_(prenom_(val_(n, 'Nom')))},</p>
     <p>Votre <strong>${esc_(val_(n, 'Service'))}</strong> est terminé ! Voici l’aperçu ${joindre ? 'en pièce jointe' : `: <a href="${fichierApercu.getUrl()}">voir l’aperçu</a>`} (basse définition, avec filigrane).</p>
     ${message ? `<p style="white-space:pre-wrap;background:#f1f5f9;padding:12px;border-radius:8px">${esc_(message)}</p>` : ''}
     <p>Une modification ? Répondez simplement sur WhatsApp au ${AUREN.WHATSAPP} (deux tours inclus).</p>
     <p><strong>Pour recevoir vos fichiers finaux en haute définition</strong>, réglez le solde de <strong>${fcfa(val_(n, 'Solde (FCFA)'))}</strong>. Indiquez votre référence <strong>${ref}</strong> dans le champ « Référence ».</p>
     ${val_(n, 'Lien paiement') ? bouton_(val_(n, 'Lien paiement'), `Payer le solde de 50 %`) : ''}
     ${options.length ? `<p>Options choisies (${esc_(val_(n, 'Options'))}) : Olivier vous envoie leur lien de paiement sur WhatsApp.</p>` : ''}
     <p>Dès le paiement reçu, vos fichiers finaux vous sont envoyés automatiquement par e-mail.</p>`,
    joindre ? [blob] : null);
}

/* ==========================================================================
   Tableau de bord (privé, protégé par la clé)
   ========================================================================== */
function verifier_(key) {
  if (!key || key !== props().getProperty('ADMIN_KEY')) throw new Error('Accès refusé');
}

function getDashboardData(key) {
  verifier_(key);
  const sh = feuille_();
  const commandes = [];
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, AUREN.COLONNES.length).getValues().forEach(r => {
      if (!r[0]) return;
      const o = {};
      AUREN.COLONNES.forEach((c, i) => { o[c] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
      commandes.push(o);
    });
  }
  return { commandes, statuts: AUREN.STATUTS, maj: new Date().toISOString() };
}

function setStatut(key, ref, statut) {
  verifier_(key);
  if (AUREN.STATUTS.indexOf(statut) < 0) throw new Error('Statut inconnu');
  const n = ligne_(ref);
  ecrire_(n, 'Statut', statut);
  if (statut === AUREN.STATUTS[1] && !val_(n, 'Date paiement 1/2')) ecrire_(n, 'Date paiement 1/2', new Date());
  return getDashboardData(key);
}

function setNotes(key, ref, notes) {
  verifier_(key);
  ecrire_(ligne_(ref), 'Notes', notes);
  return getDashboardData(key);
}

/* ==========================================================================
   Utilitaires Sheet
   ========================================================================== */
function feuille_() { return SpreadsheetApp.getActive().getSheetByName(AUREN.SHEET); }

function ligne_(ref) {
  const sh = feuille_();
  if (sh.getLastRow() < 2) return -1;
  const refs = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < refs.length; i++) if (String(refs[i][0]) === ref) return i + 2;
  return -1;
}

function val_(n, col) { return feuille_().getRange(n, COL[col]).getValue(); }
function ecrire_(n, col, v) { feuille_().getRange(n, COL[col]).setValue(v); }
function idDossier_(url) { return String(url).split('/folders/')[1].split(/[?/]/)[0]; }
