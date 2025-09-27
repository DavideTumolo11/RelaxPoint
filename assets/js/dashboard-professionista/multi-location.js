// ===============================================
// MULTI-LOCATION MANAGEMENT - PREMIUM FEATURE
// ===============================================

class MultiLocationManager {
    constructor() {
        this.isPremium = this.checkUserPremiumStatus();
        this.locations = [];
        this.currentView = 'grid';
        this.editingLocationId = null;
        this.init();
    }

    init() {
        this.checkPremiumAccess();
        this.loadLocations();
        this.setupEventListeners();
        this.renderLocations();
        this.updateStats();
        console.log('Multi-Location Manager inizializzato');
    }

    checkUserPremiumStatus() {
        // TODO: Connect to backend API to get real user premium status
        // For now, check localStorage or a global variable
        return localStorage.getItem('userPremium') === 'true' || window.userProfile?.premium === true;
    }

    checkPremiumAccess() {
        const premiumCheck = document.getElementById('premiumCheck');
        const locationsContent = document.getElementById('locationsContent');

        if (!this.isPremium) {
            premiumCheck.style.display = 'block';
            locationsContent.style.display = 'none';
        } else {
            premiumCheck.style.display = 'none';
            locationsContent.style.display = 'block';
        }
    }

    loadLocations() {
        // TODO: Load from backend API
        // For now, load from localStorage with sample data
        const savedLocations = localStorage.getItem('userLocations');

        if (savedLocations) {
            this.locations = JSON.parse(savedLocations);
        } else {
            // Sample data for Premium users
            if (this.isPremium) {
                this.locations = [
                    {
                        id: 1,
                        name: "RelaxPoint Centro",
                        address: "Via Roma 123, 00100 Roma RM",
                        city: "Roma",
                        zip: "00100",
                        phone: "+39 06 1234567",
                        email: "centro@relaxpoint.com",
                        status: "active",
                        description: "La nostra sede principale nel cuore di Roma",
                        services: 12,
                        bookings: 45,
                        rating: 4.9,
                        schedule: {
                            lunedi: { open: "09:00", close: "18:00", active: true },
                            martedi: { open: "09:00", close: "18:00", active: true },
                            mercoledi: { open: "09:00", close: "18:00", active: true },
                            giovedi: { open: "09:00", close: "18:00", active: true },
                            venerdi: { open: "09:00", close: "18:00", active: true },
                            sabato: { open: "09:00", close: "13:00", active: false },
                            domenica: { open: "09:00", close: "13:00", active: false }
                        }
                    },
                    {
                        id: 2,
                        name: "RelaxPoint Nord",
                        address: "Via Milano 456, 20100 Milano MI",
                        city: "Milano",
                        zip: "20100",
                        phone: "+39 02 9876543",
                        email: "nord@relaxpoint.com",
                        status: "active",
                        description: "Sede moderna nella zona business di Milano",
                        services: 8,
                        bookings: 38,
                        rating: 4.7,
                        schedule: {
                            lunedi: { open: "09:00", close: "19:00", active: true },
                            martedi: { open: "09:00", close: "19:00", active: true },
                            mercoledi: { open: "09:00", close: "19:00", active: true },
                            giovedi: { open: "09:00", close: "19:00", active: true },
                            venerdi: { open: "09:00", close: "19:00", active: true },
                            sabato: { open: "10:00", close: "14:00", active: true },
                            domenica: { open: "10:00", close: "14:00", active: false }
                        }
                    },
                    {
                        id: 3,
                        name: "RelaxPoint Spa",
                        address: "Via Napoli 789, 80100 Napoli NA",
                        city: "Napoli",
                        zip: "80100",
                        phone: "+39 081 1122334",
                        email: "spa@relaxpoint.com",
                        status: "maintenance",
                        description: "Centro benessere con servizi spa premium",
                        services: 4,
                        bookings: 44,
                        rating: 4.8,
                        schedule: {
                            lunedi: { open: "10:00", close: "20:00", active: true },
                            martedi: { open: "10:00", close: "20:00", active: true },
                            mercoledi: { open: "10:00", close: "20:00", active: true },
                            giovedi: { open: "10:00", close: "20:00", active: true },
                            venerdi: { open: "10:00", close: "20:00", active: true },
                            sabato: { open: "09:00", close: "18:00", active: true },
                            domenica: { open: "09:00", close: "18:00", active: true }
                        }
                    }
                ];
                this.saveLocations();
            }
        }
    }

