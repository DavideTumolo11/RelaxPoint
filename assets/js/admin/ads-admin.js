/*
=== GESTIONE ANNUNCI PUBBLICITARI - DASHBOARD ADMIN ===
JavaScript per la sezione pubblicità nella dashboard amministrativa
*/

class AdsAdmin {
    constructor() {
        this.currentTab = 'ads-overview';
        this.ads = [];
        this.zones = {};
        this.pricing = {};
        this.analytics = {};
        this.charts = {};
        this.init();
    }

    // === INIZIALIZZAZIONE ===
    init() {
        this.bindEvents();
        this.loadZones();
        this.loadPricing();
        this.loadAds();
        this.updateOverview();
        this.initCharts();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal events
        this.setupModalEvents();

        // Form events
        this.setupFormEvents();

        // Filter events
        this.setupFilterEvents();
    }

    // === TAB MANAGEMENT ===
    switchTab(tabId) {
        // Nasconde tutti i tab
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Mostra tab selezionato
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        this.currentTab = tabId;

        // Carica dati specifici per tab
        switch(tabId) {
            case 'ads-overview':
                this.updateOverview();
                break;
            case 'ads-manage':
                this.loadAdsList();
                break;
            case 'ads-zones':
                this.loadZonesView();
                break;
            case 'ads-pricing':
                this.loadPricingView();
                break;
            case 'ads-analytics':
                this.loadAnalytics();
                break;
        }
    }

    // === CARICAMENTO DATI ===
    async loadZones() {
        try {
            // In produzione: fetch('/api/admin/ads/zones')
            this.zones = {
                'header-banner': {
                    id: 'header-banner',
                    name: 'Header Banner',
                    description: 'Banner orizzontale nella parte superiore del sito',
                    type: 'basic',
                    maxAds: 1,
                    currentAds: 2,
                    impressions: 45230,
                    clicks: 892,
                    revenue: 1250
                },
                'hero-banner': {
                    id: 'hero-banner',
                    name: 'Hero Banner',
                    description: 'Banner principale nella sezione hero (massima visibilità)',
                    type: 'premium',
                    maxAds: 1,
                    currentAds: 1,
                    impressions: 78430,
                    clicks: 2341,
                    revenue: 3200
                },
                'sidebar-right': {
                    id: 'sidebar-right',
                    name: 'Sidebar Destra',
                    description: 'Area sidebar nelle pagine dei servizi',
                    type: 'basic',
                    maxAds: 3,
                    currentAds: 2,
                    impressions: 23450,
                    clicks: 456,
                    revenue: 680
                },
                'services-carousel': {
                    id: 'services-carousel',
                    name: 'Carousel Servizi',
                    description: 'Card integrate nel carousel dei servizi homepage',
                    type: 'premium',
                    maxAds: 2,
                    currentAds: 1,
                    impressions: 67890,
                    clicks: 1876,
                    revenue: 2800
                },
                'modal-popup': {
                    id: 'modal-popup',
                    name: 'Modal Popup',
                    description: 'Popup esclusivo (1 volta per sessione utente)',
                    type: 'exclusive',
                    maxAds: 1,
                    currentAds: 1,
                    impressions: 12340,
                    clicks: 987,
                    revenue: 4500
                },
                'footer-premium': {
                    id: 'footer-premium',
                    name: 'Footer Premium',
                    description: 'Banner footer su tutte le pagine del sito',
                    type: 'exclusive',
                    maxAds: 1,
                    currentAds: 0,
                    impressions: 0,
                    clicks: 0,
                    revenue: 0
                }
            };
        } catch (error) {
            console.error('Errore caricamento zone:', error);
            this.showError('Errore nel caricamento delle zone pubblicitarie');
        }
    }

