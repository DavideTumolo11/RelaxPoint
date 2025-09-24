/* ===============================================
   RELAXPOINT - JS PAGINA PROFILO
   Gestione foto profilo e form dati
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('👤 Pagina Profilo RelaxPoint inizializzata');

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Avatar elements
        userAvatar: document.getElementById('userAvatar'),
        avatarInput: document.getElementById('avatarInput'),
        removeAvatarBtn: document.getElementById('removeAvatarBtn'),
        changePhotoBtn: document.querySelector('.btn-avatar-action.primary'),

        // Form elements
        personalInfoForm: document.getElementById('personalInfoForm'),

        // Notifiche
        notificationContainer: null
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupAvatarManagement();
        setupFormHandling();
        setupNotificationSystem();
        console.log('✅ Profilo inizializzato completamente');
    }

    // ===============================================
    // GESTIONE AVATAR
    // ===============================================
    function setupAvatarManagement() {
        console.log('[SETUP] Setup gestione avatar...');

        // Pulsante Cambia Foto
        if (elements.changePhotoBtn) {
            elements.changePhotoBtn.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('[PHOTO] Cambia foto cliccato');
                if (elements.avatarInput) {
                    elements.avatarInput.click();
                }
            });
        }

        // Pulsante Rimuovi
        if (elements.removeAvatarBtn) {
            elements.removeAvatarBtn.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('[ACTION] Rimuovi foto cliccato');
                showRemovePhotoModal();
            });
        }

        // Input file change
        if (elements.avatarInput) {
            elements.avatarInput.addEventListener('change', function (e) {
                console.log('📁 File selezionato');
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    console.log('✅ File immagine valido:', file.name);
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        console.log('📷 Immagine caricata, aggiornando avatar...');
                        if (elements.userAvatar) {
                            elements.userAvatar.src = e.target.result;
                            showNotification('Avatar aggiornato con successo!', 'success');
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    console.log('❌ File non valido');
                    showNotification('Seleziona un file immagine valido', 'error');
                }
            });
        }

        console.log('✅ Avatar management configurato');
    }

    // ===============================================
    // MODAL RIMOZIONE FOTO
    // ===============================================
    function showRemovePhotoModal() {
        console.log('🚨 Mostrando modal rimozione foto...');

        const modal = document.createElement('div');
        modal.className = 'remove-photo-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Rimuovi Foto Profilo</h3>
                        <button class="modal-close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <p>Sei sicuro di voler rimuovere la tua foto profilo?</p>
                        <p class="modal-subtitle">Verrà ripristinata l'immagine predefinita.</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-cancel">Annulla</button>
                        <button class="btn-confirm">Rimuovi Foto</button>
                    </div>
                </div>
            </div>
        `;

        // Applica stili
        applyModalStyles(modal);

        // Aggiungi al DOM
        document.body.appendChild(modal);

        // Setup event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const confirmBtn = modal.querySelector('.btn-confirm');
        const overlay = modal.querySelector('.modal-overlay');

        closeBtn.addEventListener('click', () => closeModal(modal));
        cancelBtn.addEventListener('click', () => closeModal(modal));
        confirmBtn.addEventListener('click', () => confirmRemovePhoto(modal));

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal(modal);
            }
        });

        // Animazione entrata
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);

        console.log('✅ Modal creato e mostrato');
    }

    function applyModalStyles(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            transform: scale(0.95);
            transition: transform 0.3s ease;
        `;

        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid #e5e5e5;
        `;

        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 24px;
            text-align: center;
        `;

        const actions = modal.querySelector('.modal-actions');
        actions.style.cssText = `
            display: flex;
            gap: 12px;
            padding: 20px 24px;
            border-top: 1px solid #e5e5e5;
        `;

        const cancelBtn = modal.querySelector('.btn-cancel');
        cancelBtn.style.cssText = `
            flex: 1;
            padding: 12px 24px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        const confirmBtn = modal.querySelector('.btn-confirm');
        confirmBtn.style.cssText = `
            flex: 1;
            padding: 12px 24px;
            border: none;
            background: #ef4444;
            color: white;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
        `;

        const warningIcon = modal.querySelector('.warning-icon');
        warningIcon.style.cssText = `
            margin-bottom: 16px;
        `;

        const subtitle = modal.querySelector('.modal-subtitle');
        subtitle.style.cssText = `
            color: #6b7280;
            font-size: 14px;
            margin-top: 8px;
        `;
    }

    function closeModal(modal) {
        console.log('❌ Chiudendo modal...');
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    function confirmRemovePhoto(modal) {
        console.log('[ACTION] Confermando rimozione foto...');

        const defaultAvatar = '/assets/images/users/default-avatar.jpg';

        if (elements.userAvatar) {
            elements.userAvatar.src = defaultAvatar;
            elements.userAvatar.alt = 'Avatar predefinito';
        }

        showNotification('Foto profilo rimossa con successo', 'success');
        closeModal(modal);
    }

    // ===============================================
    // GESTIONE FORM
    // ===============================================
    function setupFormHandling() {
        if (elements.personalInfoForm) {
            elements.personalInfoForm.addEventListener('submit', function (e) {
                e.preventDefault();
                console.log('💾 Salvando informazioni profilo...');
                showNotification('Informazioni salvate con successo!', 'success');
            });
        }
    }

    // ===============================================
    // SISTEMA NOTIFICHE
    // ===============================================
    function setupNotificationSystem() {
        // Crea container per notifiche se non esiste
        if (!elements.notificationContainer) {
            elements.notificationContainer = document.createElement('div');
            elements.notificationContainer.id = 'notificationContainer';
            elements.notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(elements.notificationContainer);
        }
    }

    function showNotification(message, type = 'info') {
        console.log(`📢 Notifica ${type}: ${message}`);

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 10px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: auto;
        `;

        const icon = getNotificationIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;

        elements.notificationContainer.appendChild(notification);

        // Animazione entrata
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Rimozione automatica
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    function getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    init();

    // Debug
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.ProfiloDebug = {
            elements: elements,
            showNotification: showNotification
        };
        console.log('🧪 Debug tools: window.ProfiloDebug');
    }
});