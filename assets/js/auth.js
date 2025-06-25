/* ===============================================
   RELAXPOINT - AUTENTICAZIONE COMPLETA
   Gestione login/logout, stati header, localStorage
   =============================================== */

// ===============================================
// CONFIGURAZIONE E COSTANTI
// ===============================================
const AUTH_CONFIG = {
    STORAGE_KEYS: {
        USER: 'relaxpoint_user',
        LANGUAGE: 'relaxpoint_language'
    },
    LANGUAGES: {
        it: 'Italiano',
        en: 'English',
        fr: 'Français',
        es: 'Español'
    },
    USER_TYPES: {
        CLIENTE: 'cliente',
        PROFESSIONISTA: 'professionista',
        AZIENDA: 'azienda'
    },
    DASHBOARD_ROUTES: {
        cliente: 'pages/dashboard/dashboard-cliente.html',
        professionista: 'pages/dashboard/dashboard-professionista.html',
        azienda: 'pages/dashboard/dashboard-azienda.html'
    }
};

// ===============================================
// UTENTI DEMO PER LOCALSTORAGE SIMULATION
// ===============================================
const DEMO_USERS = {
    // CLIENTI
    'cliente@relaxpoint.it': {
        email: 'cliente@relaxpoint.it',
        password: 'password123',
        nome: 'Chiara',
        cognome: 'Rossi',
        tipo: 'cliente',
        avatar: 'assets/images/users/Leonardo_Lightning_XL_A_hyperrealistic_frontfacing_portrait_of_0.jpg'
    },

    // PROFESSIONISTI
    'professionista@relaxpoint.it': {
        email: 'professionista@relaxpoint.it',
        password: 'password123',
        nome: 'Marco',
        cognome: 'Bianchi',
        tipo: 'professionista',
        avatar: 'assets/images/Professionisti/pr2.png'
    },

    // AZIENDE
    'azienda@relaxpoint.it': {
        email: 'azienda@relaxpoint.it',
        password: 'password123',
        nome: 'Wellness',
        cognome: 'Center',
        tipo: 'azienda',
        avatar: 'assets/images/Professionisti/pr1.png'
    }
};

// ===============================================
// UTILITY FUNCTIONS PER PATH
// ===============================================
function getCorrectPath(filename) {
    const isInPages = window.location.pathname.includes('/pages/');
    const isInDashboard = window.location.pathname.includes('/dashboard/');

    if (isInDashboard) {
        return `../../${filename}`;
    } else if (isInPages) {
        return `../${filename}`;
    } else {
        return filename;
    }
}

function getCurrentPageUrl() {
    return window.location.href;
}

