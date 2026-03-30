// Variabili globali
let firebaseConfig = null;
let firebaseApp = null;
let currentUser = null;
let auth = null;
let database = null;
let storage = null;

const DEFAULT_PUBLIC_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDax3-gM-jSuqaT-gjUrhZpd3h8ZDbRqoY",
    authDomain: "perugia247-d8ed2.firebaseapp.com",
    databaseURL: "https://perugia247-d8ed2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "perugia247-d8ed2",
    storageBucket: "perugia247-d8ed2.firebasestorage.app",
    messagingSenderId: "684669568391",
    appId: "1:684669568391:web:f03c9dda51c17188647f22"
};

// Elementi DOM
const loginModal = document.getElementById('loginModal');
const articleModal = document.getElementById('articleModal');
const articleDetailModal = document.getElementById('articleDetailModal');
const configModal = document.getElementById('configModal');

const loginBtn = document.getElementById('loginBtn');
const newArticleBtn = document.getElementById('newArticleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const configBtn = document.getElementById('configBtn');

const loginForm = document.getElementById('loginForm');
const articleForm = document.getElementById('articleForm');
const configForm = document.getElementById('configForm');

const articlesList = document.getElementById('articlesList');

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadFirebaseConfig();
    setupEventListeners();
});

// Carica configurazione Firebase
// Priorità: 1) FIREBASE_CONFIG globale (da config.js), 2) localStorage, 3) default pubblico
function loadFirebaseConfig() {
    // Prova prima globale FIREBASE_CONFIG (da config.js)
    if (typeof FIREBASE_CONFIG !== 'undefined') {
        firebaseConfig = FIREBASE_CONFIG;
        console.log('✓ Firebase config caricato da config.js');
        initializeFirebase();
        return;
    }
    
    // Altrimenti prova localStorage
    const savedConfig = localStorage.getItem('firebaseConfig');
    if (savedConfig) {
        try {
            firebaseConfig = JSON.parse(savedConfig);
            console.log('✓ Firebase config caricato da localStorage');
            initializeFirebase();
            return;
        } catch (e) {
            console.log('Firebase non configurato. Configurare prima di usare.');
        }
    }

    firebaseConfig = DEFAULT_PUBLIC_FIREBASE_CONFIG;
    console.log('✓ Firebase config caricato dal fallback pubblico');
    initializeFirebase();
}

// Inizializza Firebase
function initializeFirebase() {
    if (!firebaseConfig) return;

    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth(firebaseApp);
        database = firebase.database(firebaseApp);
        storage = firebase.storage(firebaseApp);

        // Ascolta cambiamenti di autenticazione
        auth.onAuthStateChanged(user => {
            currentUser = user;
            updateUI();
            if (user) {
                loadArticles();
            }
        });

        // Carica articoli anche se non loggato
        loadArticles();
    } catch (e) {
        console.error('Errore nell\'inizializzazione di Firebase:', e);
        showMessage('configError', 'Errore nella configurazione Firebase');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login
    loginBtn.addEventListener('click', () => openModal(loginModal));
    loginForm.addEventListener('submit', handleLogin);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Articoli
    newArticleBtn.addEventListener('click', () => openModal(articleModal));
    articleForm.addEventListener('submit', handleCreateArticle);
    document.getElementById('cancelArticleBtn').addEventListener('click', () => closeModal(articleModal));

    // Configurazione Firebase
    configBtn.addEventListener('click', () => {
        const configToShow = firebaseConfig || {};
        document.getElementById('apiKey').value = configToShow.apiKey || '';
        document.getElementById('authDomain').value = configToShow.authDomain || '';
        document.getElementById('projectId').value = configToShow.projectId || '';
        document.getElementById('storageBucket').value = configToShow.storageBucket || '';
        document.getElementById('messagingSenderId').value = configToShow.messagingSenderId || '';
        document.getElementById('appId').value = configToShow.appId || '';
        
        // Mostra avviso se config.js è caricato
        if (typeof FIREBASE_CONFIG !== 'undefined') {
            const configInfo = document.createElement('div');
            configInfo.className = 'success-message';
            configInfo.textContent = '✓ Configurazione caricata da config.js. Puoi modificarla qui per salvare in localStorage.';
            configForm.insertBefore(configInfo, configForm.firstChild);
        }
        
        openModal(configModal);
    });
    configForm.addEventListener('submit', handleConfigSubmit);

    // Chiusura Modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Chiudi modal cliccando fuori
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    if (!firebaseConfig) {
        showMessage('loginError', 'Firebase non è configurato. Configura prima nella sezione Admin.');
        return;
    }

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Crea un email dal username (username@perugia247.local)
        const email = username.toLowerCase() + '@perugia247.local';
        
        await auth.signInWithEmailAndPassword(email, password);
        closeModal(loginModal);
        loginForm.reset();
        showMessage('configSuccess', 'Login effettuato con successo!');
    } catch (error) {
        showMessage('loginError', 'Username o password sbagliati');
        console.error('Login error:', error);
    }
}

