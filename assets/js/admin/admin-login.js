// Admin Login Security System
class AdminAuthManager {
    constructor() {
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minuti
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 ore
        this.attempts = this.getAttempts();
        this.init();
    }

    init() {
        this.checkLockout();
        this.bindEvents();
        this.checkExistingSession();
    }

    bindEvents() {
        const form = document.getElementById('adminLoginForm');
        form.addEventListener('submit', (e) => this.handleLogin(e));

        // Auto-focus primo campo
        document.getElementById('email').focus();

        // Enter key navigation
        document.getElementById('email').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('password').focus();
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();

        if (this.isLockedOut()) {
            this.showLockoutMessage();
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!this.validateInput(email, password)) {
            return;
        }

        this.setLoading(true);

        try {
            // Simula delay di rete per sicurezza
            await this.delay(1000);

            if (this.validateCredentials(email, password)) {
                this.handleSuccessfulLogin(rememberMe);
            } else {
                this.handleFailedLogin();
            }
        } catch (error) {
            this.showError('Errore di connessione. Riprova.');
            console.error('Login error:', error);
        } finally {
            this.setLoading(false);
        }
    }

    validateInput(email, password) {
        if (!email || !password) {
            this.showError('Inserisci email e password');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Format email non valido');
            return false;
        }

        if (password.length < 6) {
            this.showError('Password troppo corta');
            return false;
        }

        return true;
    }

    validateCredentials(email, password) {
        // TODO: Sostituire con chiamata API reale
        // Per ora usa credenziali hardcoded per sviluppo
        const validCredentials = [
            { email: 'admin@relaxpoint.com', password: 'Admin123!' },
            { email: 'superadmin@relaxpoint.com', password: 'Super123!' }
        ];

        // ISTRUZIONI: Modifica le credenziali sopra con:
        // email: 'la-tua-email@dominio.com'
        // password: 'LaTuaPasswordSicura123!'

        return validCredentials.some(cred =>
            cred.email.toLowerCase() === email.toLowerCase() &&
            cred.password === password
        );
    }

    handleSuccessfulLogin(rememberMe) {
        // Reset attempts
        this.resetAttempts();

        // Crea sessione sicura
        const sessionData = {
            email: document.getElementById('email').value.trim(),
            timestamp: Date.now(),
            rememberMe: rememberMe,
            token: this.generateSecureToken()
        };

        // Salva sessione
        if (rememberMe) {
            localStorage.setItem('adminSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        }

        // Log accesso (da implementare con backend)
        this.logAccess(sessionData.email);

        // Redirect alla dashboard
        this.showSuccess('Accesso effettuato con successo!');
        setTimeout(() => {
            window.location.href = 'dashboard-admin.html';
        }, 1500);
    }

    handleFailedLogin() {
        this.attempts.count++;
        this.attempts.lastAttempt = Date.now();
        this.saveAttempts();

        const remainingAttempts = this.maxAttempts - this.attempts.count;

        if (remainingAttempts <= 0) {
            this.attempts.lockedUntil = Date.now() + this.lockoutTime;
            this.saveAttempts();
            this.showLockoutMessage();
        } else {
            this.showError(`Credenziali non valide. Tentativi rimasti: ${remainingAttempts}`);

            if (remainingAttempts <= 2) {
                this.showAttemptsWarning(`Attenzione: solo ${remainingAttempts} tentativi rimasti prima del blocco`);
            }
        }

        // Pulisci password
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }

    checkLockout() {
        if (this.isLockedOut()) {
            this.showLockoutMessage();
            this.disableForm(true);
        }
    }

    isLockedOut() {
        return this.attempts.lockedUntil && Date.now() < this.attempts.lockedUntil;
    }

    showLockoutMessage() {
        const remainingTime = this.attempts.lockedUntil - Date.now();
        const minutes = Math.ceil(remainingTime / (1000 * 60));
        this.showError(`Account bloccato per sicurezza. Riprova tra ${minutes} minuti.`);
    }

    checkExistingSession() {
        const session = this.getSession();
        if (session && this.isValidSession(session)) {
            // Sessione valida, redirect alla dashboard
            window.location.href = 'dashboard-admin.html';
        }
    }

    getSession() {
        const sessionData = localStorage.getItem('adminSession') ||
                           sessionStorage.getItem('adminSession');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    isValidSession(session) {
        if (!session || !session.timestamp || !session.token) {
            return false;
        }

        // Controlla scadenza
        const sessionAge = Date.now() - session.timestamp;
        if (sessionAge > this.sessionTimeout) {
            this.clearSession();
            return false;
        }

        return true;
    }

    clearSession() {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
    }

    // Utility methods
    getAttempts() {
        const stored = localStorage.getItem('adminAttempts');
        return stored ? JSON.parse(stored) : { count: 0, lastAttempt: 0, lockedUntil: null };
    }

    saveAttempts() {
        localStorage.setItem('adminAttempts', JSON.stringify(this.attempts));
    }

    resetAttempts() {
        this.attempts = { count: 0, lastAttempt: 0, lockedUntil: null };
        localStorage.removeItem('adminAttempts');
    }

    generateSecureToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logAccess(email) {
        // TODO: Implementare logging nel backend
        console.log(`Admin access: ${email} at ${new Date().toISOString()}`);
    }

    // UI Methods
    setLoading(loading) {
        const btn = document.getElementById('loginBtn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        if (loading) {
            btn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            this.disableForm(true);
        } else {
            btn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            this.disableForm(false);
        }
    }

    disableForm(disabled) {
        document.getElementById('email').disabled = disabled;
        document.getElementById('password').disabled = disabled;
        document.getElementById('rememberMe').disabled = disabled;
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.classList.add('fade-in');

        // Nascondi dopo 5 secondi
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.background = '#f0fdf4';
        errorDiv.style.borderColor = '#bbf7d0';
        errorDiv.style.color = '#15803d';
        errorDiv.classList.add('fade-in');
    }

    showAttemptsWarning(message) {
        const warningDiv = document.getElementById('attemptsWarning');
        warningDiv.textContent = message;
        warningDiv.style.display = 'block';
        warningDiv.classList.add('fade-in');
    }
}

// Global functions
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AdminAuthManager();

    // Add fade-in animation to login card
    document.querySelector('.login-card').classList.add('fade-in');
});

// Export for potential use in other files
window.AdminAuthManager = AdminAuthManager;