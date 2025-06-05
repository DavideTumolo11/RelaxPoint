/* ===============================================
   RELAXPOINT - JS NOTIFICHE CLIENTE
   Gestione completa centro notifiche con impostazioni
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔔 Notifiche Cliente - JS caricato');

    // ===============================================
    // STATO GLOBALE APPLICAZIONE
    // ===============================================
    let appState = {
        notifications: [],
        filteredNotifications: [],
        filters: {
            status: 'all',
            category: 'all',
            period: 'all',
            search: ''
        },
        settings: {
            // Prenotazioni
            'booking-confirmation': true,
            'booking-reminder': true,
            'booking-changes': true,
            'booking-arriving': true,
            // Pagamenti
            'payment-completed': true,
            'payment-cashback': true,
            'payment-invoice': false,
            // Last Minute
            'lastminute-new': true,
            'lastminute-nearby': true,
            'lastminute-favorites': false,
            // Recensioni
            'review-request': true,
            'review-response': true,
            // Marketing
            'marketing-offers': true,
            'marketing-newsletter': false,
            'marketing-discounts': true,
            // Sistema
            'system-updates': true,
            'system-maintenance': true,
            'system-legal': true
        },
        stats: {
            total: 0,
            unread: 0,
            today: 0
        },
        currentPage: 1,
        itemsPerPage: 10,
        isLoading: false
    };

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const elements = {
        // Filtri
        statusFilter: document.getElementById('statusFilter'),
        categoryFilter: document.getElementById('categoryFilter'),
        periodFilter: document.getElementById('periodFilter'),
        searchInput: document.querySelector('.search-input'),

        // Contenuto
        notificationsList: document.getElementById('notificationsList'),
        filteredCount: document.getElementById('filteredCount'),
        emptyState: document.getElementById('emptyState'),
        loadingSpinner: document.getElementById('loadingSpinner'),

        // Statistiche
        totalNotifications: document.getElementById('totalNotifications'),
        unreadNotifications: document.getElementById('unreadNotifications'),
        todayNotifications: document.getElementById('todayNotifications'),
        unreadBadge: document.getElementById('unreadBadge'),

        // Azioni
        markAllReadBtn: document.getElementById('markAllReadBtn'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        resetSettingsBtn: document.getElementById('resetSettingsBtn'),

        // Paginazione
        pagination: document.getElementById('pagination'),
        prevPage: document.getElementById('prevPage'),
        nextPage: document.getElementById('nextPage'),
        pageInfo: document.getElementById('pageInfo')
    };

    // ===============================================
    // DATI MOCK NOTIFICHE
    // ===============================================
    const mockNotifications = [
        {
            id: 1,
            type: 'booking-confirmation',
            category: 'booking',
            title: 'Prenotazione Confermata',
            message: 'La tua prenotazione per "Massaggio Rilassante" con Marco Rossi è stata confermata per domani alle 16:00.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ore fa
            read: false,
            urgent: false
        },
        {
            id: 2,
            type: 'lastminute-new',
            category: 'lastminute',
            title: '🚨 Last Minute Disponibile!',
            message: 'Nuovo servizio Last Minute: "Trattamento Viso Express" con Laura Verdi - Sconto 30%! Prenota entro 1 ora.',
            timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min fa
            read: false,
            urgent: true
        },
        {
            id: 3,
            type: 'payment-completed',
            category: 'payment',
            title: 'Pagamento Completato',
            message: 'Pagamento di €75 per "Trattamento Viso" completato con successo. Cashback di €2.25 accreditato.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 giorno fa
            read: false,
            urgent: false
        },
        {
            id: 4,
            type: 'review-request',
            category: 'review',
            title: 'Recensione Richiesta',
            message: 'Come è andato il tuo "Massaggio Decontratturante" con Marco Rossi? Lascia una recensione per aiutare altri clienti.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 giorni fa
            read: true,
            urgent: false
        },
        {
            id: 5,
            type: 'marketing-offers',
            category: 'marketing',
            title: '🎁 Offerta Speciale Estate',
            message: 'Sconto del 25% su tutti i servizi Beauty fino al 31 agosto! Codice: ESTATE25. Non perdere questa opportunità.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 giorni fa
            read: true,
            urgent: false
        },
        {
            id: 6,
            type: 'booking-reminder',
            category: 'booking',
            title: 'Promemoria Prenotazione',
            message: 'Ricordati: domani alle 14:00 hai "Lezione di Yoga" con Laura Verdi. Ti aspettiamo!',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 ore fa
            read: true,
            urgent: false
        },
        {
            id: 7,
            type: 'professional-new',
            category: 'professional',
            title: 'Nuovo Professionista nella Tua Zona',
            message: 'Sofia Moretti, specialista in trattamenti anti-età, ora disponibile a Cagliari. Scopri i suoi servizi!',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 giorni fa
            read: true,
            urgent: false
        },
        {
            id: 8,
            type: 'system-updates',
            category: 'system',
            title: 'Nuove Funzionalità Disponibili',
            message: 'Abbiamo aggiunto la chat diretta con i professionisti e migliorato il sistema di prenotazioni Last Minute.',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 settimana fa
            read: true,
            urgent: false
        }
    ];

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupEventListeners();
        loadNotifications();
        loadSettings();
        updateStatistics();
        console.log('✅ Notifiche - Tutto inizializzato');
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        // Filtri
        if (elements.statusFilter) {
            elements.statusFilter.addEventListener('change', handleStatusFilter);
        }

        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener('change', handleCategoryFilter);
        }

        if (elements.periodFilter) {
            elements.periodFilter.addEventListener('change', handlePeriodFilter);
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Azioni globali
        if (elements.markAllReadBtn) {
            elements.markAllReadBtn.addEventListener('click', markAllAsRead);
        }

        if (elements.saveSettingsBtn) {
            elements.saveSettingsBtn.addEventListener('click', saveSettings);
        }

        if (elements.resetSettingsBtn) {
            elements.resetSettingsBtn.addEventListener('click', resetSettings);
        }

        // Paginazione
        if (elements.prevPage) {
            elements.prevPage.addEventListener('click', () => changePage(-1));
        }

        if (elements.nextPage) {
            elements.nextPage.addEventListener('click', () => changePage(1));
        }

        // Event delegation per azioni dinamiche
        document.addEventListener('click', handleDynamicActions);

        // Toggle settings
        document.addEventListener('change', handleSettingToggle);
    }

    // ===============================================
    // GESTIONE FILTRI
    // ===============================================
    function handleStatusFilter(e) {
        appState.filters.status = e.target.value;
        console.log(`🔍 Filtro stato: ${appState.filters.status}`);
        applyFilters();
    }

    function handleCategoryFilter(e) {
        appState.filters.category = e.target.value;
        console.log(`🔍 Filtro categoria: ${appState.filters.category}`);
        applyFilters();
    }

    function handlePeriodFilter(e) {
        appState.filters.period = e.target.value;
        console.log(`🔍 Filtro periodo: ${appState.filters.period}`);
        applyFilters();
    }

    function handleSearch(e) {
        appState.filters.search = e.target.value.toLowerCase().trim();
        console.log(`🔍 Ricerca: "${appState.filters.search}"`);
        applyFilters();
    }

    function applyFilters() {
        if (appState.isLoading) return;

        showLoading();

        setTimeout(() => {
            let filtered = [...appState.notifications];

            // Filtro stato
            if (appState.filters.status !== 'all') {
                if (appState.filters.status === 'unread') {
                    filtered = filtered.filter(notif => !notif.read);
                } else if (appState.filters.status === 'read') {
                    filtered = filtered.filter(notif => notif.read);
                }
            }

            // Filtro categoria
            if (appState.filters.category !== 'all') {
                filtered = filtered.filter(notif => notif.category === appState.filters.category);
            }

            // Filtro periodo
            if (appState.filters.period !== 'all') {
                const now = new Date();
                filtered = filtered.filter(notif => {
                    const notifDate = new Date(notif.timestamp);

                    switch (appState.filters.period) {
                        case 'today':
                            return notifDate.toDateString() === now.toDateString();
                        case 'week':
                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            return notifDate >= weekAgo;
                        case 'month':
                            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            return notifDate >= monthAgo;
                        default:
                            return true;
                    }
                });
            }

            // Filtro ricerca
            if (appState.filters.search) {
                filtered = filtered.filter(notif =>
                    notif.title.toLowerCase().includes(appState.filters.search) ||
                    notif.message.toLowerCase().includes(appState.filters.search)
                );
            }

            // Ordina per timestamp (più recenti prima)
            filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            appState.filteredNotifications = filtered;
            appState.currentPage = 1;
            renderNotifications();
            updateFilteredCount();
            updatePagination();
            hideLoading();
        }, 300);
    }

    // ===============================================
    // CARICAMENTO E RENDERING
    // ===============================================
    function loadNotifications() {
        showLoading();

        // Simula caricamento da API
        setTimeout(() => {
            appState.notifications = [...mockNotifications];
            appState.filteredNotifications = [...mockNotifications];

            // Ordina per timestamp
            appState.filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            renderNotifications();
            updateStatistics();
            updateFilteredCount();
            updatePagination();
            hideLoading();
        }, 500);
    }

    function renderNotifications() {
        if (!elements.notificationsList) return;

        const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
        const endIndex = startIndex + appState.itemsPerPage;
        const pageNotifications = appState.filteredNotifications.slice(startIndex, endIndex);

        if (pageNotifications.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();

        const html = pageNotifications.map((notification, index) => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                 data-id="${notification.id}" 
                 data-category="${notification.category}" 
                 data-type="${notification.type}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="notification-icon ${notification.category}">
                    ${getNotificationIcon(notification.category)}
                </div>

                <div class="notification-content">
                    <div class="notification-header">
                        <h4 class="notification-title">${notification.title}</h4>
                        <span class="notification-time">${formatTimestamp(notification.timestamp)}</span>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                    <div class="notification-meta">
                        <span class="notification-category">${getCategoryDisplayName(notification.category)}</span>
                        ${notification.urgent ? '<span class="notification-urgent">Urgente</span>' : ''}
                    </div>
                </div>

                <div class="notification-actions">
                    <button class="btn-notification-action ${notification.read ? 'unread' : 'read'}" 
                            title="${notification.read ? 'Segna come non letta' : 'Segna come letta'}" 
                            data-action="${notification.read ? 'unread' : 'read'}">
                        ${notification.read ? getUnreadIcon() : getReadIcon()}
                    </button>
                    <button class="btn-notification-action delete" 
                            title="Elimina notifica" 
                            data-action="delete">
                        ${getDeleteIcon()}
                    </button>
                </div>
            </div>
        `).join('');

        elements.notificationsList.innerHTML = html;
    }

    // ===============================================
    // GESTIONE AZIONI NOTIFICHE
    // ===============================================
    function handleDynamicActions(e) {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-action');
        const notificationItem = actionBtn.closest('.notification-item');
        const notificationId = parseInt(notificationItem.getAttribute('data-id'));

        switch (action) {
            case 'read':
                markAsRead(notificationId);
                break;
            case 'unread':
                markAsUnread(notificationId);
                break;
            case 'delete':
                deleteNotification(notificationId);
                break;
        }
    }

    function markAsRead(notificationId) {
        const notification = appState.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            updateNotificationInDOM(notificationId, true);
            updateStatistics();
            showToast('Notifica segnata come letta', 'success');
            console.log(`✅ Notifica ${notificationId} segnata come letta`);
        }
    }

    function markAsUnread(notificationId) {
        const notification = appState.notifications.find(n => n.id === notificationId);
        if (notification && notification.read) {
            notification.read = false;
            updateNotificationInDOM(notificationId, false);
            updateStatistics();
            showToast('Notifica segnata come non letta', 'success');
            console.log(`📌 Notifica ${notificationId} segnata come non letta`);
        }
    }

    function deleteNotification(notificationId) {
        const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);

        if (notificationItem) {
            notificationItem.classList.add('deleting');

            setTimeout(() => {
                // Rimuovi dall'array
                appState.notifications = appState.notifications.filter(n => n.id !== notificationId);

                // Riapplica filtri
                applyFilters();
                updateStatistics();

                showToast('Notifica eliminata', 'success');
                console.log(`🗑️ Notifica ${notificationId} eliminata`);
            }, 300);
        }
    }

    function markAllAsRead() {
        const unreadNotifications = appState.notifications.filter(n => !n.read);

        if (unreadNotifications.length === 0) {
            showToast('Tutte le notifiche sono già state lette', 'info');
            return;
        }

        // Segna tutte come lette
        unreadNotifications.forEach(notification => {
            notification.read = true;
        });

        // Re-render
        renderNotifications();
        updateStatistics();

        showToast(`${unreadNotifications.length} notifiche segnate come lette`, 'success');
        console.log(`✅ ${unreadNotifications.length} notifiche segnate come lette`);
    }

    function updateNotificationInDOM(notificationId, isRead) {
        const notificationItem = document.querySelector(`[data-id="${notificationId}"]`);
        if (!notificationItem) return;

        const actionBtn = notificationItem.querySelector('[data-action]');

        if (isRead) {
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
            actionBtn.setAttribute('data-action', 'unread');
            actionBtn.setAttribute('title', 'Segna come non letta');
            actionBtn.innerHTML = getUnreadIcon();
        } else {
            notificationItem.classList.remove('read');
            notificationItem.classList.add('unread');
            actionBtn.setAttribute('data-action', 'read');
            actionBtn.setAttribute('title', 'Segna come letta');
            actionBtn.innerHTML = getReadIcon();
        }
    }

    // ===============================================
    // GESTIONE IMPOSTAZIONI
    // ===============================================
    function handleSettingToggle(e) {
        if (!e.target.matches('[data-setting]')) return;

        const settingKey = e.target.getAttribute('data-setting');
        const isEnabled = e.target.checked;

        appState.settings[settingKey] = isEnabled;

        console.log(`⚙️ Impostazione ${settingKey}: ${isEnabled ? 'ON' : 'OFF'}`);
    }

    function loadSettings() {
        // In implementazione reale: carica da localStorage o API
        // Per ora usa le impostazioni di default

        // Applica le impostazioni ai toggle
        Object.keys(appState.settings).forEach(settingKey => {
            const toggle = document.querySelector(`[data-setting="${settingKey}"]`);
            if (toggle) {
                toggle.checked = appState.settings[settingKey];
            }
        });

        console.log('⚙️ Impostazioni caricate');
    }

    function saveSettings() {
        // In implementazione reale: salva su localStorage o API
        localStorage.setItem('relaxpoint_notification_settings', JSON.stringify(appState.settings));

        showToast('Impostazioni salvate con successo', 'success');
        console.log('💾 Impostazioni salvate:', appState.settings);
    }

    function resetSettings() {
        if (!confirm('Sei sicuro di voler ripristinare tutte le impostazioni ai valori predefiniti?')) {
            return;
        }

        // Reset ai valori di default
        const defaultSettings = {
            'booking-confirmation': true,
            'booking-reminder': true,
            'booking-changes': true,
            'booking-arriving': true,
            'payment-completed': true,
            'payment-cashback': true,
            'payment-invoice': false,
            'lastminute-new': true,
            'lastminute-nearby': true,
            'lastminute-favorites': false,
            'review-request': true,
            'review-response': true,
            'marketing-offers': true,
            'marketing-newsletter': false,
            'marketing-discounts': true,
            'system-updates': true,
            'system-maintenance': true,
            'system-legal': true
        };

        appState.settings = { ...defaultSettings };

        // Aggiorna i toggle
        Object.keys(appState.settings).forEach(settingKey => {
            const toggle = document.querySelector(`[data-setting="${settingKey}"]`);
            if (toggle) {
                toggle.checked = appState.settings[settingKey];
            }
        });

        showToast('Impostazioni ripristinate ai valori predefiniti', 'success');
        console.log('🔄 Impostazioni ripristinate');
    }

    // ===============================================
    // STATISTICHE E CONTATORI
    // ===============================================
    function updateStatistics() {
        const stats = calculateStatistics();
        appState.stats = stats;

        if (elements.totalNotifications) {
            elements.totalNotifications.textContent = stats.total;
        }

        if (elements.unreadNotifications) {
            elements.unreadNotifications.textContent = stats.unread;
        }

        if (elements.todayNotifications) {
            elements.todayNotifications.textContent = stats.today;
        }

        // Aggiorna badge sidebar
        if (elements.unreadBadge) {
            if (stats.unread > 0) {
                elements.unreadBadge.textContent = stats.unread;
                elements.unreadBadge.style.display = 'block';
            } else {
                elements.unreadBadge.style.display = 'none';
            }
        }
    }

    function calculateStatistics() {
        const notifications = appState.notifications;
        const today = new Date().toDateString();

        return {
            total: notifications.length,
            unread: notifications.filter(n => !n.read).length,
            today: notifications.filter(n => new Date(n.timestamp).toDateString() === today).length
        };
    }

    function updateFilteredCount() {
        if (elements.filteredCount) {
            elements.filteredCount.textContent = appState.filteredNotifications.length;
        }
    }

    // ===============================================
    // PAGINAZIONE
    // ===============================================
    function changePage(direction) {
        const totalPages = Math.ceil(appState.filteredNotifications.length / appState.itemsPerPage);
        const newPage = appState.currentPage + direction;

        if (newPage < 1 || newPage > totalPages) return;

        appState.currentPage = newPage;
        renderNotifications();
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(appState.filteredNotifications.length / appState.itemsPerPage);

        if (elements.pageInfo) {
            elements.pageInfo.textContent = `Pagina ${appState.currentPage} di ${totalPages}`;
        }

        if (elements.prevPage) {
            elements.prevPage.disabled = appState.currentPage === 1;
        }

        if (elements.nextPage) {
            elements.nextPage.disabled = appState.currentPage === totalPages;
        }

        // Mostra/nascondi paginazione
        if (elements.pagination) {
            elements.pagination.style.display = totalPages > 1 ? 'flex' : 'none';
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function getNotificationIcon(category) {
        const icons = {
            booking: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
            payment: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>',
            lastminute: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15,1H9V3H15M11,14H13V8H11M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13C21,10.88 20.26,8.93 19.03,7.39Z"/></svg>',
            professional: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
            review: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
            marketing: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/></svg>',
            system: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>'
        };
        return icons[category] || icons.system;
    }

    function getReadIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
    }

    function getUnreadIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>';
    }

    function getDeleteIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>';
    }

    function getCategoryDisplayName(category) {
        const categoryNames = {
            booking: 'Prenotazioni',
            payment: 'Pagamenti',
            lastminute: 'Last Minute',
            professional: 'Professionisti',
            review: 'Recensioni',
            marketing: 'Marketing',
            system: 'Sistema'
        };
        return categoryNames[category] || category;
    }

    function formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - new Date(timestamp);

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) {
            return 'Ora';
        } else if (minutes < 60) {
            return `${minutes} min fa`;
        } else if (hours < 24) {
            return `${hours} ore fa`;
        } else if (days === 1) {
            return '1 giorno fa';
        } else if (days < 7) {
            return `${days} giorni fa`;
        } else {
            return new Date(timestamp).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    }

    function showLoading() {
        appState.isLoading = true;
        if (elements.loadingSpinner) {
            elements.loadingSpinner.style.display = 'flex';
        }
        if (elements.notificationsList) {
            elements.notificationsList.classList.add('loading');
        }
    }

    function hideLoading() {
        appState.isLoading = false;
        if (elements.loadingSpinner) {
            elements.loadingSpinner.style.display = 'none';
        }
        if (elements.notificationsList) {
            elements.notificationsList.classList.remove('loading');
        }
    }

    function showEmptyState() {
        if (elements.emptyState) {
            elements.emptyState.style.display = 'flex';
        }
        if (elements.notificationsList) {
            elements.notificationsList.style.display = 'none';
        }
    }

    function hideEmptyState() {
        if (elements.emptyState) {
            elements.emptyState.style.display = 'none';
        }
        if (elements.notificationsList) {
            elements.notificationsList.style.display = 'block';
        }
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getToastColor(type)};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 350px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const icon = getToastIcon(type);
        toast.innerHTML = `${icon}<span>${message}</span>`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    function getToastColor(type) {
        const colors = {
            success: 'var(--color-primary)',
            error: '#ef4444',
            warning: '#f59e0b',
            info: 'var(--color-secondary)'
        };
        return colors[type] || colors.info;
    }

    function getToastIcon(type) {
        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/></svg>',
            warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/></svg>'
        };
        return icons[type] || icons.info;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===============================================
    // FUNZIONALITÀ AVANZATE
    // ===============================================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Ctrl/Cmd + A = Segna tutte come lette
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                markAllAsRead();
            }

            // Ctrl/Cmd + F = Focus ricerca
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && elements.searchInput) {
                e.preventDefault();
                elements.searchInput.focus();
            }

            // Escape = Clear ricerca
            if (e.key === 'Escape' && elements.searchInput) {
                elements.searchInput.value = '';
                elements.searchInput.dispatchEvent(new Event('input'));
            }
        });
    }

    function setupRealTimeUpdates() {
        // Simula notifiche in tempo reale
        setInterval(() => {
            if (Math.random() > 0.95) { // 5% probabilità ogni 30 secondi
                const newNotification = generateRandomNotification();
                appState.notifications.unshift(newNotification);

                // Riapplica filtri se la nuova notifica matcha
                applyFilters();
                updateStatistics();

                showToast('Nuova notifica ricevuta', 'info');
                console.log('🔔 Nuova notifica simulata:', newNotification.title);
            }
        }, 30000);
    }

    function generateRandomNotification() {
        const types = [
            {
                type: 'booking-reminder',
                category: 'booking',
                title: 'Promemoria Prenotazione',
                message: 'Non dimenticare: domani alle 15:00 hai un appuntamento!'
            },
            {
                type: 'lastminute-new',
                category: 'lastminute',
                title: '⚡ Nuovo Last Minute!',
                message: 'Servizio Last Minute disponibile vicino a te - Prenota ora!',
                urgent: true
            },
            {
                type: 'payment-cashback',
                category: 'payment',
                title: 'Cashback Accreditato',
                message: 'Hai ricevuto €1.50 di cashback dalla tua ultima prenotazione.'
            }
        ];

        const randomType = types[Math.floor(Math.random() * types.length)];

        return {
            id: Date.now(),
            ...randomType,
            timestamp: new Date(),
            read: false,
            urgent: randomType.urgent || false
        };
    }

    function trackEvent(eventName, eventData = {}) {
        console.log(`📊 Analytics: ${eventName}`, eventData);

        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                page_title: 'Dashboard Notifiche',
                page_location: window.location.href,
                ...eventData
            });
        }
    }

    // ===============================================
    // GESTIONE ERRORI
    // ===============================================
    function handleError(error, context = 'Operazione') {
        console.error(`❌ Errore in ${context}:`, error);
        showToast(`${context} fallita. Riprova più tardi.`, 'error');
    }

    // ===============================================
    // INIZIALIZZAZIONE AVANZATA
    // ===============================================
    function initAdvancedFeatures() {
        setupKeyboardShortcuts();
        setupRealTimeUpdates();

        // Track page view
        trackEvent('page_view', {
            page_title: 'Dashboard Notifiche',
            user_type: 'cliente',
            total_notifications: appState.stats.total,
            unread_notifications: appState.stats.unread
        });
    }

    // ===============================================
    // CLEANUP
    // ===============================================
    function cleanup() {
        window.addEventListener('beforeunload', () => {
            console.log('🧹 Cleanup dashboard notifiche');
        });
    }

    // ===============================================
    // AVVIO APPLICAZIONE
    // ===============================================
    try {
        init();
        initAdvancedFeatures();
        cleanup();

        console.log('🚀 Dashboard Notifiche completamente inizializzata');

        setTimeout(() => {
            showToast('Centro notifiche caricato', 'success');
        }, 1000);

    } catch (error) {
        handleError(error, 'Inizializzazione dashboard notifiche');
    }

    // ===============================================
    // EXPORT PER DEBUG (solo development)
    // ===============================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.NotificationsDebug = {
            state: appState,
            mockData: mockNotifications,
            functions: {
                loadNotifications,
                applyFilters,
                markAllAsRead,
                showToast,
                updateStatistics
            }
        };
        console.log('🧪 Debug tools available: window.NotificationsDebug');
    }

});