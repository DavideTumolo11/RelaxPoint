/**
 * RELAXPOINT ACCESS SYSTEM
 * Sistema unificato per gestione accessi: Corsi, Servizi, Last Minute
 */

class RelaxPointAccessSystem {
    constructor() {
        this.baseURL = 'https://api.relaxpoint.com'; // In produzione
        this.currentUser = null;
        this.activeSessions = new Map();
        this.init();
    }

    /**
     * Inizializzazione sistema
     */
    init() {
        this.loadUserSession();
        this.setupMessageListener();
        console.log('🔐 RelaxPoint Access System initialized');
    }

    /**
     * ===============================================
     * GENERAZIONE CODICI ACCESSO POST-PAGAMENTO
     * =============================================== */

    /**
     * Genera codice accesso dopo pagamento completato
     */
    async generateAccessCode(paymentData) {
        const accessCode = {
            // IDENTIFICATIVI
            id: this.generateSecureId(),
            code: this.generateUserFriendlyCode(paymentData.type),
            userId: paymentData.userId,
            professionalId: paymentData.professionalId,

            // TIPOLOGIA SERVIZIO
            type: paymentData.type, // 'course', 'service', 'last_minute'
            serviceId: paymentData.serviceId,
            serviceName: paymentData.serviceName,

            // ACCESSI E DURATA
            totalSessions: this.getTotalSessions(paymentData),
            usedSessions: 0,
            expiryDate: this.calculateExpiryDate(paymentData),

            // SICUREZZA
            deviceFingerprint: await this.getDeviceFingerprint(),
            ipAddress: await this.getUserIP(),
            securityToken: this.generateSecurityToken(),

            // METADATI
            createdAt: new Date().toISOString(),
            price: paymentData.price,
            paymentId: paymentData.paymentId,
            status: 'active'
        };

        // Salva nel database
        await this.saveAccessCode(accessCode);

        // Invia via chat interna
        await this.sendCodeViaInternalChat(accessCode);

        return accessCode;
    }

    /**
     * Calcola numero sessioni totali in base al tipo
     */
    getTotalSessions(paymentData) {
        switch (paymentData.type) {
            case 'course':
                return paymentData.courseData?.lessons || 16; // Es: 16 lezioni
            case 'service':
                return 1; // Singola sessione
            case 'last_minute':
                return 1; // Singola sessione
            default:
                return 1;
        }
    }

