# Setup Firebase per Perugia247

Guida passo-passo per configurare Firebase per il sito Perugia247.

## Passo 1: Creazione Progetto Firebase

1. Vai su https://console.firebase.google.com/
2. Accedi con il tuo account Google (crea uno se necessario)
3. Clicca su "+ Add project"
4. Inserisci il nome: "Perugia247"
5. Disabilita Google Analytics (opzionale)
6. Clicca "Create project" e attendi il completamento

## Passo 2: Abilitare Authentication (Email/Password)

1. Nel menu di sinistra, vai a **Authentication**
2. Clicca su "Get started"
3. Seleziona **Email/Password** come Sign-in method
4. Attiva la toggle
5. Clicca "Save"

## Passo 3: Creare Realtime Database

1. Nel menu di sinistra, vai a **Realtime Database**
2. Clicca "Create Database"
3. Seleziona la location più vicina (es. europe-west1)
4. Scegli "Start in test mode" per iniziare
   - ⚠️ Ricorda: In production, imposta le security rules!
5. Clicca "Enable"

## Passo 4: Abilitare Cloud Storage

1. Nel menu di sinistra, vai a **Storage**
2. Clicca "Get started"
3. Seleziona la location più vicina
4. Clicca "Done"

## Passo 5: Ottieni Credenziali Progetto

1. Clicca sull'icona ingranaggio ⚙️ in alto a sinistra
2. Seleziona "Project settings"
3. Vai al tab "General"
4. Scorri fino a "Your apps"
5. Sotto la sezione "Web", clicca su "</>"
6. Registra l'app con il nome "Perugia247"
7. Copia la configurazione Firebase (non è pubblica, ma mantienila segreta)

La configurazione sarà simile a:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "perugia247-xxxxx.firebaseapp.com",
  projectId: "perugia247-xxxxx",
  storageBucket: "perugia247-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Passo 6: Configurare le Security Rules

1. Nel Realtime Database, vai al tab **Rules**
2. Sostituisci le regole con:

```json
{
  "rules": {
    "articles": {
      ".read": true,
      ".write": "auth != null",
      "$articleId": {
        ".validate": "newData.hasChildren(['title', 'content', 'author', 'createdAt'])"
      }
    }
  }
}
```

3. Clicca "Publish"

## Passo 7: Configurare Storage Rules

1. Nel Storage, vai al tab **Rules**
2. Sostituisci le regole con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /articles/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

3. Clicca "Publish"

## Passo 8: Creare Utenti

1. Nel menu Authentication, vai a **Users**
2. Clicca su "Add user"
3. Inserisci email: `ilaria@perugia247.local`
4. Inserisci password: (scegli una password sicura)
5. Clicca "Add user"
6. Ripeti per altri utenti (es. `raffaele@perugia247.local`)

## Passo 9: Configurare l'App Perugia247

1. Apri il file `index.html` di Perugia247 nel browser
2. Clicca su "Configurazione Firebase" in basso
3. Inserisci le credenziali ottenute al Passo 5:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
4. Clicca "Salva Configurazione"

## Passo 10: Test

1. Clicca su "Login"
2. Inserisci uno degli utenti creati al Passo 8:
   - Username: `ilaria` (senza @perugia247.local)
   - Password: (la password inserita)
3. Una volta loggati, clicca "Nuovo Articolo"
4. Crea un articolo di test
5. Verifica che appaia nella home page

## Troubleshooting

### "Firebase non è configurato"
- Assicurati di aver eseguito il Passo 9
- Controlla che tutti i campi siano compilati correttamente
- Apri la console del browser (F12) per vedere eventuali errori

### "Username o password sbagliati"
- Verifica di aver creato l'utente al Passo 8
- Ricorda che il username è solo la parte prima di @
  - Email: ilaria@perugia247.local → Username: ilaria
- Verifica la password (è case-sensitive)

### Gli articoli non vengono caricati
- Verifica le security rules
- Controlla che il Realtime Database sia stato creato
- Apri la console (F12) per vedere gli errori

### Gli allegati non vengono caricati
- Verifica che Cloud Storage sia abilitato
- Controlla le Storage Rules
- Verifica che il file sia minore di 10MB

### Le credenziali non vengono salvate
- Verifica che localStorage sia abilitato nel browser
- Prova a cancellare la cache del browser e ricaricare
- Se usi una finestra "privata", i dati non verranno salvati tra i refresh

## Sicurezza in Produzione

Prima di mettere in produzione:

1. **Non usare Test Mode in Security Rules**
   - Imposta regole che richiedono autenticazione per le scritture

2. **Abilita Authentication fornitori**
   - Limita chi può creare account

3. **Imposta limiti di rate limiting**
   - Previeni abusi nei download di file

4. **Monitora i costi Firebase**
   - Imposta avvisi se i costi superano una soglia

5. **Usa HTTPS**
   - Usa sempre HTTPS per l'app in produzione

6. **Backup regolari**
   - Configuratore backup automatici del database

## Contatti

Ilaria Vocale | Raffaele Coco

© 2026 Perugia247