// Handle Logout
async function handleLogout() {
    try {
        await auth.signOut();
        currentUser = null;
        updateUI();
        showMessage('configSuccess', 'Logout effettuato');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Handle Create Article
async function handleCreateArticle(e) {
    e.preventDefault();

    if (!currentUser) {
        showMessage('articleError', 'Devi essere loggato per creare articoli');
        return;
    }

    const title = document.getElementById('articleTitle').value;
    const author = document.getElementById('articleAuthor').value;
    const content = document.getElementById('articleContent').value;
    const fileInput = document.getElementById('articleFile');

    try {
        showMessage('articleSuccess', 'Pubblicazione in corso...');

        const articleData = {
            title: title,
            author: author,
            content: content,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            attachmentUrl: null,
            attachmentName: null
        };

        // Carica file se presente (solo se Storage è abilitato)
        if (fileInput.files.length > 0) {
            if (!storage) {
                console.warn('⚠️ Storage non è configurato in Firebase');
                showMessage('articleError', '⚠️ Storage non è configurato in Firebase. Puoi pubblicare solo testo, senza allegati.');
                return;
            }
            try {
                const file = fileInput.files[0];
                const maxSize = 10 * 1024 * 1024; // 10MB

                if (file.size > maxSize) {
                    showMessage('articleError', 'File troppo grande. Massimo 10MB');
                    return;
                }

                console.log('📁 Caricamento file: ' + file.name + ' (' + (file.size / 1024).toFixed(2) + ' KB)');
                
                const timestamp = new Date().getTime();
                const fileName = timestamp + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const storageRef = firebase.storage(firebaseApp).ref('articles/' + fileName);

                const uploadTask = storageRef.put(file);
                
                // Monitora progress
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('📊 Upload progress: ' + progress.toFixed(0) + '%');
                    },
                    (error) => {
                        console.error('❌ Upload file error:', error);
                        showMessage('articleError', 'Errore upload file: ' + error.message);
                    }
                );
                
                await uploadTask;
                const downloadUrl = await storageRef.getDownloadURL();

                articleData.attachmentUrl = downloadUrl;
                articleData.attachmentName = file.name;
                
                console.log('✓ File caricato con successo');
            } catch (fileError) {
                console.error('❌ File processing error:', fileError);
                showMessage('articleError', 'Errore nel caricamento file: ' + fileError.message);
                return;
            }
        }

        // Salva articolo su database
        const newArticleRef = database.ref('articles').push();
        await newArticleRef.set(articleData);

        showMessage('articleSuccess', 'Articolo pubblicato con successo!');
        articleForm.reset();
        closeModal(articleModal);
        loadArticles();
    } catch (error) {
        showMessage('articleError', 'Errore nella pubblicazione: ' + error.message);
        console.error('Create article error:', error);
    }
}

