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
    setupEditorToolbar();
    initDarkMode();
    initImagePreview();
    initScrollAnimations();
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

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

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
        firebaseConfig = DEFAULT_PUBLIC_FIREBASE_CONFIG;
        initializeFirebase();
    }

    if (!auth) {
        showMessage('loginError', 'Firebase non inizializzato. Ricarica la pagina e riprova.');
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
    const subtitle = document.getElementById('articleSubtitle').value;
    const author = document.getElementById('articleAuthor').value;
    const contentEditor = document.getElementById('articleContent');
    const contentHtml = contentEditor.innerHTML.trim();
    const contentText = contentEditor.innerText.trim();
    const fileInput = document.getElementById('articleFile');
    const isBreaking = document.getElementById('isBreaking').checked;
    const isFeatured = document.getElementById('isFeatured').checked;
    const category = document.getElementById('articleCategory').value;

    if (!contentText) {
        showMessage('articleError', 'Inserisci il contenuto dell\'articolo');
        return;
    }

    try {
        showMessage('articleSuccess', '⏳ Pubblicazione in corso...');

        const articleData = {
            title: title,
            subtitle: subtitle,
            author: author,
            content: contentText,
            contentHtml: contentHtml,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            attachmentUrl: null,
            attachmentName: null,
            isBreaking: isBreaking,
            isFeatured: isFeatured,
            category: category
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
        contentEditor.innerHTML = '';
        document.getElementById('isBreaking').checked = false;
        document.getElementById('isFeatured').checked = false;
        document.getElementById('imagePreview').style.display = 'none';
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
        // Show skeleton loaders
        articlesList.innerHTML = Array(6).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `).join('');

        database.ref('articles').orderByChild('createdAt').limitToLast(50).once('value', snapshot => {
            const articles = [];
            snapshot.forEach(childSnapshot => {
                articles.unshift({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            if (articles.length === 0) {
                articlesList.innerHTML = '<div class="empty-state"><h3>📭 Non ci sono articoli ancora</h3><p>Effettua il login e crea il primo articolo!</p></div>';
                return;
            }

            // Separate articles by type
            const breakingArticles = articles.filter(a => a.isBreaking);
            const featuredArticles = articles.filter(a => a.isFeatured && !a.isBreaking);
            const regularArticles = articles.filter(a => !a.isBreaking && !a.isFeatured);

            // Update breaking news ticker
            updateBreakingTicker(breakingArticles);

            // Breaking News Section
            const breakingSection = document.getElementById('breakingSection');
            const breakingList = document.getElementById('breakingNewsList');
            if (breakingArticles.length > 0) {
                breakingList.innerHTML = '';
                breakingArticles.forEach(article => {
                    breakingList.appendChild(createArticleCard(article, article.id));
                });
                breakingSection.style.display = 'block';
            } else {
                breakingSection.style.display = 'none';
            }

            // Featured Section
            const featuredSection = document.getElementById('featuredSection');
            const featuredList = document.getElementById('featuredList');
            if (featuredArticles.length > 0) {
                featuredList.innerHTML = '';
                featuredArticles.forEach(article => {
                    featuredList.appendChild(createArticleCard(article, article.id));
                });
                featuredSection.style.display = 'block';
            } else {
                featuredSection.style.display = 'none';
            }

            // Regular Articles
            articlesList.innerHTML = '';
            if (regularArticles.length === 0) {
                articlesList.innerHTML = '<div class="empty-state"><p>Nessun articolo regolare al momento</p></div>';
            } else {
                regularArticles.forEach(article => {
                    articlesList.appendChild(createArticleCard(article, article.id));
                });
            }
        });
    } catch (error) {
        console.error('Load articles error:', error);
        articlesList.innerHTML = '<div class="error-message">Errore nel caricamento degli articoli</div>';
    }
}

// Crea card articolo (vecchia versione - ora sostituita dalla nuova createArticleCard più sotto)
function createArticleCardOld(article) {
    const card = document.createElement('div');
    card.className = 'article-card';

    const date = new Date(article.createdAt);
    const formattedDate = date.toLocaleDateString('it-IT');

    const plainContent = article.contentText || article.content || stripHtml(article.contentHtml || '');
    const preview = plainContent.length > 150 ? `${plainContent.substring(0, 150)}...` : plainContent;

    card.innerHTML = `
        <h3>${escapeHtml(article.title)}</h3>
        ${article.subtitle ? `<p class="article-subtitle">${escapeHtml(article.subtitle)}</p>` : ''}
        <div class="article-meta">
            <span><strong>Di:</strong> ${escapeHtml(article.author)}</span>
            <span>${formattedDate}</span>
        </div>
        <p class="article-preview">${escapeHtml(preview)}</p>
        <button class="btn btn-primary" onclick="viewArticle('${article.id}')">Leggi Tutto</button>
    `;

    return card;
}

// Visualizza articolo completo
async function showArticleDetail(articleId, article) {
    try {
        // If article not passed, fetch it
        if (!article) {
            const snapshot = await database.ref('articles/' + articleId).once('value');
            article = snapshot.val();
        }

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
        const subtitleElement = document.getElementById('detailSubtitle');
        subtitleElement.textContent = article.subtitle || '';
        subtitleElement.style.display = article.subtitle ? 'block' : 'none';
        document.getElementById('detailAuthor').innerHTML = `<strong>Autore:</strong> ${escapeHtml(article.author)}`;
        document.getElementById('detailDate').textContent = formattedDate;

        const detailContent = document.getElementById('detailContent');
        
        // Add featured image if available
        let imageHtml = '';
        if (article.attachmentUrl && article.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            imageHtml = `<img src="${article.attachmentUrl}" alt="${escapeHtml(article.title)}" class="article-full-image">`;
        }
        
        if (article.contentHtml) {
            detailContent.innerHTML = imageHtml + sanitizeHtml(article.contentHtml);
        } else {
            detailContent.innerHTML = imageHtml;
            const textNode = document.createTextNode(article.content || '');
            detailContent.appendChild(textNode);
        }

        // Mostra allegato se presente (e non è un'immagine già mostrata)
        const attachmentDiv = document.getElementById('detailAttachment');
        if (article.attachmentUrl && !article.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            attachmentDiv.innerHTML = `
                <strong>📎 Allegato:</strong><br>
                <a href="${article.attachmentUrl}" target="_blank" download="${article.attachmentName}">
                    📥 Scarica: ${escapeHtml(article.attachmentName)}
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

// Keep old function name for backward compatibility
async function viewArticle(articleId) {
    return showArticleDetail(articleId);
}

function setupEditorToolbar() {
    const editor = document.getElementById('articleContent');
    const toolbar = document.getElementById('editorToolbar');

    if (!editor || !toolbar) {
        return;
    }

    toolbar.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) {
            return;
        }

        const command = button.dataset.command;
        if (!command) {
            return;
        }

        event.preventDefault();
        editor.focus();

        if (command === 'createLink') {
            const url = prompt('Inserisci URL del link:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
            return;
        }

        if (command === 'formatBlock') {
            document.execCommand(command, false, button.dataset.value || 'p');
            return;
        }

        document.execCommand(command, false, null);
    });

    const clearButton = document.getElementById('clearFormatBtn');
    if (clearButton) {
        clearButton.addEventListener('click', (event) => {
            event.preventDefault();
            editor.innerText = editor.innerText;
        });
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

function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function sanitizeHtml(inputHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputHtml, 'text/html');
    const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'H3', 'BLOCKQUOTE', 'A']);

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
    const nodes = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
        if (!allowedTags.has(node.tagName)) {
            const textNode = doc.createTextNode(node.textContent || '');
            node.parentNode.replaceChild(textNode, node);
            return;
        }

        if (node.tagName === 'A') {
            const href = node.getAttribute('href') || '';
            if (!href.startsWith('http://') && !href.startsWith('https://')) {
                node.removeAttribute('href');
            }
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }

        const attrs = [...node.attributes];
        attrs.forEach((attr) => {
            if (node.tagName === 'A' && ['href', 'target', 'rel'].includes(attr.name)) {
                return;
            }
            node.removeAttribute(attr.name);
        });
    });

    return doc.body.innerHTML;
}