    async loadPricing() {
        try {
            // In produzione: fetch('/api/admin/ads/pricing')
            this.pricing = {
                'header-banner': { daily: 50, weekly: 300, monthly: 1000 },
                'hero-banner': { daily: 150, weekly: 900, monthly: 3000 },
                'sidebar-right': { daily: 30, weekly: 180, monthly: 600 },
                'services-carousel': { daily: 120, weekly: 720, monthly: 2400 },
                'modal-popup': { daily: 200, weekly: 1200, monthly: 4000 },
                'footer-premium': { daily: 80, weekly: 480, monthly: 1600 }
            };
        } catch (error) {
            console.error('Errore caricamento pricing:', error);
            this.showError('Errore nel caricamento dei prezzi');
        }
    }

    async loadAds() {
        try {
            // In produzione: fetch('/api/admin/ads')
            this.ads = [
                {
                    id: 'ad-1',
                    title: 'Centro Benessere Vita Nova',
                    description: 'Scopri i nostri trattamenti esclusivi. Prenota ora!',
                    type: 'banner-horizontal',
                    zone: 'header-banner',
                    status: 'active',
                    priority: 'premium',
                    startDate: '2024-01-01',
                    endDate: '2024-01-31',
                    budget: 1000,
                    spent: 750,
                    impressions: 45230,
                    clicks: 892,
                    ctr: 1.97,
                    image: '/assets/images/ads/spa-ad-1.jpg',
                    url: 'https://centrovitanova.com',
                    cta: 'Prenota Ora'
                },
                {
                    id: 'ad-2',
                    title: 'Massaggi Ayurvedici Premium',
                    description: 'Tradizione millenaria per il tuo benessere',
                    type: 'card-native',
                    zone: 'services-carousel',
                    status: 'active',
                    priority: 'premium',
                    startDate: '2024-01-15',
                    endDate: '2024-02-15',
                    budget: 2000,
                    spent: 1200,
                    impressions: 67890,
                    clicks: 1876,
                    ctr: 2.76,
                    image: '/assets/images/ads/ayurveda-ad.jpg',
                    url: 'https://ayurvedamilano.com',
                    cta: 'Scopri di più'
                },
                {
                    id: 'ad-3',
                    title: 'Personal Trainer Certificato',
                    description: 'Raggiungi i tuoi obiettivi con un programma personalizzato',
                    type: 'sidebar',
                    zone: 'sidebar-right',
                    status: 'paused',
                    priority: 'basic',
                    startDate: '2024-01-01',
                    endDate: '2024-02-29',
                    budget: 800,
                    spent: 340,
                    impressions: 23450,
                    clicks: 456,
                    ctr: 1.94,
                    image: '/assets/images/ads/fitness-ad.jpg',
                    url: 'https://personaltrainer.com',
                    cta: 'Contattaci'
                },
                {
                    id: 'ad-4',
                    title: 'Settimana del Benessere',
                    description: 'Tutti i servizi a metà prezzo. Solo per questa settimana!',
                    type: 'hero-premium',
                    zone: 'hero-banner',
                    status: 'active',
                    priority: 'exclusive',
                    startDate: '2024-01-20',
                    endDate: '2024-01-27',
                    budget: 5000,
                    spent: 3200,
                    impressions: 78430,
                    clicks: 2341,
                    ctr: 2.98,
                    image: '/assets/images/ads/wellness-week.jpg',
                    url: 'https://settimanabenessere.com',
                    cta: 'Approfitta Ora'
                },
                {
                    id: 'ad-5',
                    title: 'Offerta Speciale Registration',
                    description: 'Registrati e ricevi 30% di sconto sul primo trattamento',
                    type: 'modal',
                    zone: 'modal-popup',
                    status: 'active',
                    priority: 'exclusive',
                    startDate: '2024-01-10',
                    endDate: '2024-02-10',
                    budget: 3000,
                    spent: 2250,
                    impressions: 12340,
                    clicks: 987,
                    ctr: 8.00,
                    image: '/assets/images/ads/special-offer.jpg',
                    url: '/registrazione.html',
                    cta: 'Registrati'
                }
            ];
        } catch (error) {
            console.error('Errore caricamento annunci:', error);
            this.showError('Errore nel caricamento degli annunci');
        }
    }

