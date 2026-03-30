# Perugia247 - Tips e Best Practices

## 📝 Scrivere Articoli Efficaci

### Struttura consigliata
1. **Titolo accattivante** - Cattura l'attenzione
2. **Incipit forte** - Prime righe interessanti
3. **Corpo articolo** - Sviluppa il tema
4. **Conclusione** - Resume messaggio principale
5. **Allegati** - Supporta con prove/documenti

### Tips per SEO
- Usa keywords rilevanti nel titolo e inizio articolo
- Scrivi titoli chiari e descrittivi
- Organizza il testo con paragrafi
- Usa nomi propri e specifici (es. "Via Corso Vannucci" non "via importante")

## 🖼️ Allegati

### Tipi di file supportati
- **Immagini**: JPG, PNG, GIF, WebP
- **Documenti**: PDF, DOCX, XLSX
- **Video**: MP4, WebM (se il server lo permette)

### Limiti
- Massimo 10MB per file
- Per immagini grandi, comprimi prima di caricare
- Usa nomi descrittivi per i file

### Compressione immagini
Su Linux:
```bash
# Compressione JPEG
convert immagine.jpg -quality 85 immagine_compressed.jpg

# Compressione PNG
optipng -o2 immagine.png
```

## 🔐 Sicurezza Account

- **Mai condividere password**
- **Password forti**: Almeno 12 caratteri, lettere, numeri, simboli
- **Logout quando finisci**: Specialmente su computer pubblici
- **Non salvare password nel browser**: Su computer condivisi

## 🚀 Ottimizzazioni

### Per velocità
- Comprimi immagini prima di caricare
- Usa descrizioni concise negli articoli
- Limita numero di articoli in home (configurabile nel codice)

### Per mobile
- Scrivi testi leggibili da piccoli schermi
- Fai paragrafi brevi
- Evita testi troppo lunghi senza break

## 📊 Monitoraggio

### Cosa controllare regolarmente
- Numero di articoli pubblicati
- Engagement (visualizzazioni)
- Errori nella console del browser (F12)
- Spazio storage utilizzato su Firebase

### Eliminare articoli obsoleti
1. Accedi a Firebase Console
2. Vai a Realtime Database
3. Seleziona l'articolo
4. Clicca sull'icona cestino

## 🎨 Personalizzazione

### Cambiar colori
Modificare colori in `styles.css`:
- `#1a4d8f` - Blu principale (navigazione)
- `#ffd700` - Oro (accenti)
- `#007bff` - Blu secondario (pulsanti)

### Aggiungere categorie
Nel futuro puoi estendere con:
- Campo "categoria" negli articoli
- Filtri per categoria
- Topic-specific pages

## 🐛 Troubleshooting Comune

### Articolo non si pubblica
- Controlla connessione internet
- Verifica di essere loggato (pulsante verde)
- Vedi console (F12) per errori Firebase
- Controlla spazio storage Firebase

### Immagini non si vedono
- Controlla le Storage Rules in Firebase
- Verifica che l'URL sia corretto
- Prova a caricare di nuovo il file

### Login non funziona
- Verifica username e password (case-sensitive)
- Username è senza @perugia247.local
- Controlla di aver creato l'utente in Firebase Console
- Controlla Security Rules di Authentication

## 📈 Crescita del Sito

### Strategie consigliate
1. Pubblica articoli regolarmente (es. 2-3 a settimana)
2. Tratta argomenti di interesse locale
3. Includi fonti e riferimenti
4. Rispondi ai commenti (quando abilitati)
5. Condividi su social media

### Argomenti da coprire
- Notizie locali Perugia
- Eventi culturali
- Economia locale
- Ambiente e sviluppo sostenibile
- Storie della comunità

## 🤝 Collaborazione

### Aggiungere nuovi autori
1. Vai a Firebase Console → Authentication
2. Crea nuovo utente (es. $nome@perugia247.local)
3. Comunica username e password in modo sicuro
4. L'utente potrà subito creare articoli

### Best practice per team
- Stabilisci uno stile editoriale comune
- Usa nomenclatura consistente per titoli
- Coordina copy per evitare duplicati
- Fai review articoli prima della pubblicazione

## 📱 Accesso Mobile

L'app è fully responsive! Per usarla su mobile:
1. Apri dall'URL del sito (metti online su server)
2. Usa mobile browser
3. Tutti i pulsanti e form sono optimizzati per touch

### Tips mobile
- Testi più brevi (lettura su piccolo schermo)
- Paragrafi separati
- Usa elenchi puntati
- Evita tabelle complesse

## ⚙️ Manutenzione

### Compiti settimanali
- Controllare nuovi articoli
- Monitorare feedback (quando disponibile)

### Compiti mensili
- Review statistiche Firebase
- Pulire articoli old (opzionale)
- Backup dati (configurare in Firebase)

### Compiti annuali
- Rinnovare credenziali se cambiano
- Aggiornare dipendenze Firebase SDK
- Revisione delle Security Rules

## Contatti Supporto

Domande o problemi?
- **Ilaria Vocale**: [email]
- **Raffaele Coco**: [email]

---

Ultima modifica: Marzo 2026
Perugia247 News
