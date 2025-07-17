/* ===============================================
   RELAXPOINT - JS DASHBOARD CLIENTE
   Navigazione corretta per percorsi
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🏠 Dashboard Cliente RelaxPoint inizializzata');

    // ===============================================
    // STATO GLOBALE DASHBOARD
    // ===============================================
    const dashboardState = {
        currentSection: 'dashboard',
        user: {
            name: 'Chiara',
            avatar: '/assets/images/users/Leonardo_Lightning_XL_A_hyperrealistic_frontfacing_portrait_of_0.jpg',
            isPremium: true
        },
        nextBooking: {
            countdown: null,
            timer: null
        }
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Menu navigazione
        menuItems: document.querySelectorAll('.menu-item'),
        sections: document.querySelectorAll('.content-section'),

        // User info
        userName: document.getElementById('userName'),
        userAvatar: document.getElementById('userAvatar'),
        avatarInput: document.getElementById('avatarInput'),

        // Content
        nextBookingCountdown: document.getElementById('nextBookingCountdown'),
        actionCards: document.querySelectorAll('.booking-card'),
        actionBtns: document.querySelectorAll('.btn-action'),
        viewBtns: document.querySelectorAll('.btn-view'),
        exploreBtn: document.querySelector('.btn-explore'),
        viewAllBtns: document.querySelectorAll('.view-all-btn')
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupNavigation();
        setupUserData();
        setupActions();
        setupCountdown();
        setupAvatarUpload();
        setupProfilePhotoManagement();
        console.log('✅ Dashboard inizializzata completamente');
    }

    // ===============================================
    // NAVIGAZIONE MENU - CORRETTA
    // ===============================================
    function setupNavigation() {
        elements.menuItems.forEach(item => {
            // Skip logout item
            if (item.classList.contains('logout')) return;

            item.addEventListener('click', function (e) {
                e.preventDefault();

                // Ottieni URL dall'href
                const href = this.getAttribute('href');

                if (href && href !== '#') {
                    // Naviga verso la pagina specifica
                    console.log(`📄 Navigazione verso: ${href}`);
                    window.location.href = href;
                } else {
                    // Gestione sezioni interne (solo per dashboard)
                    const targetSection = this.getAttribute('data-section');
                    if (targetSection) {
                        switchSection(targetSection);
                        updateActiveMenuItem(this);
                    }
                }
            });
        });
    }

    function switchSection(sectionName) {
        // Nascondi tutte le sezioni
        elements.sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Mostra la sezione target
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            dashboardState.currentSection = sectionName;

            console.log(`📄 Sezione attiva: ${sectionName}`);
            onSectionChange(sectionName);
        }
    }

    function updateActiveMenuItem(activeItem) {
        if (!activeItem) return;
        elements.menuItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    function onSectionChange(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                showNotification('Dashboard caricata', 'success');
                break;
            default:
                showNotification(`Sezione ${sectionName} attiva`, 'info');
        }
    }

    // ===============================================
    // GESTIONE DATI UTENTE
    // ===============================================
    function setupUserData() {
        if (elements.userName) {
            elements.userName.textContent = dashboardState.user.name;
        }

        if (elements.userAvatar && dashboardState.user.avatar) {
            elements.userAvatar.src = dashboardState.user.avatar;
            elements.userAvatar.alt = `Avatar di ${dashboardState.user.name}`;
        }
    }

    function setupAvatarUpload() {
        if (elements.avatarInput) {
            elements.avatarInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        if (elements.userAvatar) {
                            elements.userAvatar.src = e.target.result;
                        }
                        dashboardState.user.avatar = e.target.result;
                        showNotification('Avatar aggiornato con successo!', 'success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    showNotification('Seleziona un file immagine valido', 'error');
                }
            });
        }
    }

    // ===============================================
    // AZIONI E BUTTONS
    // ===============================================
    function setupActions() {
        // Nuova Prenotazione button
        if (elements.exploreBtn) {
            elements.exploreBtn.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('📅 Esplora servizi cliccato');
                showNotification('Reindirizzamento a servizi...', 'info');
                setTimeout(() => {
                    window.location.href = '/pages/servizi/servizi.html';
                }, 800);
            });
        }

        // Booking actions
        if (elements.actionBtns) {
            elements.actionBtns.forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const action = this.textContent.toLowerCase().trim();
                    console.log(`📋 Azione prenotazione: ${action}`);

                    if (action.includes('contatta')) {
                        showNotification('Apertura chat con il professionista...', 'info');
                    } else if (action.includes('modifica')) {
                        showNotification('Apertura modifica prenotazione...', 'info');
                        setTimeout(() => {
                            window.location.href = '/pages/dashboard/prenotazioni.html';
                        }, 1000);
                    }
                });
            });
        }

        // View buttons
        if (elements.viewBtns) {
            elements.viewBtns.forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    console.log('👁️ Visualizza prenotazione');
                    showNotification('Apertura dettagli prenotazione...', 'info');
                });
            });
        }

        // View All buttons
        if (elements.viewAllBtns) {
            elements.viewAllBtns.forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    showNotification('Apertura vista completa...', 'info');
                    setTimeout(() => {
                        window.location.href = '/pages/dashboard/prenotazioni.html';
                    }, 800);
                });
            });
        }
    }

    // ===============================================
    // COUNTDOWN PROSSIMA PRENOTAZIONE
    // ===============================================
    function setupCountdown() {
        if (!elements.nextBookingCountdown) return;

        const targetDate = new Date();
        targetDate.setTime(targetDate.getTime() + (25 * 60 * 60 * 1000));

        dashboardState.nextBooking.countdown = targetDate;
        updateCountdown();
        dashboardState.nextBooking.timer = setInterval(updateCountdown, 1000);

        console.log('⏰ Countdown impostato per:', targetDate.toLocaleString('it-IT'));
    }

    function updateCountdown() {
        if (!dashboardState.nextBooking.countdown || !elements.nextBookingCountdown) return;

        const now = new Date();
        const timeLeft = dashboardState.nextBooking.countdown - now;

        if (timeLeft <= 0) {
            elements.nextBookingCountdown.textContent = "È ora!";
            clearInterval(dashboardState.nextBooking.timer);
            dashboardState.nextBooking.timer = null;
            showNotification('È ora della tua prenotazione!', 'success');
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        elements.nextBookingCountdown.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // ===============================================
    // NOTIFICHE SISTEMA
    // ===============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        const icon = getNotificationIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

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
    // GESTIONE RESPONSIVE
    // ===============================================
    function setupResponsive() {
        if (window.innerWidth <= 1024) {
            console.log('📱 Layout responsive attivo');
        }

        window.addEventListener('resize', adaptMobileLayout);
        adaptMobileLayout();
    }

    function adaptMobileLayout() {
        if (window.innerWidth <= 768) {
            console.log('📱 Adattamento layout mobile per <= 768px');
        } else {
            console.log('🖥️ Layout desktop o tablet > 768px');
        }
    }

    // ===============================================
    // GESTIONE EVENTI GLOBALI
    // ===============================================
    function setupGlobalEvents() {
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && dashboardState.currentSection === 'dashboard') {
                if (!dashboardState.nextBooking.timer && dashboardState.nextBooking.countdown && dashboardState.nextBooking.countdown > new Date()) {
                    setupCountdown();
                }
            }
        });

        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '8') {
                e.preventDefault();
                const pages = [
                    '/pages/dashboard/dashboard-cliente.html',
                    '/pages/dashboard/prenotazioni.html',
                    '/pages/dashboard/pagamenti.html',
                    '/pages/dashboard/recensioni.html',
                    '/pages/dashboard/preferiti.html',
                    '/pages/dashboard/profilo.html',
                    '/pages/dashboard/notifiche.html',
                    '/pages/dashboard/impostazioni.html'
                ];
                const index = parseInt(e.key) - 1;
                if (pages[index]) {
                    window.location.href = pages[index];
                }
            }

            if (e.key === 'Escape') {
                window.location.href = '/pages/dashboard/dashboard-cliente.html';
            }
        });
    }

    // ===============================================
    // INTERAZIONI AVANZATE
    // ===============================================
    function setupAdvancedInteractions() {
        if (elements.actionCards) {
            elements.actionCards.forEach(card => {
                card.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateY(-4px)';
                    this.style.transition = 'transform 0.2s ease-out';
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = 'translateY(0)';
                });
            });
        }

        if (elements.userAvatar && elements.avatarInput) {
            let clickTimeout = null;
            elements.userAvatar.addEventListener('click', function () {
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                    console.log('Avatar double clicked');
                    if (elements.avatarInput) elements.avatarInput.click();
                } else {
                    clickTimeout = setTimeout(() => {
                        clickTimeout = null;
                        console.log('Avatar single clicked');
                        showNotification('Doppio click per cambiare avatar', 'info');
                    }, 300);
                }
            });
        }

        if (elements.userAvatar) {
            elements.userAvatar.addEventListener('dragover', function (e) {
                e.preventDefault();
                this.style.opacity = '0.7';
            });

            elements.userAvatar.addEventListener('dragleave', function (e) {
                this.style.opacity = '1';
            });

            elements.userAvatar.addEventListener('drop', function (e) {
                e.preventDefault();
                this.style.opacity = '1';

                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        elements.userAvatar.src = event.target.result;
                        dashboardState.user.avatar = event.target.result;
                        showNotification('Avatar aggiornato tramite drag & drop!', 'success');
                    };
                    reader.readAsDataURL(files[0]);
                } else {
                    showNotification('Trascina un file immagine valido.', 'error');
                }
            });
        }
    }

    // ===============================================
    // GESTIONE FOTO PROFILO
    // ===============================================
    function setupProfilePhotoManagement() {
        const removePhotoBtn = document.querySelector('#removeAvatarBtn, .btn-remove-photo, [data-action="remove-photo"]');
        const changePhotoBtn = document.querySelector('.btn-avatar-action.primary, .btn-change-photo, [data-action="change-photo"]');

        // Foto default del sistema
        const defaultAvatar = '/assets/images/users/default-avatar.jpg';

        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', function (e) {
                e.preventDefault();
                showRemovePhotoModal();
            });
        }

        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (elements.avatarInput) {
                    elements.avatarInput.click();
                }
            });
        }
    }

    function showRemovePhotoModal() {
        const modal = document.createElement('div');
        modal.className = 'remove-photo-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Rimuovi Foto Profilo</h3>
                        <button class="modal-close" onclick="closeRemovePhotoModal()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="warning-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M12 2L1 21h22L12 2zm0 3l8.5 15h-17L12 5zm-1 6h2v4h-2v-4zm0 6h2v2h-2v-2z"/>
                            </svg>
                        </div>
                        <p>Sei sicuro di voler rimuovere la tua foto profilo?</p>
                        <p class="modal-subtitle">Verrà ripristinata l'immagine predefinita.</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-cancel" onclick="closeRemovePhotoModal()">Annulla</button>
                        <button class="btn-confirm" onclick="confirmRemovePhoto()">Rimuovi Foto</button>
                    </div>
                </div>
            </div>
        `;

        // Stili modal
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;
            opacity: 0; transition: opacity 0.3s ease;
        `;

        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); display: flex; align-items: center;
            justify-content: center; padding: 20px;
        `;

        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white; border-radius: 12px; padding: 0; max-width: 400px;
            width: 100%; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            transform: scale(0.95); transition: transform 0.3s ease;
        `;

        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 10);

        window.closeRemovePhotoModal = function () {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            setTimeout(() => modal.remove(), 300);
        };

        window.confirmRemovePhoto = function () {
            const defaultAvatar = '/assets/images/users/default-avatar.jpg';
            if (elements.userAvatar) {
                elements.userAvatar.src = defaultAvatar;
            }
            dashboardState.user.avatar = defaultAvatar;
            showNotification('Foto profilo rimossa con successo', 'success');
            closeRemovePhotoModal();
        };
    }

    // ===============================================
    // GESTIONE ERRORI E CLEANUP
    // ===============================================
    function setupErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Errore Dashboard:', e.error);
            showNotification('Si è verificato un errore. Ricarica la pagina.', 'error');
        });

        window.addEventListener('beforeunload', function () {
            if (dashboardState.nextBooking.timer) {
                clearInterval(dashboardState.nextBooking.timer);
                dashboardState.nextBooking.timer = null;
            }
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE COMPLETA
    // ===============================================
    init();
    setupResponsive();
    setupGlobalEvents();
    setupAdvancedInteractions();
    setupErrorHandling();

    console.log('🚀 RelaxPoint Dashboard pronta!');

    // Debug
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DashboardDebug = {
            state: dashboardState,
            switchSection: switchSection,
            showNotification: showNotification,
            elements: elements
        };
    }
});