    // === VISTA OVERVIEW ===
    updateOverview() {
        const stats = this.calculateStats();

        // Aggiorna statistiche principali
        document.getElementById('active-ads-count').textContent = stats.activeAds;
        document.getElementById('total-impressions').textContent = this.formatNumber(stats.impressions);
        document.getElementById('total-clicks').textContent = this.formatNumber(stats.clicks);
        document.getElementById('average-ctr').textContent = stats.ctr + '%';
        document.getElementById('monthly-revenue').textContent = '€' + this.formatNumber(stats.revenue);
        document.getElementById('premium-zones-count').textContent = stats.premiumZones;

        // Carica tabella annunci recenti
        this.loadRecentAdsTable();
    }

    calculateStats() {
        const activeAds = this.ads.filter(ad => ad.status === 'active').length;
        const totalImpressions = this.ads.reduce((sum, ad) => sum + ad.impressions, 0);
        const totalClicks = this.ads.reduce((sum, ad) => sum + ad.clicks, 0);
        const totalRevenue = this.ads.reduce((sum, ad) => sum + ad.spent, 0);
        const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
        const premiumZones = Object.values(this.zones).filter(zone => zone.currentAds > 0 && zone.type !== 'basic').length;

        return {
            activeAds,
            impressions: totalImpressions,
            clicks: totalClicks,
            ctr,
            revenue: totalRevenue,
            premiumZones
        };
    }