// Dark Mode Functions
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.textContent = isDark ? '☀️' : '🌙';
    }
}

// Image Preview Functions
function initImagePreview() {
    const fileInput = document.getElementById('articleFile');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeBtn = document.getElementById('removePreview');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    previewImg.src = ev.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            fileInput.value = '';
            preview.style.display = 'none';
            previewImg.src = '';
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe article cards when they're created
    window.observeArticleCard = (card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    };
}

// Breaking News Ticker
function updateBreakingTicker(articles) {
    const ticker = document.getElementById('breakingNewsTicker');
    const tickerText = document.getElementById('tickerText');
    
    const breakingArticles = articles.filter(a => a.isBreaking);
    
    if (breakingArticles.length > 0) {
        const titles = breakingArticles.map(a => a.title).join(' • ');
        tickerText.textContent = titles;
        ticker.style.display = 'flex';
    } else {
        ticker.style.display = 'none';
    }
}

// Get category emoji
function getCategoryEmoji(category) {
    const emojis = {
        'generale': '📰',
        'politica': '🏛️',
        'cronaca': '🚨',
        'sport': '⚽',
        'cultura': '🎭',
        'economia': '💼'
    };
    return emojis[category] || '📰';
}

// Create enhanced article card
function createArticleCard(article, articleId) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    if (article.isBreaking) {
        card.classList.add('breaking-card');
    }
    if (article.isFeatured) {
        card.classList.add('featured-card');
    }
    
    // Image
    let imageHtml = '';
    if (article.attachmentUrl && article.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        imageHtml = `<img src="${article.attachmentUrl}" alt="${escapeHtml(article.title)}" class="article-image" onerror="this.style.display='none'">`;
    }
    
    // Badges
    let badgesHtml = '';
    const badges = [];
    if (article.isBreaking) {
        badges.push('<span class="badge badge-breaking">🔴 BREAKING</span>');
    }
    if (article.isFeatured) {
        badges.push('<span class="badge badge-featured">⭐ IN EVIDENZA</span>');
    }
    if (article.category) {
        const emoji = getCategoryEmoji(article.category);
        badges.push(`<span class="badge badge-category">${emoji} ${article.category.toUpperCase()}</span>`);
    }
    if (badges.length > 0) {
        badgesHtml = `<div class="article-badges">${badges.join('')}</div>`;
    }
    
    const preview = stripHtml(article.content).substring(0, 150) + '...';
    const date = new Date(article.createdAt).toLocaleString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        ${imageHtml}
        <div class="article-content-wrapper">
            ${badgesHtml}
            <h3>${escapeHtml(article.title)}</h3>
            ${article.subtitle ? `<p class="article-subtitle">${escapeHtml(article.subtitle)}</p>` : ''}
            <div class="article-meta">
                <span><strong>${escapeHtml(article.author)}</strong></span>
                <span>${date}</span>
            </div>
            <p class="article-preview">${escapeHtml(preview)}</p>
            <button class="btn btn-primary">Leggi tutto →</button>
        </div>
    `;
    
    card.addEventListener('click', () => showArticleDetail(articleId, article));
    
    // Apply scroll animation
    if (window.observeArticleCard) {
        window.observeArticleCard(card);
    }
    
    return card;
}

