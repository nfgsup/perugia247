# Perugia247 - Piattaforma News Ultra-Moderna 📰✨

Un sito di news locale creato da **Ilaria Vocale** e **Raffaele Coco**, completamente rinnovato con design professionale accattivante!

## 🔥 Caratteristiche Principali

### 🚨 Breaking News System
- **Banner rosso lampeggiante** con ticker animato scorrevole
- **Badge "🔴 BREAKING"** sulle notizie urgenti  
- **Sezione dedicata** con evidenziazione speciale
- **Pulse animations** per attirare l'attenzione

### ⭐ Design Ultra-Moderno
- **Gradients dinamici** ovunque (stile CNN/BBC)
- **Glassmorphism** e ombre avanzate
- **Animazioni smooth** su scroll (fade in, slide up)
- **Skeleton loaders** durante caricamento
- **Hover effects accattivanti** con ripple
- **Dark Mode toggle** 🌙 persistente
- **Responsive mobile-first** design

### 📂 Sistema Categorie & Organizzazione
- **6 categorie** con emoji colorate:
  - 📰 Generale | 🏛️ Politica | 🚨 Cronaca
  - ⚽ Sport | 🎭 Cultura | 💼 Economia
- **Articoli In Evidenza** con badge dorato ⭐
- **3 sezioni** separate: Breaking, Featured, Articoli Regolari
- **Badge visivi** per identificazione rapida

### 🖼️ Gestione Media Avanzata
- **Preview immagini** in tempo reale durante upload
- **Immagini featured** automatiche in cima agli articoli  
- Supporto **immagini, PDF, documenti**
- **Icone fancy** per download
- **Lightbox** per visualizzazione ottimizzata

### ✨ Editor di articoli - Interfaccia user-friendly per creare articoli
📱 **Responsive Design** - Funziona perfettamente su dispositivi mobili
🔐 **Autenticazione** - Sistema di login sicuro con Firebase
📎 **Allegati** - Aggiungi immagini, PDF e altri file ai tuoi articoli
🌍 **Real-time Updates** - Gli articoli si aggiornano in tempo reale
💾 **Cloud Storage** - Tutti i dati salvati su Firebase

## Setup

### 1. Configurazione Firebase

Prima di usare l'applicazione, devi configurare un progetto Firebase:

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuovo progetto
3. Abilita Authentication (Email/Password)
4. Crea una Realtime Database
5. Abilita Cloud Storage
6. Copia le tue credenziali Firebase

### 2. Avvio dell'applicazione

1. Apri il file `index.html` in un browser web
2. Clicca sul link "Configurazione Firebase" in basso
3. Inserisci le credenziali del tuo progetto Firebase
4. Salva la configurazione

### 3. Creazione account utente

Per creare account utente nel progetto Firebase:

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il tuo progetto
3. Vai a "Authentication" > "Users"
4. Clicca su "Add user"
5. Crea utenti con email nel formato: `username@perugia247.local`
   - Esempio: `ilaria@perugia247.local`

### 4. Uso dell'applicazione

- **Visualizza articoli**: Tutti gli articoli sono visibili pubblicamente
- **Login**: Clicca su "Login" e inserisci username e password
- **Crea articolo**: Dopo il login, clicca su "Nuovo Articolo"
- **Allegati**: Nella form di creazione puoi aggiungere file (max 10MB)
- **Firma articolo**: Inserisci il tuo nome come firma dell'articolo

## Struttura file

```
Perugia247/
├── index.html          # File principale HTML
├── styles.css          # Stili CSS
├── app.js              # Logica applicazione JavaScript
├── README.md           # Questo file
└── firebase-config.example.json  # Esempio configurazione
```

## Credenziali Firebase

⚠️ **IMPORTANTE**: Le credenziali Firebase NON sono hard-codated nel codice.
Vengono memorizzate in `localStorage` del browser quando configurate tramite l'interfaccia.

Per modificare le credenziali:
- Clicca su "Configurazione Firebase" in basso nella pagina
- Modifica i valori
- Salva

## Gestione articoli

### Creare un articolo
1. Effettua il login
2. Clicca su "Nuovo Articolo"
3. Inserisci:
   - Titolo articolo
   - Firma (il tuo nome)
   - Contenuto
   - Allegato (opzionale)
4. Clicca "Pubblica"

### Visualizzare articoli
- Gli articoli sono visibili a tutti
- Clicca su un articolo per leggere il contenuto completo
- Scarica eventuali allegati

## Sicurezza

- Le password NON sono salvate nel codice
- Utilizza Firebase Authentication per gestire le utenze
- I dati sono salvati in Firebase Realtime Database
- Gli allegati sono salvati in Firebase Cloud Storage
- Configura le regole di Firebase Security per proteggere i dati

## Esempio di Firebase Security Rules

```json
{
  "rules": {
    "articles": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

## Supporto

Per problemi o domande, contatta:
- Ilaria Vocale
- Raffaele Coco

## Licenza

Perugia247 © 2026