    loadRecentAdsTable() {
        const tbody = document.getElementById('recent-ads-table');
        const recentAds = this.ads.slice(0, 5); // Ultimi 5

        tbody.innerHTML = recentAds.map(ad => `
            <tr>
                <td><span class="ad-id">#${ad.id}</span></td>
                <td>
                    <div class="ad-title-cell">
                        <strong>${ad.title}</strong>
                        <small>${ad.description}</small>
                    </div>
                </td>
                <td>
                    <span class="zone-badge zone-${this.zones[ad.zone]?.type || 'basic'}">
                        ${this.zones[ad.zone]?.name || ad.zone}
                    </span>
                </td>
                <td><span class="ad-type">${this.formatAdType(ad.type)}</span></td>
                <td><span class="status-badge status-${ad.status}">${this.formatStatus(ad.status)}</span></td>
                <td><strong>${this.formatNumber(ad.impressions)}</strong></td>
                <td><span class="ctr-value">${ad.ctr}%</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="adsAdmin.editAd('${ad.id}')" title="Modifica">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-view" onclick="adsAdmin.viewAdStats('${ad.id}')" title="Statistiche">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn-${ad.status === 'active' ? 'pause' : 'play'}"
                                onclick="adsAdmin.toggleAdStatus('${ad.id}')"
                                title="${ad.status === 'active' ? 'Pausa' : 'Attiva'}">
                            <i class="fas fa-${ad.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // === VISTA GESTIONE ANNUNCI ===
    loadAdsList() {
        const tbody = document.getElementById('ads-list-table');

        tbody.innerHTML = this.ads.map(ad => `
            <tr>
                <td>
                    <input type="checkbox" class="ad-checkbox" value="${ad.id}" onchange="adsAdmin.updateBulkActions()">
                </td>
                <td>
                    <div class="ad-preview-mini">
                        <img src="${ad.image}" alt="${ad.title}" class="ad-thumb">
                        <div class="ad-badge-mini">${this.formatAdType(ad.type)}</div>
                    </div>
                </td>
                <td>
                    <div class="ad-details">
                        <h4>${ad.title}</h4>
                        <p>${ad.description}</p>
                        <div class="ad-meta">
                            <span class="zone-badge zone-${this.zones[ad.zone]?.type || 'basic'}">
                                ${this.zones[ad.zone]?.name || ad.zone}
                            </span>
                            <span class="priority-badge priority-${ad.priority}">${ad.priority}</span>
                        </div>
                        <div class="ad-dates">
                            <small><i class="fas fa-calendar"></i> ${this.formatDateRange(ad.startDate, ad.endDate)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="ad-performance">
                        <div class="perf-item">
                            <span class="perf-label">Impressioni</span>
                            <span class="perf-value">${this.formatNumber(ad.impressions)}</span>
                        </div>
                        <div class="perf-item">
                            <span class="perf-label">Click</span>
                            <span class="perf-value">${this.formatNumber(ad.clicks)}</span>
                        </div>
                        <div class="perf-item">
                            <span class="perf-label">CTR</span>
                            <span class="perf-value ctr-${this.getCtrClass(ad.ctr)}">${ad.ctr}%</span>
                        </div>
                        <div class="perf-item">
                            <span class="perf-label">Budget</span>
                            <span class="perf-value">€${ad.spent}/€${ad.budget}</span>
                        </div>
                        <div class="budget-bar">
                            <div class="budget-progress" style="width: ${(ad.spent / ad.budget) * 100}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${ad.status}">${this.formatStatus(ad.status)}</span>
                    ${this.getStatusDetails(ad)}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" onclick="adsAdmin.editAd('${ad.id}')" title="Modifica">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-view" onclick="adsAdmin.viewAdStats('${ad.id}')" title="Statistiche">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn-copy" onclick="adsAdmin.duplicateAd('${ad.id}')" title="Duplica">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-${ad.status === 'active' ? 'pause' : 'play'}"
                                onclick="adsAdmin.toggleAdStatus('${ad.id}')"
                                title="${ad.status === 'active' ? 'Pausa' : 'Attiva'}">
                            <i class="fas fa-${ad.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn-delete" onclick="adsAdmin.deleteAd('${ad.id}')" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // === VISTA ZONE ===
    loadZonesView() {
        const container = document.querySelector('.zones-grid');

        container.innerHTML = Object.values(this.zones).map(zone => `
            <div class="zone-card ${zone.type}" onclick="adsAdmin.previewZone('${zone.id}')">
                <div class="zone-header">
                    <h3 class="zone-title">${zone.name}</h3>
                    <span class="zone-type ${zone.type}">${zone.type}</span>
                </div>
                <p class="zone-description">${zone.description}</p>

                <div class="zone-pricing">
                    <div class="price-item">
                        <div class="price-label">Giornaliero</div>
                        <div class="price-value">€${this.pricing[zone.id]?.daily || 0}</div>
                    </div>
                    <div class="price-item">
                        <div class="price-label">Settimanale</div>
                        <div class="price-value">€${this.pricing[zone.id]?.weekly || 0}</div>
                    </div>
                    <div class="price-item">
                        <div class="price-label">Mensile</div>
                        <div class="price-value">€${this.pricing[zone.id]?.monthly || 0}</div>
                    </div>
                </div>

                <div class="zone-stats">
                    <div class="stat-item">
                        <div class="stat-value">${zone.currentAds}/${zone.maxAds}</div>
                        <div class="stat-label">Annunci</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${this.formatNumber(zone.impressions)}</div>
                        <div class="stat-label">Impressioni</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">€${this.formatNumber(zone.revenue)}</div>
                        <div class="stat-label">Revenue</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    previewZone(zoneId) {
        const zone = this.zones[zoneId];
        const previewContainer = document.querySelector('.preview-container');

        // Rimuove selezioni precedenti
        document.querySelectorAll('.zone-card').forEach(card => card.classList.remove('selected'));

        // Seleziona card corrente
        event.currentTarget.classList.add('selected');

        // Carica anteprima zone
        previewContainer.innerHTML = `
            <div class="zone-preview-content">
                <h4>${zone.name}</h4>
                <p>${zone.description}</p>
                <div class="preview-mockup">
                    ${this.getZoneMockup(zone)}
                </div>
                <div class="zone-preview-stats">
                    <div class="preview-stat">
                        <strong>Occupazione:</strong> ${zone.currentAds}/${zone.maxAds} slot
                    </div>
                    <div class="preview-stat">
                        <strong>Performance CTR:</strong> ${zone.clicks > 0 ? ((zone.clicks / zone.impressions) * 100).toFixed(2) : 0}%
                    </div>
                    <div class="preview-stat">
                        <strong>Revenue totale:</strong> €${this.formatNumber(zone.revenue)}
                    </div>
                </div>
            </div>
        `;
    }

    getZoneMockup(zone) {
        // Genera mockup visuale della zona
        switch (zone.id) {
            case 'header-banner':
                return `<div class="mockup-header-banner">Banner Header (728x90)</div>`;
            case 'hero-banner':
                return `<div class="mockup-hero">Hero Banner (100% width, 400px height)</div>`;
            case 'sidebar-right':
                return `<div class="mockup-sidebar">Sidebar 300x250</div>`;
            case 'services-carousel':
                return `<div class="mockup-carousel">Card integrata nel carousel</div>`;
            case 'modal-popup':
                return `<div class="mockup-modal">Modal Popup (500x300)</div>`;
            case 'footer-premium':
                return `<div class="mockup-footer">Footer Banner (100% width)</div>`;
            default:
                return `<div class="mockup-generic">Zona personalizzata</div>`;
        }
    }

    // === VISTA PRICING ===
    loadPricingView() {
        const container = document.querySelector('.pricing-grid');

        container.innerHTML = Object.entries(this.zones).map(([zoneId, zone]) => `
            <div class="pricing-card">
                <div class="pricing-header">
                    <h3 class="pricing-title">${zone.name}</h3>
                    <span class="zone-type ${zone.type}">${zone.type}</span>
                </div>

                <div class="pricing-inputs">
                    <div class="price-input-group">
                        <label>Giornaliero (€)</label>
                        <input type="number" class="price-input" id="price-${zoneId}-daily"
                               value="${this.pricing[zoneId]?.daily || 0}" min="1" step="1">
                    </div>
                    <div class="price-input-group">
                        <label>Settimanale (€)</label>
                        <input type="number" class="price-input" id="price-${zoneId}-weekly"
                               value="${this.pricing[zoneId]?.weekly || 0}" min="1" step="1">
                    </div>
                    <div class="price-input-group">
                        <label>Mensile (€)</label>
                        <input type="number" class="price-input" id="price-${zoneId}-monthly"
                               value="${this.pricing[zoneId]?.monthly || 0}" min="1" step="1">
                    </div>
                </div>

                <div class="pricing-stats">
                    <small>
                        <strong>Revenue ultimo mese:</strong> €${this.formatNumber(zone.revenue)}<br>
                        <strong>Occupazione media:</strong> ${Math.round((zone.currentAds / zone.maxAds) * 100)}%
                    </small>
                </div>
            </div>
        `).join('');
    }

    // === VISTA ANALYTICS ===
    loadAnalytics() {
        const period = document.getElementById('analytics-period').value;
        const zone = document.getElementById('analytics-zone').value;

        // Carica dati analytics
        this.updateCharts(period, zone);
        this.updateTopPerformer();
    }

    initCharts() {
        // Inizializza Chart.js (se disponibile)
        if (typeof Chart !== 'undefined') {
            this.setupCharts();
        } else {
            // Carica Chart.js dinamicamente
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this.setupCharts();
            document.head.appendChild(script);
        }
    }

    setupCharts() {
        // Setup dei grafici - implementazione base
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        // Grafico impressioni
        this.charts.impressions = new Chart(document.getElementById('impressions-chart'), {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Impressioni',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: chartOptions
        });

        // Grafico click
        this.charts.clicks = new Chart(document.getElementById('clicks-chart'), {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Click',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: '#10b981'
                }]
            },
            options: chartOptions
        });

        // Grafico CTR per zona
        this.charts.ctr = new Chart(document.getElementById('ctr-chart'), {
            type: 'doughnut',
            data: {
                labels: Object.values(this.zones).map(zone => zone.name),
                datasets: [{
                    data: Object.values(this.zones).map(zone =>
                        zone.impressions > 0 ? ((zone.clicks / zone.impressions) * 100).toFixed(2) : 0
                    ),
                    backgroundColor: ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Grafico revenue
        this.charts.revenue = new Chart(document.getElementById('revenue-chart'), {
            type: 'bar',
            data: {
                labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
                datasets: [{
                    label: 'Revenue (€)',
                    data: [1200, 1500, 1800, 2200, 2800, 3200],
                    backgroundColor: '#f59e0b'
                }]
            },
            options: chartOptions
        });
    }

    updateTopPerformer() {
        const tbody = document.getElementById('top-performer-table');

        // Ordina per CTR
        const topAds = [...this.ads].sort((a, b) => b.ctr - a.ctr).slice(0, 5);

        tbody.innerHTML = topAds.map(ad => `
            <tr>
                <td>
                    <div class="top-ad-info">
                        <strong>${ad.title}</strong>
                        <small>#${ad.id}</small>
                    </div>
                </td>
                <td>
                    <span class="zone-badge zone-${this.zones[ad.zone]?.type || 'basic'}">
                        ${this.zones[ad.zone]?.name || ad.zone}
                    </span>
                </td>
                <td><strong>${this.formatNumber(ad.impressions)}</strong></td>
                <td><strong>${this.formatNumber(ad.clicks)}</strong></td>
                <td>
                    <span class="ctr-value ctr-${this.getCtrClass(ad.ctr)}">${ad.ctr}%</span>
                </td>
                <td><strong>€${this.formatNumber(ad.spent)}</strong></td>
            </tr>
        `).join('');
    }

    // === MODAL GESTIONE ===
    setupModalEvents() {
        // Chiusura modal
        document.querySelectorAll('.modal-close').forEach(close => {
            close.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                this.closeModal(modal);
            });
        });

        // Click fuori modal
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    setupFormEvents() {
        // Form creazione annuncio
        const createForm = document.getElementById('create-ad-form');
        if (createForm) {
            createForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createAd();
            });

            // Live preview
            createForm.addEventListener('input', () => {
                this.updateLivePreview();
            });
        }
    }

    setupFilterEvents() {
        // Filtri annunci
        ['ads-zone-filter', 'ads-status-filter', 'ads-type-filter'].forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.applyAdsFilters();
                });
            }
        });
    }

    // === AZIONI ANNUNCI ===
    showCreateAdModal() {
        const modal = document.getElementById('create-ad-modal');
        this.populateZoneCheckboxes();
        this.showModal(modal);
    }

    populateZoneCheckboxes() {
        const container = document.getElementById('ad-zones');
        container.innerHTML = Object.values(this.zones).map(zone => `
            <label>
                <input type="checkbox" value="${zone.id}" name="zones">
                <span class="zone-name">${zone.name}</span>
                <span class="zone-type ${zone.type}">${zone.type}</span>
            </label>
        `).join('');
    }

    updateLivePreview() {
        const title = document.getElementById('ad-title').value;
        const description = document.getElementById('ad-description').value;
        const type = document.getElementById('ad-type').value;
        const cta = document.getElementById('ad-cta').value;
        const preview = document.getElementById('ad-live-preview');

        if (!title || !description || !type) {
            preview.innerHTML = '<p>Compila i campi per vedere l\'anteprima</p>';
            return;
        }

        preview.innerHTML = `
            <div class="ad-container ad-${type} ad-preview">
                <div class="ad-badge">Sponsorizzato</div>
                <div class="ad-content">
                    ${type.includes('hero') ? '' : '<div class="ad-image-placeholder">Immagine</div>'}
                    <div class="ad-text">
                        <h3 class="ad-title">${title}</h3>
                        <p class="ad-description">${description}</p>
                        ${cta ? `<span class="ad-cta">${cta}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    async createAd() {
        const formData = new FormData(document.getElementById('create-ad-form'));

        try {
            // Validazione
            if (!this.validateAdForm(formData)) return;

            // In produzione: POST /api/admin/ads
            const adData = this.processAdFormData(formData);

            // Simula salvataggio
            await this.saveAd(adData);

            this.closeModal(document.getElementById('create-ad-modal'));
            this.showSuccess('Annuncio creato con successo!');
            this.loadAdsList();
            this.updateOverview();

        } catch (error) {
            console.error('Errore creazione annuncio:', error);
            this.showError('Errore nella creazione dell\'annuncio');
        }
    }

    validateAdForm(formData) {
        const required = ['ad-title', 'ad-description', 'ad-type', 'ad-url', 'ad-cta'];

        for (const field of required) {
            if (!formData.get(field)) {
                this.showError(`Il campo ${field.replace('ad-', '')} è obbligatorio`);
                return false;
            }
        }

        // Valida zone selezionate
        const zones = formData.getAll('zones');
        if (zones.length === 0) {
            this.showError('Seleziona almeno una zona pubblicitaria');
            return false;
        }

        return true;
    }

    // === AZIONI BULK ===
    updateBulkActions() {
        const checkboxes = document.querySelectorAll('.ad-checkbox:checked');
        const bulkActions = document.getElementById('bulk-actions');

        if (checkboxes.length > 0) {
            bulkActions.style.display = 'flex';
        } else {
            bulkActions.style.display = 'none';
        }
    }

    toggleAllAds() {
        const masterCheckbox = document.getElementById('select-all-ads');
        const checkboxes = document.querySelectorAll('.ad-checkbox');

        checkboxes.forEach(checkbox => {
            checkbox.checked = masterCheckbox.checked;
        });

        this.updateBulkActions();
    }

    async bulkActivateAds() {
        const selected = this.getSelectedAds();
        if (selected.length === 0) return;

        try {
            // In produzione: PATCH /api/admin/ads/bulk-activate
            for (const adId of selected) {
                const ad = this.ads.find(a => a.id === adId);
                if (ad) ad.status = 'active';
            }

            this.showSuccess(`${selected.length} annunci attivati`);
            this.loadAdsList();
            this.updateOverview();
        } catch (error) {
            this.showError('Errore nell\'attivazione degli annunci');
        }
    }

    async bulkPauseAds() {
        const selected = this.getSelectedAds();
        if (selected.length === 0) return;

        try {
            for (const adId of selected) {
                const ad = this.ads.find(a => a.id === adId);
                if (ad) ad.status = 'paused';
            }

            this.showSuccess(`${selected.length} annunci messi in pausa`);
            this.loadAdsList();
            this.updateOverview();
        } catch (error) {
            this.showError('Errore nella pausa degli annunci');
        }
    }

    async bulkDeleteAds() {
        const selected = this.getSelectedAds();
        if (selected.length === 0) return;

        if (!confirm(`Sei sicuro di voler eliminare ${selected.length} annunci?`)) return;

        try {
            this.ads = this.ads.filter(ad => !selected.includes(ad.id));

            this.showSuccess(`${selected.length} annunci eliminati`);
            this.loadAdsList();
            this.updateOverview();
        } catch (error) {
            this.showError('Errore nell\'eliminazione degli annunci');
        }
    }

    getSelectedAds() {
        return Array.from(document.querySelectorAll('.ad-checkbox:checked')).map(cb => cb.value);
    }

    // === FUNZIONI UTILITY ===
    formatNumber(num) {
        return new Intl.NumberFormat('it-IT').format(num);
    }

    formatAdType(type) {
        const types = {
            'banner-horizontal': 'Banner Orizzontale',
            'card-native': 'Card Nativa',
            'sidebar': 'Sidebar',
            'hero-premium': 'Hero Premium',
            'modal': 'Modal Popup'
        };
        return types[type] || type;
    }

    formatStatus(status) {
        const statuses = {
            'active': 'Attivo',
            'paused': 'In Pausa',
            'expired': 'Scaduto',
            'pending': 'In Attesa'
        };
        return statuses[status] || status;
    }

    formatDateRange(start, end) {
        const startDate = new Date(start).toLocaleDateString('it-IT');
        const endDate = new Date(end).toLocaleDateString('it-IT');
        return `${startDate} - ${endDate}`;
    }

    getCtrClass(ctr) {
        if (ctr >= 3) return 'excellent';
        if (ctr >= 2) return 'good';
        if (ctr >= 1) return 'average';
        return 'poor';
    }

    getStatusDetails(ad) {
        const now = new Date();
        const endDate = new Date(ad.endDate);

        if (ad.status === 'active' && endDate < now) {
            return '<small style="color: #f59e0b;">Scade oggi</small>';
        }

        if (ad.spent >= ad.budget * 0.9) {
            return '<small style="color: #ef4444;">Budget quasi esaurito</small>';
        }

        return '';
    }

    showModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    showSuccess(message) {
        // Implementa notifica di successo
        console.log('SUCCESS:', message);
    }

    showError(message) {
        // Implementa notifica di errore
        console.error('ERROR:', message);
    }

    // === AZIONI SINGOLI ANNUNCI ===
    editAd(adId) {
        // Implementa modifica annuncio
        console.log('Edit ad:', adId);
    }

    viewAdStats(adId) {
        // Implementa vista statistiche dettagliate
        console.log('View stats for ad:', adId);
    }

    async toggleAdStatus(adId) {
        const ad = this.ads.find(a => a.id === adId);
        if (!ad) return;

        const newStatus = ad.status === 'active' ? 'paused' : 'active';
        ad.status = newStatus;

        this.showSuccess(`Annuncio ${newStatus === 'active' ? 'attivato' : 'messo in pausa'}`);
        this.loadAdsList();
        this.updateOverview();
    }

    duplicateAd(adId) {
        const ad = this.ads.find(a => a.id === adId);
        if (!ad) return;

        const newAd = {
            ...ad,
            id: 'ad-' + (this.ads.length + 1),
            title: ad.title + ' (Copia)',
            status: 'paused',
            impressions: 0,
            clicks: 0,
            spent: 0
        };

        this.ads.push(newAd);
        this.showSuccess('Annuncio duplicato con successo');
        this.loadAdsList();
    }

    async deleteAd(adId) {
        if (!confirm('Sei sicuro di voler eliminare questo annuncio?')) return;

        this.ads = this.ads.filter(ad => ad.id !== adId);
        this.showSuccess('Annuncio eliminato');
        this.loadAdsList();
        this.updateOverview();
    }

    // === EXPORT/IMPORT ===
    exportAds() {
        const data = {
            ads: this.ads,
            zones: this.zones,
            pricing: this.pricing,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relaxpoint-ads-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportAnalytics() {
        const analyticsData = {
            overview: this.calculateStats(),
            adPerformance: this.ads.map(ad => ({
                id: ad.id,
                title: ad.title,
                zone: ad.zone,
                impressions: ad.impressions,
                clicks: ad.clicks,
                ctr: ad.ctr,
                spent: ad.spent,
                budget: ad.budget
            })),
            zonePerformance: Object.values(this.zones),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relaxpoint-analytics-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // === FILTRI ===
    applyAdsFilters() {
        const zoneFilter = document.getElementById('ads-zone-filter').value;
        const statusFilter = document.getElementById('ads-status-filter').value;
        const typeFilter = document.getElementById('ads-type-filter').value;

        // Implementa filtri (per semplicità non implementato completamente)
        this.loadAdsList();
    }
}

// === INIZIALIZZAZIONE ===
let adsAdmin;

document.addEventListener('DOMContentLoaded', () => {
    // Inizializza solo se siamo nella sezione ads
    if (document.getElementById('ads-section')) {
        adsAdmin = new AdsAdmin();
    }
});

// === FUNZIONI GLOBALI PER ONCLICK ===
window.showCreateAdModal = () => adsAdmin.showCreateAdModal();
window.applyAdsFilters = () => adsAdmin.applyAdsFilters();
window.toggleAllAds = () => adsAdmin.toggleAllAds();
window.bulkActivateAds = () => adsAdmin.bulkActivateAds();
window.bulkPauseAds = () => adsAdmin.bulkPauseAds();
window.bulkDeleteAds = () => adsAdmin.bulkDeleteAds();
window.updatePricing = () => adsAdmin.updatePricing();
window.resetPricing = () => adsAdmin.resetPricing();
window.loadAnalytics = () => adsAdmin.loadAnalytics();
window.exportAnalytics = () => adsAdmin.exportAnalytics();
window.exportAds = () => adsAdmin.exportAds();
window.importAds = () => adsAdmin.importAds();
window.closeModal = (modalId) => {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    adsAdmin.closeModal(modal);
};
window.previewAdImage = () => {
    // Implementa preview immagine
    console.log('Preview image');
};
window.updateAdPreview = () => adsAdmin.updateLivePreview();