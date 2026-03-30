# Configurazione Firebase - Guida Completa

Come funziona il sistema di configurazione di Perugia247.

## 🎯 Priorità configurazione

L'app legge la configurazione Firebase in questo ordine:

```
1️⃣ config.js (se esiste)
   ↓ (se non trovato)
2️⃣ localStorage (credenziali salvate via UI)
   ↓ (se non trovato)
3️⃣ Mostra form di configurazione
```

## 📝 config.js - Configurazione File

Se esiste il file `config.js` con una costante `FIREBASE_CONFIG`, l'app lo usa automaticamente.

**Posizione**: `/home/sup/Documents/perugia/Perugia247/config.js`

**Contenuto di esempio**:
```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDax3-gM-jSuqaT-gjUrhZpd3h8ZDbRqoY",
  authDomain: "perugia247-d8ed2.firebaseapp.com",
  projectId: "perugia247-d8ed2",
  databaseURL: "https://perugia247-d8ed2-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "perugia247-d8ed2.firebasestorage.app",
  messagingSenderId: "684669568391",
  appId: "1:684669568391:web:f03c9dda51c17188647f22"
};
```

### Pro e Contro config.js

✅ **Vantaggi**:
- Caricamento **istantaneo** (app funziona subito)
- Ideale per **sviluppo locale**
- Facile configurazione

❌ **Svantaggi**:
- File **NON deve essere committato** (è in .gitignore)
- Se metti su GitHub pubblico, configura via UI invece
- Non adatto per **produzione** su server pubblico

## 💾 localStorage - Configurazione Browser

Le credenziali possono essere salvate anche in `localStorage` del browser.

### Come salvare in localStorage

1. Clicca "Configurazione Firebase" in basso
2. Inserisci i 6 campi:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
3. Click "Salva Configurazione"

Le credenziali vengono salvate localmente nel browser e usate per tutte le sessioni.

### Pro e Contro localStorage

✅ **Vantaggi**:
- Non è nel versioning (sicuro per GitHub)
- Facile da cambiare via UI
- Ideale per **produzione**

❌ **Svantaggi**:
- Non persiste se cancelli dati browser
- Una per browser/dispositivo
- Non condiviso tra utenti

## 🔄 Override Configurazione

Se esiste `config.js` MA salvi credenziali diverse in localStorage:

→ **localStorage ha priorità** se salvi una nuova configurazione

I step sono:
1. App legge config.js
2. Mostra credenziali in form configurazione
3. Se modifichi e clicchi "Salva", localStorage sovrascrive config.js

## 🚀 Usi Comuni

### Sviluppo Locale
```javascript
// config.js
const FIREBASE_CONFIG = {
  apiKey: "..." // credenziali demo
};
```
✅ Funziona subito, perfetto per testare

### Produzione su Server Pubblico
```
1. NON includere config.js in GitHub
2. Configura credenziali via UI
3. localStorage le salva nel browser
```
✅ Sicuro, nessuna credenziale nel versioning

### Produzione con Firebase Hosting
```bash
firebase deploy
```
✅ Firebase Hosting gestisce tutto automaticamente, basta fare login

### Produzione su Server Privato
```
1. Copia config.js sul server privato
2. Non farne git push da server
3. Oppure usa variabili d'ambiente
```
✅ Secure perché server è privato

## 🔐 Sicurezza

### Credenziali Firebase sono "pubbliche"?

Sì! Per design:
- Le credenziali Firebase vanno nel browser **obbligatoriamente**
- Chiunque legga il browser può vederle (dev tools)
- **Non sono segrete** - proteggi con Security Rules di Firebase

### Come proteggere?

1. **Security Rules** - Firebase Database
```json
{
  "rules": {
    "articles": {
      ".read": true,
      ".write": "auth != null && root.child('articles').child($articleId).child('createdBy').val() === auth.uid"
    }
  }
}
```

2. **Storage Rules** - Firebase Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /articles/{allPaths=**} {
    allow read: if true;
    allow write: if request.auth != null;
  }
}
```

3. **Authentication Rules** - Limita creazione account
   - Disabilita sign-up pubblico
   - Crea account solo da console Firebase

### Non Mettere i Credenziali Sensibili in config.js

> ⚠️ Ricorda: **config.js riceve sempre il Browser!**

**Mai mettere**:
- ❌ API keys segrete di backend
- ❌ Token admin Firebase
- ❌ Credenziali database

**Puoi mettere**:
- ✅ Credenziali pubbliche Firebase (sono per il browser)
- ✅ Project ID
- ✅ App ID

## 📋 Checklist Deploy

Prima di mettere **Perugia247 online**:

- [ ] **GitHub Pubblico**: Niente config.js
  - [ ] .gitignore include config.js
  - [ ] Non committare credenziali

- [ ] **Firebase Hosting**: Usa `firebase deploy`
  - [ ] Credenziali gestite automaticamente

- [ ] **Server Custom**: Configura via UI
  - [ ] localStorage salva credenziali
  - [ ] Niente config.js in versioning

- [ ] **Sviluppo Locale**: Usa config.js
  - [ ] Non per GitHub
  - [ ] Test veloce localmente

## 🆘 Troubleshooting

### "Firebase non è configurato"
- [ ] Controlla che config.js esista (con FIREBASE_CONFIG)
- [ ] Oppure clicca "Configurazione Firebase" e salva credenziali
- [ ] Apri dev tools (F12) → Console per vedere errori

### "Modifiche non si salvano"
- [ ] Controlla localStorage:
  - F12 → Application → localStorage
  - Cerca "firebaseConfig"
- [ ] Se non c'è, clicca "Salva Configurazione" di nuovo

### "Credenziali cambiate ma app usa vecchie"
- [ ] Reload pagina (F5)
- [ ] Cancella cache browser (Ctrl+Shift+Del)
- [ ] Controlla localStorage se config.js viene ignorata

### "config.js non viene caricato"
- [ ] Apri dev tools (F12) → Network
- [ ] Controlla se config.js viene richiesto
- [ ] Se errore 404, il file non esiste
- [ ] Controlla che sia nella cartella giusta

## 📚 File Rilevanti

- **config.js** - Configurazione Firebase (aggiunto a .gitignore)
- **app.js** - Logica che legge config.js / localStorage
- **.gitignore** - Esclude config.js dal versioning
- **index.html** - Importa config.js prima di app.js

## Contatti

Domande sulla configurazione?
- Ilaria Vocale
- Raffaele Coco

---

© 2026 Perugia247