// ===============================================
// CLASSE GESTIONE AUTENTICAZIONE
// ===============================================
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.currentLanguage = this.getCurrentLanguage();
        this.initializeAuth();
    }

    // INIZIALIZZAZIONE
    initializeAuth() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupLoginForm();
            this.updateHeaderState();
            this.setupLanguageSelector();
            this.setupHeaderEvents();
        });
    }

    // ===============================================
    // GESTIONE UTENTE CORRENTE
    // ===============================================
    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    }

    getCurrentLanguage() {
        return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.LANGUAGE) || 'it';
    }

    saveUser(userData) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(userData));
        this.currentUser = userData;
    }

    saveLanguage(language) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.LANGUAGE, language);
        this.currentLanguage = language;
    }

    clearUser() {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
        this.currentUser = null;
    }

    // ===============================================
    // SETUP FORM LOGIN
    // ===============================================
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
    }

    // ===============================================
    // PROCESSO LOGIN
    // ===============================================
    async handleLogin(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Simula delay di rete
            await this.delay(1000);

            // Verifica credenziali
            const user = this.authenticateUser(email, password);

            if (user) {
                // Salva utente
                this.saveUser({
                    ...user,
                    loginTime: new Date().toISOString(),
                    rememberMe: !!remember
                });

                // Successo
                this.showMessage('Login effettuato con successo!', 'success');

                // Redirect alla pagina precedente o index
                setTimeout(() => {
                    const returnUrl = localStorage.getItem('returnUrl');
                    if (returnUrl) {
                        localStorage.removeItem('returnUrl');
                        window.location.href = returnUrl;
                    } else {
                        window.location.href = getCorrectPath('index.html');
                    }
                }, 1500);

            } else {
                throw new Error('Credenziali non valide');
            }

        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            // Reset button
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    // ===============================================
    // AUTENTICAZIONE UTENTE (DEMO)
    // ===============================================
    authenticateUser(email, password) {
        const user = DEMO_USERS[email];
        return (user && user.password === password) ? user : null;
    }

    // ===============================================
    // GESTIONE HEADER STATES
    // ===============================================
    updateHeaderState() {
        const isLoggedIn = !!this.currentUser;

        // Elementi header
        const btnAccedi = document.querySelector('.btn-secondary');
        const btnPrenota = document.querySelector('.btn-primary');
        const userAvatar = document.getElementById('userAvatar');
        const languageSelector = document.getElementById('languageSelector');

        if (isLoggedIn && this.currentUser) {
            // STATO LOGGED IN
            if (btnAccedi) {
                btnAccedi.textContent = 'Logout';
                btnAccedi.href = '#';
                btnAccedi.onclick = (e) => {
                    e.preventDefault();
                    this.handleLogout();
                };
            }

            // Mostra avatar se esiste
            if (userAvatar) {
                userAvatar.style.display = 'block';
                const avatarImg = userAvatar.querySelector('img');
                if (avatarImg) {
                    const basePath = window.location.pathname.includes('/pages/') ?
                        (window.location.pathname.includes('/dashboard/') ? '../../' : '../') : '';
                    avatarImg.src = basePath + this.currentUser.avatar;
                    avatarImg.alt = `${this.currentUser.nome} ${this.currentUser.cognome}`;
                }
            }

        } else {
            // STATO LOGGED OUT - CORREZIONE QUI!
            if (btnAccedi) {
                btnAccedi.textContent = 'Accedi';
                btnAccedi.href = getCorrectPath('login.html');

                // RIMOSSO preventDefault() - ora il link funziona normalmente
                // Ma prima salviamo la pagina corrente
                btnAccedi.addEventListener('click', () => {
                    localStorage.setItem('returnUrl', getCurrentPageUrl());
                });
            }

            // Nascondi avatar
            if (userAvatar) {
                userAvatar.style.display = 'none';
            }
        }

        // Aggiorna lingua
        this.updateLanguageSelector();
    }

    // ===============================================
    // LOGOUT
    // ===============================================
    handleLogout() {
        if (confirm('Sei sicuro di voler uscire?')) {
            this.clearUser();
            this.showMessage('Logout effettuato con successo!', 'success');

            setTimeout(() => {
                window.location.href = getCorrectPath('index.html');
            }, 1000);
        }
    }

    // ===============================================
    // GESTIONE CLICK AVATAR
    // ===============================================
    setupHeaderEvents() {
        // Click avatar → Dashboard
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToDashboard();
            });
        }

        // Setup altre interazioni header
        this.setupLanguageEvents();
    }

    goToDashboard() {
        if (!this.currentUser) return;

        const dashboardRoute = AUTH_CONFIG.DASHBOARD_ROUTES[this.currentUser.tipo];
        if (dashboardRoute) {
            window.location.href = getCorrectPath(dashboardRoute);
        } else {
            console.error('Dashboard non trovata per tipo utente:', this.currentUser.tipo);
        }
    }

    // ===============================================
    // GESTIONE LINGUA
    // ===============================================
    setupLanguageSelector() {
        const languageSelector = document.getElementById('languageSelector');
        if (!languageSelector) return;

        // Crea dropdown lingue
        languageSelector.innerHTML = this.generateLanguageOptions();
        languageSelector.value = this.currentLanguage;
    }

    generateLanguageOptions() {
        return Object.entries(AUTH_CONFIG.LANGUAGES)
            .map(([code, name]) => `<option value="${code}">${code.toUpperCase()}</option>`)
            .join('');
    }

    setupLanguageEvents() {
        const languageSelector = document.getElementById('languageSelector');
        if (!languageSelector) return;

        languageSelector.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }

    changeLanguage(newLanguage) {
        if (AUTH_CONFIG.LANGUAGES[newLanguage]) {
            this.saveLanguage(newLanguage);
            this.showMessage(`Lingua cambiata in ${AUTH_CONFIG.LANGUAGES[newLanguage]}`, 'success');

            // Ricarica pagina per applicare nuova lingua
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    updateLanguageSelector() {
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showMessage(message, type = 'info') {
        // Crea elemento messaggio
        const messageEl = document.createElement('div');
        messageEl.className = `auth-message auth-message-${type}`;
        messageEl.textContent = message;

        // Stili inline
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease-out',
            backgroundColor: type === 'success' ? '#10b981' :
                type === 'error' ? '#ef4444' : '#3b82f6'
        });

        // Aggiungi a body
        document.body.appendChild(messageEl);

        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // ===============================================
    // API PUBBLICA
    // ===============================================

    // Getter pubblici
    get user() {
        return this.currentUser;
    }

    get language() {
        return this.currentLanguage;
    }

    get isLoggedIn() {
        return !!this.currentUser;
    }

    // Metodi pubblici
    login(email, password) {
        return this.authenticateUser(email, password);
    }

    logout() {
        this.handleLogout();
    }

    switchLanguage(language) {
        this.changeLanguage(language);
    }
}

// ===============================================
// INIZIALIZZAZIONE GLOBALE
// ===============================================

// Crea istanza globale
window.AuthManager = AuthManager;
window.auth = new AuthManager();

// CSS per animazioni messaggi
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);

// ===============================================
// EXPORT PER MODULI (SE NECESSARIO)
// ===============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}