/* ===============================================
   RELAXPOINT - JAVASCRIPT I MIEI SERVIZI
   Funzionalità base per gestione servizi professionista
   =============================================== */

document.addEventListener('DOMContentLoaded', function () {
    console.log('I Miei Servizi - Dashboard caricata');

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        setupEventListeners();
        setupToggleServices();
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        // Toggle servizi (espandi/comprimi)
        document.querySelectorAll('.toggle-service').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleService(this.closest('.service-group'));
            });
        });

        // Click header per espandere
        document.querySelectorAll('.service-header').forEach(header => {
            header.addEventListener('click', function (e) {
                if (!e.target.closest('.service-actions')) {
                    toggleService(this.closest('.service-group'));
                }
            });
        });

        // Aggiungi servizio
        const addServiceBtn = document.getElementById('addServiceBtn');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', function () {
                showNotification('Funzione "Aggiungi Servizio" - In sviluppo', 'info');
            });
        }

        // Aggiungi trattamento
        document.querySelectorAll('.add-treatment-btn').forEach(button => {
            button.addEventListener('click', function () {
                const serviceId = this.getAttribute('data-service');
                const serviceName = this.closest('.service-group').querySelector('.service-name').textContent;
                showNotification(`Aggiungi trattamento in "${serviceName}" - In sviluppo`, 'info');
            });
        });

        // Edit servizio
        document.querySelectorAll('.edit-service').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const serviceName = this.closest('.service-group').querySelector('.service-name').textContent;
                showNotification(`Modifica servizio "${serviceName}" - In sviluppo`, 'info');
            });
        });

        // Edit trattamento
        document.querySelectorAll('.edit-treatment').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const treatmentName = this.closest('.treatment-item').querySelector('.treatment-name').textContent;
                showNotification(`Modifica trattamento "${treatmentName}" - In sviluppo`, 'info');
            });
        });

        // Delete servizio
        document.querySelectorAll('.delete-service').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const serviceName = this.closest('.service-group').querySelector('.service-name').textContent;
                if (confirm(`Eliminare il servizio "${serviceName}" e tutti i suoi trattamenti?`)) {
                    deleteService(this.closest('.service-group'));
                }
            });
        });

        // Delete trattamento
        document.querySelectorAll('.delete-treatment').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const treatmentName = this.closest('.treatment-item').querySelector('.treatment-name').textContent;
                if (confirm(`Eliminare il trattamento "${treatmentName}"?`)) {
                    deleteTreatment(this.closest('.treatment-item'));
                }
            });
        });
    }

    // ===============================================
    // FUNZIONI TOGGLE SERVIZI
    // ===============================================
    function setupToggleServices() {
        // Tutti i servizi partono chiusi
        document.querySelectorAll('.service-group').forEach(group => {
            const treatmentsList = group.querySelector('.treatments-list');
            treatmentsList.classList.add('collapsed');
            treatmentsList.classList.remove('expanded');
        });
    }

    function toggleService(serviceGroup) {
        const treatmentsList = serviceGroup.querySelector('.treatments-list');
        const chevron = serviceGroup.querySelector('.chevron');

        if (treatmentsList.classList.contains('collapsed')) {
            // Apri
            treatmentsList.classList.remove('collapsed');
            treatmentsList.classList.add('expanded');
            serviceGroup.classList.add('expanded');
        } else {
            // Chiudi
            treatmentsList.classList.remove('expanded');
            treatmentsList.classList.add('collapsed');
            serviceGroup.classList.remove('expanded');
        }
    }

    // ===============================================
    // FUNZIONI CRUD
    // ===============================================
    function deleteService(serviceGroup) {
        serviceGroup.style.opacity = '0';
        serviceGroup.style.transform = 'scale(0.95)';
        serviceGroup.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            serviceGroup.remove();
            showNotification('Servizio eliminato', 'success');
            updateStats();
        }, 300);
    }

    function deleteTreatment(treatmentItem) {
        treatmentItem.style.opacity = '0';
        treatmentItem.style.transform = 'translateX(-100%)';
        treatmentItem.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            treatmentItem.remove();
            showNotification('Trattamento eliminato', 'success');
            updateServiceStats(treatmentItem.closest('.service-group'));
        }, 300);
    }

    // ===============================================
    // AGGIORNAMENTO STATISTICHE
    // ===============================================
    function updateStats() {
        const totalServices = document.querySelectorAll('.service-group').length;
        const totalTreatments = document.querySelectorAll('.treatment-item').length;

        // Aggiorna contatori nella stats overview
        const statsNumbers = document.querySelectorAll('.stat-number');
        if (statsNumbers[0]) statsNumbers[0].textContent = totalServices;
        if (statsNumbers[1]) statsNumbers[1].textContent = totalTreatments;
    }

    function updateServiceStats(serviceGroup) {
        const treatmentsCount = serviceGroup.querySelectorAll('.treatment-item').length;
        const countSpan = serviceGroup.querySelector('.treatment-count');

        if (countSpan) {
            countSpan.textContent = `${treatmentsCount} ${treatmentsCount === 1 ? 'trattamento' : 'trattamenti'}`;
        }

        updateStats();
    }

    // ===============================================
    // SISTEMA NOTIFICHE
    // ===============================================
    function showNotification(message, type = 'info') {
        // Usa il sistema esistente se disponibile
        if (window.dashboardProfessionista && window.dashboardProfessionista.showNotification) {
            window.dashboardProfessionista.showNotification(message, type);
            return;
        }

        // Sistema notifiche semplificato
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            background: ${getNotificationColor(type)};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Rimuovi automaticamente
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#3b82f6';
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function addServiceToList(serviceData) {
        // Simula aggiunta servizio alla lista
        console.log('Aggiungendo servizio:', serviceData);

        const serviceHTML = createServiceHTML(serviceData);
        const container = document.querySelector('.content-card .card-header').parentNode;
        container.insertAdjacentHTML('beforeend', serviceHTML);

        // Setup event listeners per il nuovo servizio
        setupEventListeners();
        updateStats();
    }

    function createServiceHTML(serviceData) {
        return `
            <div class="service-group" data-service="${serviceData.id}">
                <div class="service-header">
                    <div class="service-info">
                        <img src="${serviceData.image}" alt="${serviceData.name}" class="service-image">
                        <div class="service-details">
                            <h3 class="service-name">${serviceData.name}</h3>
                            <p class="service-description">${serviceData.description}</p>
                            <div class="service-stats">
                                <span class="treatment-count">0 trattamenti</span>
                                <span class="price-range">-- --</span>
                                <span class="rating">--</span>
                            </div>
                        </div>
                    </div>
                    <div class="service-actions">
                        <button class="btn-icon edit-service" title="Modifica servizio">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="btn-icon delete-service" title="Elimina servizio">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                        <button class="btn-icon toggle-service" title="Espandi/Chiudi">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="chevron">
                                <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="treatments-list collapsed">
                    <div class="add-treatment-item">
                        <button class="btn btn-outline add-treatment-btn" data-service="${serviceData.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Aggiungi Trattamento
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===============================================
    // CSS ANIMAZIONI DINAMICHE
    // ===============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ===============================================
    // ESPORTAZIONE FUNZIONI GLOBALI
    // ===============================================
    window.iMieiServiziManager = {
        toggleService: toggleService,
        deleteService: deleteService,
        deleteTreatment: deleteTreatment,
        addServiceToList: addServiceToList,
        updateStats: updateStats
    };

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    init();

    console.log('I Miei Servizi - Inizializzazione completata');
    console.log('Debug disponibile: window.iMieiServiziManager');
});