# AUREN CRÉATIF — Landing Page de Vente Officielle

Site web complet, responsive et moderne pour la marque **AUREN CRÉATIF**, conçu selon le plan de présentation officiel.

---

## 🌐 Lien d'accès en local

Le site est actuellement actif et consultable sur votre navigateur à l'adresse suivante :
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🎨 Charte Graphique & Direction Artistique

- **Bleu nuit** : `#102A56`
- **Bleu électrique** : `#2563EB`
- **Bleu pâle** : `#EAF1FF`
- **Blanc** : `#FFFFFF`
- **Typographie** : Sans-serif moderne (Plus Jakarta Sans)
- **Logo réel** : Logo 3D « A » fourni intégré sans déformation dans le Header.

---

## 📦 Structure des Offres & Tarifs Indicatifs

| Offre | Prix FCFA | Équivalence Indicative en Euros | Statut / Spécifications |
| :--- | :--- | :--- | :--- |
| **1. Pack de polices** | **2 500 FCFA** | (≈ 3,81 €) | Spécimens typographiques, formats TTF/OTF |
| **2. Templates After Effects & Photoshop** | **5 000 FCFA** | (≈ 7,62 €) | Fichiers .PSD & .AEP (Logiciels non fournis) |
| **3. Formation CapCut sur téléphone** | **7 500 FCFA** | (≈ 11,43 €) | 100% Smartphone, timeline & montage pas-à-pas |
| **Pack Complet (Bundle 3-en-1)** | **12 000 FCFA** | (≈ 18,29 €) | Économie de 3 000 FCFA par rapport au total |

---

## ⚙️ Configuration des Paiements

Dans le fichier [`assets/js/main.js`](assets/js/main.js), vous pouvez renseigner vos liens réels de paiement :

```javascript
const PAYMENT_CONFIG = {
  PAYMENT_URL_FONTS: "",            // Votre lien pour le Pack Polices
  PAYMENT_URL_TEMPLATES_AE_PS: "",  // Votre lien pour les Templates AE & PS
  PAYMENT_URL_CAPCUT: "",          // Votre lien pour la Formation CapCut
  PAYMENT_URL_BUNDLE: "",          // Votre lien pour le Pack Complet
  WHATSAPP_NUMBER: "",             // Numéro WhatsApp (ex: "22890000000")
  CONTACT_EMAIL: ""                // Email officiel
};
```

*Tant qu'un lien n'est pas configuré, le site ouvre automatiquement une fenêtre modale élégante permettant aux visiteurs de passer commande par WhatsApp ou Email.*

---

## 🚀 Comment relancer le serveur manuellement ?

Si vous redémarrez votre ordinateur, vous pouvez relancer le serveur local à tout moment via PowerShell :

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\DELL\.gemini\antigravity\scratch\auren-creatif\serve.ps1"
```

Le site sera immédiatement disponible sur `http://localhost:3000/`.
