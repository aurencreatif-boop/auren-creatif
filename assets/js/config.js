/**
 * AUREN CRÉATIF · OLIVIER, GRAPHISTE DESIGNER
 * Interactive Script for Portfolio, Stepper Wizard, Lightbox & WhatsApp Integration
 */

/* ==========================================================================
   1. BLOC DE CONFIGURATION UNIQUE (Annexe K du plan d'implémentation)
   C'est le SEUL endroit à modifier pour brancher le formulaire et les paiements.
   Tant qu'une valeur est vide, la page affiche un emplacement signalé et
   propose WhatsApp à la place : aucun faux bouton.
   ========================================================================== */
var CONFIG = {
  WA_NUMBER: "22896990329",
  EMAIL_CONTACT: "aurencreatif@gmail.com",
  WA_MESSAGE: "Bonjour Olivier, j’ai découvert votre portfolio et je souhaite discuter d’un projet de création graphique.",
  TAUX_EUR_FCFA: 655.957,

  // Adresse de l'application Web Google Apps Script (« Déployer > Application Web »).
  // Reçoit les commandes, les fichiers des clients et envoie les e-mails.
  // Vide = la page de commande bascule sur WhatsApp.
  ORDER_ENDPOINT: "https://script.google.com/macros/s/AKfycbwzeRoB1HC9I71L_usZSpIEd6tv6pRYyo8h7QbnoFwgXWSpzell7IQQPVuQrV40v-4/exec",

  // Lien Chariow de la consultation « Projet sur mesure » (10 000 FCFA)
  CONSULTATION_LINK: "",

  // Liens Chariow des options (réglées avec le solde). Vide = lien envoyé par Olivier.
  OPTION_LINKS: {
    revision: "https://tuvdexdr.mychariow.store/prd_vra7enpu",
    format:   "",
    sources:  ""
  },

  // Phase 1 : coller ici le lien prérempli du formulaire Google
  // (ex. "https://docs.google.com/forms/d/e/XXXX/viewform?usp=pp_url&entry.111=...").
  // Seule la partie avant « ? » est utilisée.
  FORM_PREFILL_URL: "",

  // Identifiants des champs du formulaire (« entry.123456789 »).
  // reference, service, delai et prix sont prévus par le plan ; les autres
  // sont facultatifs : un identifiant vide = champ non prérempli.
  FORM_ENTRY_IDS: {
    reference: "",
    service:   "",
    delai:     "",
    prix:      "",
    projet:    "",
    format:    "",
    style:     "",
    brief:     "",
    fichiers:  "",
    options:   ""
  },

  // Phase 2 : un lien Chariow par service et par délai ("service|délai").
  // Le montant de chaque variante Chariow = la moitié du total (indiquée en commentaire).
  // Le même lien sert au paiement 1/2 (acompte) et au paiement 2/2 (solde).
  PAYMENT_LINKS: {
    "affiche_simple|express":    "https://tuvdexdr.mychariow.store/prd_0vxq7t81?chw_pvar=GK6X2A", // total 22 500 → 11 250 FCFA
    "affiche_simple|rapide":     "https://tuvdexdr.mychariow.store/prd_0vxq7t81?chw_pvar=26PI6L", // total 19 000 →  9 500 FCFA
    "affiche_simple|standard":   "https://tuvdexdr.mychariow.store/prd_0vxq7t81?chw_pvar=CU4LPF", // total 15 000 →  7 500 FCFA
    "affiche_simple|flexible":   "https://tuvdexdr.mychariow.store/prd_0vxq7t81?chw_pvar=0OWP7N", // total 13 500 →  6 750 FCFA
    "affiche_premium|express":   "https://tuvdexdr.mychariow.store/prd_3270hdbo?chw_pvar=AREG3W", // total 45 000 → 22 500 FCFA
    "affiche_premium|rapide":    "https://tuvdexdr.mychariow.store/prd_3270hdbo?chw_pvar=VK7WUU", // total 37 500 → 18 750 FCFA
    "affiche_premium|standard":  "https://tuvdexdr.mychariow.store/prd_3270hdbo?chw_pvar=6S18A1", // total 30 000 → 15 000 FCFA
    "affiche_premium|flexible":  "https://tuvdexdr.mychariow.store/prd_3270hdbo?chw_pvar=684B88", // total 27 000 → 13 500 FCFA
    "flyer_recto|express":       "https://tuvdexdr.mychariow.store/prd_4qbbw49k?chw_pvar=F60WK4", // total 18 000 →  9 000 FCFA
    "flyer_recto|rapide":        "https://tuvdexdr.mychariow.store/prd_4qbbw49k?chw_pvar=PFLPNF", // total 15 000 →  7 500 FCFA
    "flyer_recto|standard":      "https://tuvdexdr.mychariow.store/prd_4qbbw49k?chw_pvar=4FZVXX", // total 12 000 →  6 000 FCFA
    "flyer_recto|flexible":      "https://tuvdexdr.mychariow.store/prd_4qbbw49k?chw_pvar=HX9F1J", // total 11 000 →  5 500 FCFA
    "flyer_rectoverso|express":  "https://tuvdexdr.mychariow.store/prd_x84kuw9b?chw_pvar=CUGX96", // total 30 000 → 15 000 FCFA
    "flyer_rectoverso|rapide":   "https://tuvdexdr.mychariow.store/prd_x84kuw9b?chw_pvar=Z8WGPL", // total 25 000 → 12 500 FCFA
    "flyer_rectoverso|standard": "https://tuvdexdr.mychariow.store/prd_x84kuw9b?chw_pvar=W4ZHEM", // total 20 000 → 10 000 FCFA
    "flyer_rectoverso|flexible": "https://tuvdexdr.mychariow.store/prd_x84kuw9b?chw_pvar=OU85QZ", // total 18 000 →  9 000 FCFA
    "visuel_reseaux|express":    "https://tuvdexdr.mychariow.store/prd_6fin0o6r?chw_pvar=JZUP7O", // total 11 500 →  5 750 FCFA
    "visuel_reseaux|rapide":     "https://tuvdexdr.mychariow.store/prd_6fin0o6r?chw_pvar=OBRS3Q", // total  9 500 →  4 750 FCFA
    "visuel_reseaux|standard":   "https://tuvdexdr.mychariow.store/prd_6fin0o6r?chw_pvar=9654OP", // total  7 500 →  3 750 FCFA
    "visuel_reseaux|flexible":   "https://tuvdexdr.mychariow.store/prd_6fin0o6r?chw_pvar=J7GNUH", // total  7 000 →  3 500 FCFA
    "pack_5_visuels|express":    "https://tuvdexdr.mychariow.store/prd_q8d7yz3c?chw_pvar=0AQMPC", // total 45 000 → 22 500 FCFA
    "pack_5_visuels|rapide":     "https://tuvdexdr.mychariow.store/prd_q8d7yz3c?chw_pvar=KQHLZ1", // total 37 500 → 18 750 FCFA
    "pack_5_visuels|standard":   "https://tuvdexdr.mychariow.store/prd_q8d7yz3c?chw_pvar=KZ7RAM", // total 30 000 → 15 000 FCFA
    "pack_5_visuels|flexible":   "https://tuvdexdr.mychariow.store/prd_q8d7yz3c?chw_pvar=4LMHDT", // total 27 000 → 13 500 FCFA
    "carte_visite|express":      "https://tuvdexdr.mychariow.store/prd_pvw032u3?chw_pvar=AHC9H5", // total 15 000 →  7 500 FCFA
    "carte_visite|rapide":       "https://tuvdexdr.mychariow.store/prd_pvw032u3?chw_pvar=YLH3TS", // total 12 500 →  6 250 FCFA
    "carte_visite|standard":     "https://tuvdexdr.mychariow.store/prd_pvw032u3?chw_pvar=JI7VYO", // total 10 000 →  5 000 FCFA
    "carte_visite|flexible":     "https://tuvdexdr.mychariow.store/prd_pvw032u3?chw_pvar=32FZF6", // total  9 000 →  4 500 FCFA
    "logo_simple|express":       "https://tuvdexdr.mychariow.store/prd_2f4asa7p?chw_pvar=S9B41W", // total 52 500 → 26 250 FCFA
    "logo_simple|rapide":        "https://tuvdexdr.mychariow.store/prd_2f4asa7p?chw_pvar=W8EQVP", // total 44 000 → 22 000 FCFA
    "logo_simple|standard":      "https://tuvdexdr.mychariow.store/prd_2f4asa7p?chw_pvar=CT860G", // total 35 000 → 17 500 FCFA
    "logo_simple|flexible":      "https://tuvdexdr.mychariow.store/prd_2f4asa7p?chw_pvar=Y4QK6W", // total 31 500 → 15 750 FCFA
    "identite_complete|rapide":  "https://tuvdexdr.mychariow.store/prd_ewy2p86s?chw_pvar=S5Z2S6", // total 125 000 → 62 500 FCFA (délai long : 4 à 5 jours)
    "identite_complete|standard":"https://tuvdexdr.mychariow.store/prd_ewy2p86s?chw_pvar=6C2JA8", // total 100 000 → 50 000 FCFA (délai long : 7 jours)
    "identite_complete|flexible":"https://tuvdexdr.mychariow.store/prd_ewy2p86s?chw_pvar=W8HAE7", // total  90 000 → 45 000 FCFA (délai long : 12 jours ou plus)
    "motion_design|express":     "https://tuvdexdr.mychariow.store/prd_iqtafpis?chw_pvar=JVTOLT", // total 60 000 → 30 000 FCFA
    "motion_design|rapide":      "https://tuvdexdr.mychariow.store/prd_iqtafpis?chw_pvar=5Y2N92", // total 50 000 → 25 000 FCFA
    "motion_design|standard":    "https://tuvdexdr.mychariow.store/prd_iqtafpis?chw_pvar=V0GM14", // total 40 000 → 20 000 FCFA
    "motion_design|flexible":    "https://tuvdexdr.mychariow.store/prd_iqtafpis?chw_pvar=ULIIL2"  // total 36 000 → 18 000 FCFA
  }
};

