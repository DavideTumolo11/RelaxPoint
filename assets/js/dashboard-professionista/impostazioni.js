/* ===============================================
   RELAXPOINT - JAVASCRIPT IMPOSTAZIONI PROFESSIONISTA
   Gestisce configurazione account, sicurezza e integrazioni
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Impostazioni professionista caricato');
    initImpostazioni();
});

// Oggetto principale per gestire le impostazioni
window.ImpostazioniProfessionista = {
    currentSettings: {},
    hasUnsavedChanges: false,

    init() {
        console.log('Inizializzazione impostazioni professionista');
        this.loadCurrentSettings();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupNotifications();
    },

    // ===============================================
    // SETUP EVENT LISTENERS
    // ===============================================
    setupEventListeners() {
        // Toggle switches
        const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleToggleChange(e.target);
            });
        });

        // Select changes
        const selects = document.querySelectorAll('.setting-select');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleSelectChange(e.target);
            });
        });

        // Notification channels
        const channels = document.querySelectorAll('.channel-option input[type="checkbox"]');
        channels.forEach(channel => {
            channel.addEventListener('change', (e) => {
                this.handleNotificationChange(e.target);
            });
        });

        // Time inputs
        const timeInputs = document.querySelectorAll('.time-input');
        timeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleTimeChange(e.target);
            });
        });

        // Protezione page unload
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'Hai modifiche non salvate. Sei sicuro di voler uscire?';
            }
        });

        console.log('Event listeners configurati');
    },

    // ===============================================
    // GESTIONE CAMBIO IMPOSTAZIONI
    // ===============================================
    handleToggleChange(toggle) {
        const settingId = toggle.id;
        const isEnabled = toggle.checked;

        console.log(`Toggle ${settingId}: ${isEnabled}`);

        // Salvataggio automatico per alcuni toggle critici
        const autoSaveToggles = ['twoFactorAuth', 'autoBackup'];

        if (autoSaveToggles.includes(settingId)) {
            this.saveSettingImmediate(settingId, isEnabled);
        } else {
            this.markAsChanged();
        }

        this.showNotification(`Impostazione ${settingId} ${isEnabled ? 'attivata' : 'disattivata'}`, 'success');
    },

    handleSelectChange(select) {
        const settingId = select.id;
        const value = select.value;

        console.log(`Select ${settingId}: ${value}`);

        // Salva immediatamente impostazioni critiche
        const criticalSettings = ['timezoneSelect', 'languageSelect'];

        if (criticalSettings.includes(settingId)) {
            this.saveSettingImmediate(settingId, value);
        } else {
            this.markAsChanged();
        }
    },

    handleNotificationChange(checkbox) {
        const notificationType = checkbox.closest('.setting-row').querySelector('.setting-label').textContent;
        const channel = checkbox.nextElementSibling.textContent;
        const isEnabled = checkbox.checked;

        console.log(`Notifica ${notificationType} - ${channel}: ${isEnabled}`);
        this.markAsChanged();
    },

    handleTimeChange(input) {
        const time = input.value;
        const isStart = input.id === 'quietStart';

        console.log(`Orario ${isStart ? 'inizio' : 'fine'} silenzioso: ${time}`);
        this.markAsChanged();
    },

    // ===============================================
    // SALVATAGGIO IMPOSTAZIONI
    // ===============================================
    saveSettingImmediate(settingId, value) {
        // Simula salvataggio immediato
        console.log(`Salvando immediatamente ${settingId}: ${value}`);

        setTimeout(() => {
            this.showNotification('Impostazione salvata', 'success');
        }, 300);
    },

    markAsChanged() {
        this.hasUnsavedChanges = true;

        // Mostra indicatore modifiche non salvate se non già presente
        if (!document.querySelector('.unsaved-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'unsaved-indicator';
            indicator.innerHTML = `
                <span>Modifiche non salvate</span>
                <button onclick="saveAllSettings()" class="btn-save-all">Salva Tutto</button>
            `;
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #f59e0b;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                z-index: 9999;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 12px;
            `;

            const saveBtn = indicator.querySelector('.btn-save-all');
            saveBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
            `;

            document.body.appendChild(indicator);
        }
    },

    saveAllSettings() {
        console.log('Salvando tutte le impostazioni...');

        const indicator = document.querySelector('.unsaved-indicator');
        if (indicator) {
            indicator.remove();
        }

        this.hasUnsavedChanges = false;

        setTimeout(() => {
            this.showNotification('Tutte le impostazioni sono state salvate', 'success');
        }, 500);
    },

    // ===============================================
    // GESTIONE PASSWORD
    // ===============================================
    openPasswordModal() {
        const modal = document.getElementById('passwordModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';

            // Reset form se necessario
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    },

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validazione
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Compila tutti i campi', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('Le password non corrispondono', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('La password deve essere di almeno 8 caratteri', 'error');
            return;
        }

        console.log('Cambio password in corso...');

        // Simula cambio password
        setTimeout(() => {
            this.closeModal('passwordModal');
            this.showNotification('Password cambiata con successo', 'success');
        }, 1000);
    },

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) return;

        let strength = 0;
        let message = '';

        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        switch (strength) {
            case 0:
            case 1:
                message = 'Password molto debole';
                strengthIndicator.className = 'password-strength weak';
                break;
            case 2:
            case 3:
                message = 'Password media';
                strengthIndicator.className = 'password-strength medium';
                break;
            case 4:
            case 5:
                message = 'Password forte';
                strengthIndicator.className = 'password-strength strong';
                break;
        }

        strengthIndicator.textContent = message;
    },

    // ===============================================
    // INTEGRAZIONI SISTEMA
    // ===============================================
    connectGoogleCalendar() {
        console.log('Connessione Google Calendar...');
        this.showNotification('Reindirizzamento a Google per autorizzazione...', 'info');

        // Simula processo di connessione
        setTimeout(() => {
            const status = document.getElementById('googleCalendarStatus');
            if (status) {
                status.className = 'integration-status connected';
                status.innerHTML = '<span class="status-text">Connesso</span>';
            }

            const button = status?.nextElementSibling;
            if (button) {
                button.textContent = 'Disconnetti';
                button.onclick = () => this.disconnectGoogleCalendar();
            }

            this.showNotification('Google Calendar connesso con successo', 'success');
        }, 2000);
    },

    disconnectGoogleCalendar() {
        console.log('Disconnessione Google Calendar...');

        const status = document.getElementById('googleCalendarStatus');
        if (status) {
            status.className = 'integration-status disconnected';
            status.innerHTML = '<span class="status-text">Non connesso</span>';
        }

        const button = status?.nextElementSibling;
        if (button) {
            button.textContent = 'Connetti';
            button.onclick = () => this.connectGoogleCalendar();
        }

        this.showNotification('Google Calendar disconnesso', 'info');
    },

    configureWebhook() {
        const webhookUrl = prompt('Inserisci URL webhook per le notifiche automatiche:');

        if (webhookUrl) {
            console.log('Configurazione webhook:', webhookUrl);
            this.showNotification('Webhook configurato correttamente', 'success');
        }
    },

    // ===============================================
    // SUPPORTO E ASSISTENZA
    // ===============================================
    openHelpCenter() {
        console.log('Apertura centro assistenza...');
        this.showNotification('Reindirizzamento al centro assistenza...', 'info');

        // In produzione aprirebbe finestra o tab
        setTimeout(() => {
            alert('Centro Assistenza RelaxPoint\n\nGuide complete per professionisti disponibili online.');
        }, 500);
    },

    startLiveChat() {
        console.log('Avvio chat dal vivo...');
        this.showNotification('Connessione con operatore...', 'info');

        setTimeout(() => {
            alert('Chat dal Vivo\n\nOperatore disponibile per supporto tecnico immediato.');
        }, 1000);
    },

    createTicket() {
        console.log('Creazione ticket supporto...');

        const issue = prompt('Descrivi brevemente il problema o la richiesta:');

        if (issue && issue.trim()) {
            const ticketId = 'RLX-' + Math.random().toString(36).substr(2, 9).toUpperCase();

            setTimeout(() => {
                this.showNotification(`Ticket ${ticketId} creato. Riceverai risposta via email.`, 'success');
            }, 500);
        }
    },

    // ===============================================
    // PRIVACY E GDPR
    // ===============================================
    requestDataExport() {
        console.log('Richiesta export dati GDPR...');

        if (confirm('Vuoi richiedere l\'export completo dei tuoi dati? Riceverai un link di download via email entro 24 ore.')) {
            setTimeout(() => {
                this.showNotification('Richiesta export inviata. Controlla la tua email.', 'success');
            }, 500);
        }
    },

    // ===============================================
    // GESTIONE PIANO
    // ===============================================
    managePlan() {
        console.log('Gestione piano abbonamento...');
        this.showNotification('Reindirizzamento al portale fatturazione...', 'info');

        setTimeout(() => {
            alert('Gestione Piano\n\nPiano Premium attivo\nCommissioni: 10%\nProssimo rinnovo: 15 gennaio 2025\n\nFunzionalità disponibili:\n- Dashboard analytics avanzate\n- Priorità supporto\n- Integrazione calendario\n- Backup automatico');
        }, 500);
    },

    viewBillingHistory() {
        console.log('Visualizzazione cronologia fatturazione...');

        setTimeout(() => {
            alert('Cronologia Pagamenti\n\n• Dic 2024 - Piano Premium - €29.99\n• Nov 2024 - Piano Premium - €29.99\n• Ott 2024 - Upgrade Premium - €29.99\n• Set 2024 - Piano Basic - €0.00');
        }, 500);
    },

    updatePaymentMethod() {
        console.log('Aggiornamento metodo pagamento...');

        const cardNumber = prompt('Inserisci ultime 4 cifre nuova carta:');

        if (cardNumber && cardNumber.length === 4) {
            setTimeout(() => {
                this.showNotification(`Metodo pagamento aggiornato: ****${cardNumber}`, 'success');
            }, 500);
        }
    },

    // ===============================================
    // ZONA PERICOLOSA
    // ===============================================
    confirmDeleteAccount() {
        const confirmation = prompt('ATTENZIONE: Questa azione eliminerà permanentemente il tuo account e tutti i dati associati.\n\nPer confermare, digita "ELIMINA ACCOUNT":');

        if (confirmation === 'ELIMINA ACCOUNT') {
            const secondConfirm = confirm('Sei assolutamente sicuro? Questa azione NON può essere annullata.');

            if (secondConfirm) {
                console.log('Eliminazione account richiesta...');
                this.showNotification('Eliminazione account programmata. Riceverai email di conferma.', 'error');
            }
        } else if (confirmation !== null) {
            this.showNotification('Testo di conferma non corretto. Eliminazione annullata.', 'info');
        }
    },

    // ===============================================
    // GESTIONE SESSIONI
    // ===============================================
    showActiveSessions() {
        console.log('Visualizzazione sessioni attive...');

        setTimeout(() => {
            alert('Sessioni Attive\n\n• Questo dispositivo - Chrome (Windows) - Ora\n• Dispositivo mobile - Safari (iPhone) - 2 ore fa\n• Tablet - Chrome (iPad) - 1 giorno fa\n\nPuoi terminare le sessioni non riconosciute per sicurezza.');
        }, 500);
    },

    viewAccessLog() {
        console.log('Visualizzazione log accessi...');

        setTimeout(() => {
            alert('Log Accessi Recenti\n\n• 22/09/2024 14:30 - Login da Chrome (Windows) - IP: 192.168.1.100\n• 22/09/2024 08:15 - Login da Safari (iPhone) - IP: 192.168.1.101\n• 21/09/2024 19:45 - Login da Chrome (Windows) - IP: 192.168.1.100\n• 21/09/2024 10:20 - Logout - Chrome (Windows)');
        }, 500);
    },

    // ===============================================
    // CARICAMENTO IMPOSTAZIONI
    // ===============================================
    loadCurrentSettings() {
        console.log('Caricamento impostazioni correnti...');

        // Simula caricamento dal backend
        this.currentSettings = {
            timezone: 'Europe/Rome',
            language: 'it',
            dateFormat: 'dd/mm/yyyy',
            autoBackup: true,
            twoFactorAuth: false,
            analyticsSharing: true,
            marketingConsent: true,
            quietStart: '22:00',
            quietEnd: '08:00'
        };

        // Applica le impostazioni ai controlli
        this.applySettingsToUI();
    },

    applySettingsToUI() {
        Object.keys(this.currentSettings).forEach(key => {
            const element = document.getElementById(key) || document.getElementById(key + 'Select');

            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.currentSettings[key];
                } else {
                    element.value = this.currentSettings[key];
                }
            }
        });
    },

    // ===============================================
    // VALIDAZIONE FORM
    // ===============================================
    setupFormValidation() {
        const newPasswordInput = document.getElementById('newPassword');

        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    },

    // ===============================================
    // SISTEMA NOTIFICHE
    // ===============================================
    setupNotifications() {
        console.log('Sistema notifiche inizializzato');
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${this.escapeHtml(message)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: this.getNotificationColor(type),
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    },

    getNotificationColor(type) {
        const colors = {
            success: '#16a34a',
            error: '#dc2626',
            warning: '#d97706',
            info: '#2563eb'
        };
        return colors[type] || colors.info;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ===============================================
// FUNZIONI GLOBALI ACCESSIBILI DA HTML
// ===============================================

function openPasswordModal() {
    window.ImpostazioniProfessionista.openPasswordModal();
}

function closeModal(modalId) {
    window.ImpostazioniProfessionista.closeModal(modalId);
}

function changePassword() {
    window.ImpostazioniProfessionista.changePassword();
}

function showActiveSessions() {
    window.ImpostazioniProfessionista.showActiveSessions();
}

function viewAccessLog() {
    window.ImpostazioniProfessionista.viewAccessLog();
}

function connectGoogleCalendar() {
    window.ImpostazioniProfessionista.connectGoogleCalendar();
}

function configureWebhook() {
    window.ImpostazioniProfessionista.configureWebhook();
}

function requestDataExport() {
    window.ImpostazioniProfessionista.requestDataExport();
}

function managePlan() {
    window.ImpostazioniProfessionista.managePlan();
}

function viewBillingHistory() {
    window.ImpostazioniProfessionista.viewBillingHistory();
}

function updatePaymentMethod() {
    window.ImpostazioniProfessionista.updatePaymentMethod();
}

function openHelpCenter() {
    window.ImpostazioniProfessionista.openHelpCenter();
}

function startLiveChat() {
    window.ImpostazioniProfessionista.startLiveChat();
}

function createTicket() {
    window.ImpostazioniProfessionista.createTicket();
}

function confirmDeleteAccount() {
    window.ImpostazioniProfessionista.confirmDeleteAccount();
}

function saveAllSettings() {
    window.ImpostazioniProfessionista.saveAllSettings();
}

// ===============================================
// INIZIALIZZAZIONE
// ===============================================
function initImpostazioni() {
    window.ImpostazioniProfessionista.init();
}

// Aggiungi stili CSS per animazioni notifiche
if (!document.getElementById('settings-notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'settings-notification-styles';
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .unsaved-indicator .btn-save-all:hover {
            background: rgba(255, 255, 255, 0.3) !important;
        }
    `;
    document.head.appendChild(notificationStyles);
}

console.log('Impostazioni professionista script caricato completamente');