    saveLocations() {
        localStorage.setItem('userLocations', JSON.stringify(this.locations));
    }

    setupEventListeners() {
        // Schedule checkboxes
        const checkboxes = document.querySelectorAll('input[name="days"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.toggleScheduleDay.bind(this));
        });
    }

    toggleScheduleDay(event) {
        const day = event.target.value;
        const openInput = document.querySelector(`input[name="${day}_open"]`);
        const closeInput = document.querySelector(`input[name="${day}_close"]`);

        if (event.target.checked) {
            openInput.disabled = false;
            closeInput.disabled = false;
        } else {
            openInput.disabled = true;
            closeInput.disabled = true;
        }
    }

    renderLocations() {
        if (!this.isPremium) return;

        const container = document.getElementById('locationsGrid');
        if (!container) return;

        if (this.currentView === 'grid') {
            container.className = 'locations-grid';
            container.innerHTML = this.locations.map(location => this.renderLocationCard(location)).join('');
        } else {
            container.className = 'locations-list';
            container.innerHTML = this.locations.map(location => this.renderLocationListItem(location)).join('');
        }
    }

    renderLocationCard(location) {
        const statusClass = location.status;
        const statusText = {
            active: 'Attiva',
            inactive: 'Non Attiva',
            maintenance: 'Manutenzione'
        };

        return `
            <div class="location-card" onclick="editLocation(${location.id})">
                <div class="location-header">
                    <div class="location-title">
                        <h3 class="location-name">${location.name}</h3>
                        <span class="location-status ${statusClass}">${statusText[statusClass]}</span>
                    </div>
                    <div class="location-address">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        ${location.city}, ${location.zip}
                    </div>
                </div>
                <div class="location-body">
                    <div class="location-stats">
                        <div class="location-stat">
                            <span class="location-stat-number">${location.services}</span>
                            <span class="location-stat-label">Servizi</span>
                        </div>
                        <div class="location-stat">
                            <span class="location-stat-number">${location.bookings}</span>
                            <span class="location-stat-label">Prenotazioni</span>
                        </div>
                    </div>
                    <div class="location-actions">
                        <button class="btn-location-action primary" onclick="event.stopPropagation(); manageLocation(${location.id})">
                            Gestisci
                        </button>
                        <button class="btn-location-action" onclick="event.stopPropagation(); viewStats(${location.id})">
                            Stats
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderLocationListItem(location) {
        const statusClass = location.status;
        const statusText = {
            active: 'Attiva',
            inactive: 'Non Attiva',
            maintenance: 'Manutenzione'
        };

        return `
            <div class="location-list-item" onclick="editLocation(${location.id})">
                <div class="location-info">
                    <h3>${location.name}</h3>
                    <p>${location.address}</p>
                    <span class="location-status ${statusClass}">${statusText[statusClass]}</span>
                </div>
                <div class="location-quick-stats">
                    <span>${location.services} servizi</span>
                    <span>${location.bookings} prenotazioni</span>
                    <span>⭐ ${location.rating}</span>
                </div>
                <div class="location-list-actions">
                    <button class="btn-location-action primary" onclick="event.stopPropagation(); manageLocation(${location.id})">
                        Gestisci
                    </button>
                    <button class="btn-location-action" onclick="event.stopPropagation(); editLocation(${location.id})">
                        Modifica
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        if (!this.isPremium) return;

        const totalLocations = this.locations.length;
        const totalServices = this.locations.reduce((sum, loc) => sum + loc.services, 0);
        const totalBookings = this.locations.reduce((sum, loc) => sum + loc.bookings, 0);
        const avgRating = (this.locations.reduce((sum, loc) => sum + loc.rating, 0) / totalLocations).toFixed(1);

        document.getElementById('totalLocations').textContent = totalLocations;
        document.getElementById('totalServices').textContent = totalServices;
        document.getElementById('monthlyBookings').textContent = totalBookings;
        document.getElementById('avgRating').textContent = avgRating;
    }

    addNewLocation() {
        if (!this.isPremium) {
            this.showPremiumUpgradeModal();
            return;
        }

        this.editingLocationId = null;
        document.getElementById('modalTitle').textContent = 'Aggiungi Nuova Sede';
        this.resetLocationForm();
        this.showLocationModal();
    }

    editLocation(locationId) {
        if (!this.isPremium) return;

        this.editingLocationId = locationId;
        const location = this.locations.find(loc => loc.id === locationId);
        if (!location) return;

        document.getElementById('modalTitle').textContent = 'Modifica Sede';
        this.populateLocationForm(location);
        this.showLocationModal();
    }

    populateLocationForm(location) {
        document.getElementById('locationName').value = location.name;
        document.getElementById('locationAddress').value = location.address;
        document.getElementById('locationCity').value = location.city;
        document.getElementById('locationZip').value = location.zip;
        document.getElementById('locationPhone').value = location.phone || '';
        document.getElementById('locationEmail').value = location.email || '';
        document.getElementById('locationStatus').value = location.status;
        document.getElementById('locationDescription').value = location.description || '';

        // Populate schedule
        Object.keys(location.schedule).forEach(day => {
            const checkbox = document.querySelector(`input[name="days"][value="${day}"]`);
            const openInput = document.querySelector(`input[name="${day}_open"]`);
            const closeInput = document.querySelector(`input[name="${day}_close"]`);

            if (checkbox && openInput && closeInput) {
                checkbox.checked = location.schedule[day].active;
                openInput.value = location.schedule[day].open;
                closeInput.value = location.schedule[day].close;
                openInput.disabled = !location.schedule[day].active;
                closeInput.disabled = !location.schedule[day].active;
            }
        });
    }

    resetLocationForm() {
        document.getElementById('locationForm').reset();

        // Reset schedule - enable weekdays, disable weekends
        const weekdays = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi'];
        const weekends = ['sabato', 'domenica'];

        weekdays.forEach(day => {
            const checkbox = document.querySelector(`input[name="days"][value="${day}"]`);
            const openInput = document.querySelector(`input[name="${day}_open"]`);
            const closeInput = document.querySelector(`input[name="${day}_close"]`);

            if (checkbox) {
                checkbox.checked = true;
                openInput.disabled = false;
                closeInput.disabled = false;
            }
        });

        weekends.forEach(day => {
            const checkbox = document.querySelector(`input[name="days"][value="${day}"]`);
            const openInput = document.querySelector(`input[name="${day}_open"]`);
            const closeInput = document.querySelector(`input[name="${day}_close"]`);

            if (checkbox) {
                checkbox.checked = false;
                openInput.disabled = true;
                closeInput.disabled = true;
            }
        });
    }

    saveLocation() {
        if (!this.isPremium) return;

        const formData = new FormData(document.getElementById('locationForm'));
        const locationData = {
            name: formData.get('locationName'),
            address: formData.get('locationAddress'),
            city: formData.get('locationCity'),
            zip: formData.get('locationZip'),
            phone: formData.get('locationPhone'),
            email: formData.get('locationEmail'),
            status: formData.get('locationStatus'),
            description: formData.get('locationDescription'),
            schedule: {}
        };

        // Collect schedule data
        const days = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];
        days.forEach(day => {
            const checkbox = document.querySelector(`input[name="days"][value="${day}"]`);
            locationData.schedule[day] = {
                active: checkbox ? checkbox.checked : false,
                open: formData.get(`${day}_open`) || '09:00',
                close: formData.get(`${day}_close`) || '18:00'
            };
        });

        // Validation
        if (!locationData.name || !locationData.address || !locationData.city || !locationData.zip) {
            this.showNotification('Compila tutti i campi obbligatori', 'error');
            return;
        }

        // Save or update
        if (this.editingLocationId) {
            // Update existing location
            const index = this.locations.findIndex(loc => loc.id === this.editingLocationId);
            if (index !== -1) {
                this.locations[index] = {
                    ...this.locations[index],
                    ...locationData
                };
                this.showNotification('Sede aggiornata con successo', 'success');
            }
        } else {
            // Add new location
            const newLocation = {
                id: Date.now(),
                ...locationData,
                services: 0,
                bookings: 0,
                rating: 0
            };
            this.locations.push(newLocation);
            this.showNotification('Nuova sede aggiunta con successo', 'success');
        }

        this.saveLocations();
        this.renderLocations();
        this.updateStats();
        this.closeLocationModal();
    }

    deleteLocation(locationId) {
        if (!this.isPremium) return;

        if (confirm('Sei sicuro di voler eliminare questa sede? Questa azione non può essere annullata.')) {
            this.locations = this.locations.filter(loc => loc.id !== locationId);
            this.saveLocations();
            this.renderLocations();
            this.updateStats();
            this.showNotification('Sede eliminata con successo', 'success');
        }
    }

    showLocationModal() {
        document.getElementById('locationModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeLocationModal() {
        document.getElementById('locationModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.editingLocationId = null;
    }

    switchView(view) {
        this.currentView = view;

        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.toggle-btn').classList.add('active');

        this.renderLocations();
    }

    showPremiumUpgradeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay premium-limit-modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>⚡ Multi-Location riservato a Premium</h3>
                    <button class="btn-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="premium-limit-content">
                        <div class="limit-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                        </div>
                        <p>La gestione Multi-Location è una <strong>funzionalità Premium</strong> esclusiva.</p>
                        <p>Upgrade il tuo account per gestire più sedi e massimizzare il tuo business.</p>
                        <div class="premium-benefits">
                            <h4>🎯 Con RelaxPoint Premium ottieni:</h4>
                            <ul>
                                <li>✅ Sedi illimitate</li>
                                <li>✅ Gestione centralizzata</li>
                                <li>✅ Analytics per sede</li>
                                <li>✅ Calendario condiviso</li>
                                <li>✅ Servizi illimitati per sede</li>
                                <li>✅ Priority nei risultati di ricerca</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">
                        Chiudi
                    </button>
                    <button class="btn-premium" onclick="upgradeToPremium()">
                        ⚡ Passa a Premium
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }
}

// Global Functions
function addNewLocation() {
    window.multiLocationManager.addNewLocation();
}

function editLocation(locationId) {
    window.multiLocationManager.editLocation(locationId);
}

function saveLocation() {
    window.multiLocationManager.saveLocation();
}

function closeLocationModal() {
    window.multiLocationManager.closeLocationModal();
}

function switchView(view) {
    window.multiLocationManager.switchView(view);
}

function manageLocation(locationId) {
    // TODO: Navigate to individual location management page
    window.multiLocationManager.showNotification('Apertura gestione sede...', 'info');
    setTimeout(() => {
        window.location.href = `location-details.html?id=${locationId}`;
    }, 1000);
}

function viewStats(locationId) {
    // TODO: Show detailed stats modal or navigate to analytics page
    window.multiLocationManager.showNotification('Apertura statistiche sede...', 'info');
}

function upgradeToPremium() {
    // TODO: Connect to premium upgrade flow
    window.multiLocationManager.showNotification('Reindirizzamento a pagina Premium...', 'success');
    setTimeout(() => {
        window.location.href = '/pages/premium-upgrade.html';
    }, 1500);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.multiLocationManager = new MultiLocationManager();
});

console.log('Multi-Location JS caricato completamente');