/* ==========================================================================
   2. DONNÉES DE PRIX
   Les prix sont saisis en FCFA uniquement (comme dans Chariow). L'équivalent
   en euros est calculé au taux fixe et reste indicatif.
   ========================================================================== */
const PRICING = {
  taux: CONFIG.TAUX_EUR_FCFA,   // 1 € = 655,957 FCFA, taux fixe
  // Délais courts (la plupart des services)
  delais: {
    express:  { libelle: "Express 24 h",            coeff: 1.50, badge: "+50 %", timing: "Livraison en 24 heures", notice: "Soumis à la disponibilité d'Olivier, confirmée avant tout paiement.", jours: 1 },
    rapide:   { libelle: "Rapide 48 h",             coeff: 1.25, badge: "+25 %", timing: "Livraison en 48 heures", notice: "", jours: 2 },
    standard: { libelle: "Standard 3 jours",        coeff: 1.00, badge: "Prix normal", timing: "3 à 5 jours", notice: "", jours: 3 },
    flexible: { libelle: "Flexible 7 jours ou plus", coeff: 0.90, badge: "−10 %", timing: "7 jours ou plus", notice: "", jours: 7 }
  },
  // Délais longs (services marqués « long: true ») : pas d'Express
  delaisLongs: {
    rapide:   { libelle: "Rapide 4 à 5 jours",       coeff: 1.25, badge: "+25 %", timing: "Livraison en 4 à 5 jours", notice: "", jours: 5 },
    standard: { libelle: "Standard 7 jours",         coeff: 1.00, badge: "Prix normal", timing: "7 jours", notice: "", jours: 7 },
    flexible: { libelle: "Flexible 12 jours ou plus", coeff: 0.90, badge: "−10 %", timing: "12 jours ou plus", notice: "", jours: 12 }
  },
  services: {
    affiche_simple:   { nom: "Affiche simple",              fcfa: 15000, icon: "fa-panorama", desc: "Événement, concert, culte, promo" },
    affiche_premium:  { nom: "Affiche premium",             fcfa: 30000, icon: "fa-wand-magic-sparkles", desc: "Illustration poussée ou photomontage" },
    flyer_recto:      { nom: "Flyer recto",                 fcfa: 12000, icon: "fa-file", desc: "Support imprimé ou digital, 1 face" },
    flyer_rectoverso: { nom: "Flyer recto-verso",           fcfa: 20000, icon: "fa-file-invoice", desc: "Support imprimé ou digital, 2 faces" },
    visuel_reseaux:   { nom: "Visuel réseaux sociaux",      fcfa: 7500, icon: "fa-mobile-screen-button", desc: "1 visuel pour post ou story" },
    pack_5_visuels:   { nom: "Pack 5 visuels réseaux",      fcfa: 30000, icon: "fa-layer-group", desc: "Pack cohérent de 5 publications" },
    carte_visite:     { nom: "Carte de visite",             fcfa: 10000, icon: "fa-address-card", desc: "Design professionnel prêt à imprimer" },
    logo_simple:      { nom: "Logo simple",                 fcfa: 35000, icon: "fa-bullseye", desc: "Création de logo sur mesure" },
    identite_complete:{ nom: "Identité visuelle complète",  fcfa: 100000, long: true, icon: "fa-gem", desc: "Logo, typographies et charte de marque" },
    motion_design:    { nom: "Animation motion design",     fcfa: 40000, icon: "fa-film", desc: "Animation de logo ou teaser vidéo" }
  },
  // Options : réglées avant la livraison, en plus des deux paiements de 50 % (annexe I)
  options: {
    revision: { nom: "Révision supplémentaire", fcfa: 3000 },
    format:   { nom: "Format supplémentaire",   fcfa: 5000 },
    sources:  { nom: "Fichiers sources",        fcfa: 5000 }
  }
};

// Délais applicables à un service (courts ou longs)
function getDelaisFor(serviceKey) {
  const srv = PRICING.services[serviceKey];
  return (srv && srv.long) ? PRICING.delaisLongs : PRICING.delais;
}

