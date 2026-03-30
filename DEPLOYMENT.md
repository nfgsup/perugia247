# Deployment Guide - Perugia247

Guida rapida per deployare il sito in produzione.

## Opzione 1: Firebase Hosting (CONSIGLIATO)

Firebase Hosting è il metodo più semplice e include HTTPS gratis.

### Step 1: Installa Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Accedi a Firebase

```bash
firebase login
```

Questo aprirà il browser per autenticarsi. Seleziona l'account Google associato al progetto Firebase.

### Step 3: Inizializza il progetto

```bash
# Dalla cartella Perugia247
firebase init
```

Rispondi alle domande:
- Seleziona "Hosting"
- Seleziona il progetto Firebase "Perugia247"
- Public directory: `.` (il punto, significa cartella corrente)
- Configure as single-page app: `Y`
- Overwrite public/index.html: `N`

### Step 4: Deploy

```bash
firebase deploy
```

Una volta completato, vedrai un URL come:
```
Hosting URL: https://perugia247-xxxxx.web.app
```

**Fatto!** Il sito è online e accessibile da questo URL.

### Aggiornare il sito

Ogni volta che fai cambiamenti:

```bash
firebase deploy
```

## Opzione 2: GitHub Pages

Se preferisci usare GitHub Pages (gratuito ma senza HTTPS facile).

### Step 1: Crea repository GitHub

1. Vai su https://github.com/new
2. Crea repo "perugia247" (pubblico)
3. Clona il repo

### Step 2: Carica i file

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/perugia247.git
git push -u origin main
```

### Step 3: Abilita Pages

1. Vai a Settings del repository
2. Seleziona "Pages"
3. Scegli "Deploy from a branch"
4. Seleziona "main" branch

**Disponibile a**: `https://username.github.io/perugia247`

## Opzione 3: Server Web (Vercel, Netlify, ecc)

### Netlify (Semplice)

1. Vai su https://netlify.com
2. Clicca "New site from Git"
3. Seleziona GitHub
4. Seleziona repository
5. Deploy basico:
   - Build command: (lascia vuoto)
   - Publish directory: `.`
6. Clicca "Deploy site"

**Disponibile a**: `https://perugia247-xxxxx.netlify.app`

## Opzione 4: Self-Hosted (VPS/Server)

Se hai un server proprio:

### Con Apache

```bash
# Copia i file nella cartella web
cp -r /home/sup/Documents/perugia/Perugia247/* /var/www/html/perugia247/

# Assicurati che permissions siano corretti
chmod 755 /var/www/html/perugia247
```

### Con Nginx

```bash
# Copia i file
cp -r /home/sup/Documents/perugia/Perugia247/* /var/www/perugia247/

# Crea config Nginx
sudo nano /etc/nginx/sites-available/perugia247
```

Contenuto config:
```nginx
server {
    listen 80;
    server_name perugia247.it www.perugia247.it;

    root /var/www/perugia247;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable sito:
```bash
sudo ln -s /etc/nginx/sites-available/perugia247 /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

## Setup HTTPS

### Firebase Hosting
✅ HTTPS incluso automaticamente

### Netlify
✅ HTTPS incluso automaticamente

### GitHub Pages
✅ Possibile con CloudFlare (gratuito)

### Self-Hosted con Let's Encrypt

```bash
# Installa Certbot
sudo apt install certbot python3-certbot-nginx

# Genera certificato
sudo certbot --nginx -d perugia247.it -d www.perugia247.it

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Domini Personalizzati

### Firebase Hosting
1. Vai a Firebase Console → Hosting
2. Clicca "Connect custom domain"
3. Segui le istruzioni DNS

### Netlify
1. Vai a Domain settings
2. Clicca "Add custom domain"
3. Configura i record DNS

### Server proprio
1. Compra dominio (es. perugia247.it)
2. Configura record A → IP server
3. Configura HTTPS con Let's Encrypt

## Monitoraggio

### Firebase Hosting
- Vai a Firebase Console → Hosting → Analytics
- Vedi statistiche in tempo reale

### Netlify
- Vai a Analytics nel dashboard
- Vedi build history, errori, ecc

## Rollback (Tornare a versione precedente)

### Firebase Hosting
```bash
firebase hosting:channels:list
firebase hosting:channels:deploy CHANNEL_ID
```

### GitHub Pages
```bash
git revert <commit-hash>
git push
```

## Update Periodici

Per mantenere il sito aggiornato:

1. ** Aggiorna articoli**: Direttamente dall'app
2. **Aggiorna codice**: Solo se modifiche necessarie
3. **Aggiorna Firebase SDK**: Ogni 6 mesi
   - Modifica versione in index.html: `firebase-app.js?9.6.0` → versione nuova

## Suggerimenti Produzione

1. **Monitoring**
   - Imposta uptime monitoring
   - Configura avvisi errori

2. **Backup**
   - Backup giornaliero Firebase Realtime Database
   - Backup storage immagini

3. **Security**
   - Rivedi Security Rules regularmente
   - Abilita 2FA per account Firebase
   - Monitora accessi admin

4. **Performance**
   - Usa CDN (incluso in Firebase Hosting)
   - Comprimi immagini articoli
   - Minifica CSS/JS se modifichi

5. **SEO**
   - Aggiungi meta tags in index.html
   - Google Search Console
   - Sitemap (generabile da tools online)

## Troubleshooting Deploy

### "Permission denied"
```bash
# Assicurati di essere loggato
firebase login:list
firebase logout
firebase login
```

### "Project not found"
```bash
# Controlla se il progetto esiste
firebase projects:list

# Se non lo vedi, selezionalo manualmente
firebase init --project=PROJECT_ID
```

### "Hosting URL non funziona"
- Attendi 5 minuti per propagazione DNS
- Controlla che firebase.json sia corretto
- Svuota cache browser (Ctrl+Shift+Del)

## Contatti

Problemi con il deploy?
- Ilaria Vocale
- Raffaele Coco

---

Ultima modifica: Marzo 2026
Perugia247 News
