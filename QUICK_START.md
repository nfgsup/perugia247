# Quick Start - Perugia247

Inizia in 5 minuti! 🚀

## ⚡ Opzione rapida (con config.js)

Se hai il file `config.js`:
1. Apri `index.html`
2. **FATTO!** È già configurato

Per aggiornare configurazione: click "Configurazione Firebase" in basso.

---

## 1️⃣ Apri il sito

Doppio click su `index.html` oppure:
```bash
# Da cartella Perugia247
python3 -m http.server 8000
# Poi vai a http://localhost:8000
```

## 2️⃣ Configura Firebase (se non hai config.js)

1. Clicca link "Configurazione Firebase" in basso pagina
2. Copia questi dati da https://console.firebase.google.com/
3. Inserisci nei 6 campi
4. Click "Salva Configurazione"

**Dati da copiare:**
- **API Key** → Vai a Project Settings → Web → apiKey
- **Auth Domain** → Vai a Project Settings → Web → authDomain
- **Project ID** → Vai a Project Settings → Web → projectId
- **Storage Bucket** → Vai a Project Settings → Web → storageBucket
- **Messaging Sender ID** → Vai a Project Settings → Web → messagingSenderId
- **App ID** → Vai a Project Settings → Web → appId

## 3️⃣ Crea primo account

1. Accedi a https://console.firebase.google.com/
2. Vai a Authentication → Users
3. Clicca "Add user"
4. Email: `ilaria@perugia247.local` (esempio)
5. Password: `tuaPassword123`
6. Click "Add user"

## 4️⃣ Login e pubblica primo articolo

1. Click "Login" su sito
2. Username: `ilaria` (senza @perugia247.local)
3. Password: `tuaPassword123`
4. Click "Nuovo Articolo"
5. Riempi form e pubblica!

## 📋 Articoli essenziali

Per configurazione completa leggi in ordine:
1. **FIREBASE_SETUP.md** - Come setupare Firebase da zero
2. **DEPLOYMENT.md** - Come mettere online il sito
3. **TIPS_AND_BEST_PRACTICES.md** - Consigli utenti

## ⌨️ Comandi Utili

```bash
# Testare localmente
python3 -m http.server 8000

# Se hai Node.js
npx http-server -p 8000

# Deploy su Firebase (dopo setup)
firebase deploy

# Vedi logs
firebase hosting:logs
```

## 🔐 Sicurezza Credenziali

**config.js** contiene credenziali Firebase:
- ✅ Aggiunto a .gitignore (non lo committa)
- ✅ Credenziali Firebase sono "pubbliche" (di default nel browser)
- ✅ Non usare dati sensibili in config.js
- ✅ In produzione, imposta Security Rules su Firebase

Quando **deployi online**:
1. Non includere config.js nel repo pubblico
2. Configura credenziali tramite UI (localStorage)
3. O usa Firebase Hosting (gestisce credenziali automaticamente)

## 🆘 Problema Comune?

**"Firebase non è configurato"**
→ Controlla che config.js esista oppure configura tramite UI

**"Username o password sbagliati"**
→ Verifica di aver creato l'utente in Firebase Console (step 3)
→ Ricorda: username è primo parte (ilaria, non ilaria@perugia247.local)

**"Come visualizzo articoli?"**
→ Non serve login per leggere! Pubblica un articolo e vedrai nella home

**"Posso aggiungere immagini?"**
→ Si! Nel form articolo, clicca su "Allega file"

## 🎯 Prossimi step

- [ ] Verifica config.js (o configura via UI)
- [ ] Crea primo utente
- [ ] Pubblica primo articolo  
- [ ] Invita altri autori
- [ ] Metti online (DEPLOYMENT.md)
- [ ] Aggiungi dominio personalizzato

## 📞 Contatti

Ilaria Vocale | Raffaele Coco

© 2026 Perugia247