// Carica articoli
async function loadArticles() {
    if (!database) {
        articlesList.innerHTML = '<div class="empty-state"><h3>Firebase non è configurato</h3></div>';
        return;
    }

    try {
        articlesList.innerHTML = '<div class="loading"><div class="spinner"></div>Caricamento articoli...</div>';

        database.ref('articles').orderByChild('createdAt').limitToLast(50).once('value', snapshot => {
            const articles = [];
            snapshot.forEach(childSnapshot => {
                articles.unshift({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            if (articles.length === 0) {
                articlesList.innerHTML = '<div class="empty-state"><h3>Non ci sono articoli ancora</h3><p>Effettua il login e crea il primo articolo!</p></div>';
                return;
            }

            articlesList.innerHTML = '';
            articles.forEach(article => {
                const articleCard = createArticleCard(article);
                articlesList.appendChild(articleCard);
            });
        });
    } catch (error) {
        console.error('Load articles error:', error);
        articlesList.innerHTML = '<div class="error-message">Errore nel caricamento degli articoli</div>';
    }
}

// Crea card articolo
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';

    const date = new Date(article.createdAt);
    const formattedDate = date.toLocaleDateString('it-IT');

    const preview = article.content.substring(0, 100) + '...';

    card.innerHTML = `
        <h3>${escapeHtml(article.title)}</h3>
        <div class="article-meta">
            <span><strong>Di:</strong> ${escapeHtml(article.author)}</span>
            <span>${formattedDate}</span>
        </div>
        <p class="article-preview">${escapeHtml(article.content.substring(0, 150))}</p>
        <button class="btn btn-primary" onclick="viewArticle('${article.id}')">Leggi Tutto</button>
    `;

    return card;
}

// Visualizza articolo completo
async function viewArticle(articleId) {
    try {
        const snapshot = await database.ref('articles/' + articleId).once('value');
        const article = snapshot.val();

        if (!article) {
            alert('Articolo non trovato');
            return;
        }

        const date = new Date(article.createdAt);
        const formattedDate = date.toLocaleDateString('it-IT', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        document.getElementById('detailTitle').textContent = article.title;
        document.getElementById('detailAuthor').innerHTML = `<strong>Autore:</strong> ${escapeHtml(article.author)}`;
        document.getElementById('detailDate').textContent = formattedDate;
        document.getElementById('detailContent').textContent = article.content;

        // Mostra allegato se presente
        const attachmentDiv = document.getElementById('detailAttachment');
        if (article.attachmentUrl) {
            attachmentDiv.innerHTML = `
                <strong>Allegato:</strong><br>
                <a href="${article.attachmentUrl}" target="_blank" download="${article.attachmentName}">
                    📎 ${escapeHtml(article.attachmentName)}
                </a>
            `;
            attachmentDiv.style.display = 'block';
        } else {
            attachmentDiv.style.display = 'none';
        }

        // Mostra pulsante elimina se sei l'autore
        const deleteBtn = document.getElementById('deleteArticleBtn');
        if (currentUser && article.createdBy === currentUser.email) {
            deleteBtn.style.display = 'inline-block';
            deleteBtn.onclick = () => deleteArticle(articleId, article);
        } else {
            deleteBtn.style.display = 'none';
        }

        openModal(articleDetailModal);
    } catch (error) {
        console.error('View article error:', error);
        alert('Errore nel caricamento dell\'articolo');
    }
}

// Delete Article
async function deleteArticle(articleId, article) {
    if (!confirm('Sei sicuro di voler eliminare questo articolo? Non si può annullare.')) {
        return;
    }

    try {
        // Elimina file allegato se presente
        if (article.attachmentUrl) {
            try {
                const fileRef = firebase.storage(firebaseApp).refFromURL(article.attachmentUrl);
                await fileRef.delete();
                console.log('✓ Allegato eliminato');
            } catch (fileDeleteError) {
                console.warn('⚠ Errore eliminazione file:', fileDeleteError);
                // Continua comunque con eliminazione articolo
            }
        }

        // Elimina articolo dal database
        await database.ref('articles/' + articleId).remove();
        
        closeModal(articleDetailModal);
        loadArticles();
        alert('Articolo eliminato con successo!');
    } catch (error) {
        console.error('Delete article error:', error);
        alert('Errore nell\'eliminazione: ' + error.message);
    }
}

// Handle Config Submit
function handleConfigSubmit(e) {
    e.preventDefault();

    const config = {
        apiKey: document.getElementById('apiKey').value,
        authDomain: document.getElementById('authDomain').value,
        projectId: document.getElementById('projectId').value,
        storageBucket: document.getElementById('storageBucket').value,
        messagingSenderId: document.getElementById('messagingSenderId').value,
        appId: document.getElementById('appId').value
    };

    try {
        localStorage.setItem('firebaseConfig', JSON.stringify(config));
        firebaseConfig = config;
        
        // Reinizializza Firebase
        if (firebaseApp) {
            firebase.app().delete();
        }
        initializeFirebase();
        
        showMessage('configSuccess', 'Configurazione Firebase salvata con successo!');
        setTimeout(() => {
            closeModal(configModal);
        }, 1500);
    } catch (error) {
        showMessage('configError', 'Errore nel salvataggio della configurazione');
        console.error('Config error:', error);
    }
}

// Update UI based on auth state
function updateUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        newArticleBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        newArticleBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

// Utility Functions
function openModal(modal) {
    modal.classList.add('show');
}

function closeModal(modal) {
    modal.classList.remove('show');
    // Pulisci eventuali messaggi di errore
    const errors = modal.querySelectorAll('.error-message');
    const successes = modal.querySelectorAll('.success-message');
    errors.forEach(el => el.style.display = 'none');
    successes.forEach(el => el.style.display = 'none');
}

function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // Auto-hide success messages
        if (elementId.includes('Success')) {
            setTimeout(() => {
                element.style.display = 'none';
            }, 3000);
        }
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