    /**
     * Calcola data scadenza in base al tipo
     */
    calculateExpiryDate(paymentData) {
        const now = new Date();

        switch (paymentData.type) {
            case 'course':
                // Corsi: durata in settimane
                const weeks = paymentData.courseData?.duration || 8;
                return new Date(now.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000));

            case 'service':
                // Servizi: 24 ore dall'orario prenotato
                const serviceDate = new Date(paymentData.scheduledDateTime);
                return new Date(serviceDate.getTime() + (24 * 60 * 60 * 1000));

            case 'last_minute':
                // Last minute: 2 ore dalla prenotazione
                return new Date(now.getTime() + (2 * 60 * 60 * 1000));

            default:
                return new Date(now.getTime() + (24 * 60 * 60 * 1000));
        }
    }

    /**
     * Genera codice user-friendly
     */
    generateUserFriendlyCode(type) {
        const prefix = this.getCodePrefix(type);
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const year = new Date().getFullYear().toString().slice(-2);

        return `${prefix}-${random}-${year}`;
    }

    /**
     * Ottieni prefisso codice in base al tipo
     */
    getCodePrefix(type) {
        switch (type) {
            case 'course': return 'RLX-CRS';
            case 'service': return 'RLX-SRV';
            case 'last_minute': return 'RLX-LM';
            default: return 'RLX-GEN';
        }
    }

    /**
     * ===============================================
     * VALIDAZIONE E ACCESSO
     * =============================================== */

    /**
     * Valida codice accesso inserito dall'utente
     */
    async validateAccessCode(inputCode, userId) {
        try {
            // Normalizza input
            const code = inputCode.trim().toUpperCase();

            // Recupera da database
            const accessData = await this.getAccessCodeFromDB(code);

            if (!accessData) {
                return {
                    valid: false,
                    error: 'INVALID_CODE',
                    message: 'Codice non valido o scaduto'
                };
            }

            // Verifica proprietario
            if (accessData.userId !== userId) {
                return {
                    valid: false,
                    error: 'UNAUTHORIZED',
                    message: 'Codice non autorizzato per questo utente'
                };
            }

            // Verifica scadenza
            if (new Date() > new Date(accessData.expiryDate)) {
                return {
                    valid: false,
                    error: 'EXPIRED',
                    message: 'Codice scaduto'
                };
            }

            // Verifica sessioni rimanenti
            if (accessData.usedSessions >= accessData.totalSessions) {
                return {
                    valid: false,
                    error: 'NO_SESSIONS',
                    message: 'Nessuna sessione rimanente'
                };
            }

            // Verifica device/IP se richiesto
            const securityCheck = await this.performSecurityCheck(accessData);
            if (!securityCheck.valid) {
                return {
                    valid: false,
                    error: 'SECURITY_FAILED',
                    message: securityCheck.message
                };
            }

            return {
                valid: true,
                accessData: accessData,
                remainingSessions: accessData.totalSessions - accessData.usedSessions,
                expiryDate: accessData.expiryDate
            };

        } catch (error) {
            console.error('Error validating access code:', error);
            return {
                valid: false,
                error: 'SYSTEM_ERROR',
                message: 'Errore di sistema. Riprova più tardi.'
            };
        }
    }

    /**
     * Avvia sessione di accesso
     */
    async startSession(accessData) {
        try {
            // Genera token sessione temporaneo (5-10 minuti)
            const sessionToken = this.generateSessionToken();
            const sessionData = {
                sessionId: this.generateSecureId(),
                accessCodeId: accessData.id,
                userId: accessData.userId,
                professionalId: accessData.professionalId,
                serviceType: accessData.type,
                serviceId: accessData.serviceId,
                sessionToken: sessionToken,
                startTime: new Date().toISOString(),
                expiryTime: new Date(Date.now() + (10 * 60 * 1000)).toISOString(), // 10 minuti
                status: 'active'
            };

            // Salva sessione attiva
            await this.saveActiveSession(sessionData);
            this.activeSessions.set(sessionData.sessionId, sessionData);

            // Incrementa uso sessione nel codice accesso
            await this.incrementSessionUsage(accessData.id);

            // Avvia auto-cleanup sessione
            this.scheduleSessionCleanup(sessionData.sessionId, 10 * 60 * 1000);

            return {
                success: true,
                sessionData: sessionData,
                accessUrl: this.generateAccessUrl(sessionData)
            };

        } catch (error) {
            console.error('Error starting session:', error);
            return {
                success: false,
                error: 'Failed to start session'
            };
        }
    }

    /**
     * ===============================================
     * GESTIONE VIDEO LIVE E CONTENUTI
     * =============================================== */

    /**
     * Genera URL accesso per sessione video
     */
    generateAccessUrl(sessionData) {
        const baseUrl = window.location.origin;
        const params = new URLSearchParams({
            session: sessionData.sessionToken,
            type: sessionData.serviceType,
            id: sessionData.serviceId
        });

        return `${baseUrl}/live-session.html?${params.toString()}`;
    }

    /**
     * Verifica token sessione per accesso video
     */
    async verifySessionToken(token) {
        const session = Array.from(this.activeSessions.values())
            .find(s => s.sessionToken === token);

        if (!session) {
            return { valid: false, error: 'Invalid session token' };
        }

        if (new Date() > new Date(session.expiryTime)) {
            this.activeSessions.delete(session.sessionId);
            return { valid: false, error: 'Session expired' };
        }

        return { valid: true, session: session };
    }

    /**
     * ===============================================
     * CHAT INTERNA E NOTIFICHE
     * =============================================== */

    /**
     * Invia codice via chat interna (dopo pagamento)
     */
    async sendCodeViaInternalChat(accessData) {
        const chatMessage = this.createCodeMessage(accessData);

        // Simula invio via chat (in produzione: WebSocket/API)
        setTimeout(() => {
            this.displayChatNotification(chatMessage);
        }, 2000);

        // Log per debug
        console.log('[MOBILE] Codice inviato via chat:', accessData.code);
    }

    /**
     * Crea messaggio chat con codice
     */
    createCodeMessage(accessData) {
        const typeText = this.getServiceTypeText(accessData.type);
        const sessionsText = accessData.totalSessions === 1
            ? 'sessione'
            : `${accessData.totalSessions} sessioni`;

        return {
            type: 'access_code',
            from: 'RelaxPoint System',
            timestamp: new Date().toISOString(),
            message: `🎯 Il tuo codice di accesso per "${accessData.serviceName}" è pronto!`,
            code: accessData.code,
            details: {
                service: accessData.serviceName,
                type: typeText,
                sessions: sessionsText,
                expiry: this.formatDate(accessData.expiryDate),
                instructions: this.getAccessInstructions(accessData.type)
            }
        };
    }

    /**
     * Mostra notifica chat
     */
    displayChatNotification(message) {
        // Crea elemento notifica
        const notification = document.createElement('div');
        notification.className = 'chat-notification';
        notification.innerHTML = `
            <div class="notification-header">
                <i class="fas fa-comments"></i>
                <span>Nuovo messaggio da RelaxPoint</span>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">
                <p>${message.message}</p>
                <div class="access-code-display">
                    <strong>Codice: ${message.code}</strong>
                </div>
                <div class="access-details">
                    <p><strong>Servizio:</strong> ${message.details.service}</p>
                    <p><strong>Tipo:</strong> ${message.details.type}</p>
                    <p><strong>Sessioni:</strong> ${message.details.sessions}</p>
                    <p><strong>Scade:</strong> ${message.details.expiry}</p>
                </div>
                <div class="access-instructions">
                    <p><em>${message.details.instructions}</em></p>
                </div>
                <button class="copy-code-btn" data-code="${message.code}">
                    <i class="fas fa-copy"></i> Copia Codice
                </button>
            </div>
        `;

        // Aggiungi al DOM
        document.body.appendChild(notification);

        // Setup events
        this.setupNotificationEvents(notification, message.code);

        // Auto-remove dopo 30 secondi
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 30000);
    }

    /**
     * ===============================================
     * UTILITY E HELPERS
     * =============================================== */

    /**
     * Genera ID sicuro
     */
    generateSecureId() {
        return 'rlx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2);
    }

    /**
     * Genera security token
     */
    generateSecurityToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Genera session token temporaneo
     */
    generateSessionToken() {
        return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2);
    }

    /**
     * Ottieni device fingerprint
     */
    async getDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('RelaxPoint fingerprint', 2, 2);

        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');

        // Hash semplice (in produzione usare crypto più robusto)
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return 'fp_' + Math.abs(hash).toString(36);
    }

    /**
     * Ottieni IP utente (simulato)
     */
    async getUserIP() {
        // In produzione: chiamata a servizio IP
        return '192.168.1.100';
    }

    /**
     * Controllo sicurezza device/IP
     */
    async performSecurityCheck(accessData) {
        const currentFingerprint = await this.getDeviceFingerprint();
        const currentIP = await this.getUserIP();

        // Policy flessibile: permetti cambio device ma log per sicurezza
        if (currentFingerprint !== accessData.deviceFingerprint) {
            console.warn('[WARNING] Device fingerprint changed for access code:', accessData.code);
            // In produzione: invia alert a admin/professionista
        }

        return { valid: true }; // Per ora sempre valido
    }

    /**
     * Formatta data per display
     */
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Ottieni testo tipo servizio
     */
    getServiceTypeText(type) {
        switch (type) {
            case 'course': return 'Corso Online';
            case 'service': return 'Servizio';
            case 'last_minute': return 'Last Minute';
            default: return 'Servizio';
        }
    }

    /**
     * Ottieni istruzioni accesso
     */
    getAccessInstructions(type) {
        switch (type) {
            case 'course':
                return 'Usa questo codice per accedere alle lezioni del corso. Valido per multiple sessioni.';
            case 'service':
                return 'Usa questo codice per accedere alla tua sessione. Valido per una sola volta.';
            case 'last_minute':
                return 'Accesso rapido per la tua sessione last minute. Scadenza breve!';
            default:
                return 'Usa questo codice per accedere al tuo servizio.';
        }
    }

    /**
     * Setup eventi notifica
     */
    setupNotificationEvents(notification, code) {
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());

        // Copy code button
        const copyBtn = notification.querySelector('.copy-code-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiato!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copia Codice';
            }, 2000);
        });

        // Click fuori per chiudere
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!notification.contains(e.target)) {
                    notification.remove();
                }
            }, { once: true });
        }, 100);
    }

    /**
     * ===============================================
     * DATABASE SIMULATO (IN PRODUZIONE: API CALLS)
     * =============================================== */

    async saveAccessCode(accessCode) {
        // Simula salvataggio database
        const stored = JSON.parse(localStorage.getItem('rlx_access_codes') || '[]');
        stored.push(accessCode);
        localStorage.setItem('rlx_access_codes', JSON.stringify(stored));
        console.log('💾 Access code saved:', accessCode.code);
    }

    async getAccessCodeFromDB(code) {
        // Simula recupero da database
        const stored = JSON.parse(localStorage.getItem('rlx_access_codes') || '[]');
        return stored.find(ac => ac.code === code);
    }

    async saveActiveSession(sessionData) {
        // Simula salvataggio sessione attiva
        const stored = JSON.parse(localStorage.getItem('rlx_active_sessions') || '[]');
        stored.push(sessionData);
        localStorage.setItem('rlx_active_sessions', JSON.stringify(stored));
    }

    async incrementSessionUsage(accessCodeId) {
        // Simula incremento uso sessione
        const stored = JSON.parse(localStorage.getItem('rlx_access_codes') || '[]');
        const codeIndex = stored.findIndex(ac => ac.id === accessCodeId);
        if (codeIndex !== -1) {
            stored[codeIndex].usedSessions++;
            localStorage.setItem('rlx_access_codes', JSON.stringify(stored));
        }
    }

    loadUserSession() {
        // Simula caricamento sessione utente
        this.currentUser = {
            id: 'user_123',
            name: 'Test User',
            email: 'test@example.com'
        };
    }

    setupMessageListener() {
        // Setup listener per messaggi da altre pagine
        window.addEventListener('message', (event) => {
            if (event.data.type === 'access_request') {
                this.handleAccessRequest(event.data);
            }
        });
    }

    scheduleSessionCleanup(sessionId, delay) {
        setTimeout(() => {
            this.activeSessions.delete(sessionId);
            console.log('🧹 Session cleaned up:', sessionId);
        }, delay);
    }
}

// Inizializza sistema globalmente
window.RelaxPointAccess = new RelaxPointAccessSystem();

// Export per moduli
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RelaxPointAccessSystem;
}