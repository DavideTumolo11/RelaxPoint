// ===============================================
// ADS SYSTEM PREMIUM - SISTEMA PUBBLICITARIO
// ===============================================

class AdsSystem {
    constructor() {
        this.campaigns = [];
        this.currentStep = 1;
        this.maxSteps = 3;
        this.activeTab = 'campaigns';
        this.init();
    }

    init() {
        this.loadSampleCampaigns();
        this.setupEventListeners();
        this.renderCampaigns();
        this.setupTabs();
        this.updateStats();
        console.log('Sistema Pubblicità Premium inizializzato');
    }

    loadSampleCampaigns() {
        this.campaigns = [
            {
                id: 1,
                name: 'Massaggi Rilassanti - Promozione Autunno',
                objective: 'conversions',
                service: 'massaggi',
                status: 'active',
                title: 'Rilassati con i nostri massaggi premium',
                description: 'Trattamenti personalizzati per il tuo benessere',
                cta: 'Prenota Ora',
                dailyBudget: 25,
                duration: 30,
                startDate: '2024-09-01',
                endDate: '2024-10-01',
                impressions: 8540,
                clicks: 326,
                conversions: 23,
                spent: 287,
                ctr: 3.8,
                cpc: 0.88
            },
            {
                id: 2,
                name: 'Trattamenti Viso - Weekend Speciale',
                objective: 'awareness',
                service: 'trattamenti-viso',
                status: 'active',
                title: 'Rigenera la tua pelle questo weekend',
                description: 'Trattamenti viso professionali con prodotti naturali',
                cta: 'Scopri di Più',
                dailyBudget: 20,
                duration: 14,
                startDate: '2024-09-15',
                endDate: '2024-09-29',
                impressions: 5240,
                clicks: 189,
                conversions: 12,
                spent: 156,
                ctr: 3.6,
                cpc: 0.83
            },
            {
                id: 3,
                name: 'Pacchetti Wellness - Offerta Limitata',
                objective: 'traffic',
                service: 'wellness',
                status: 'paused',
                title: 'Pacchetti wellness completi a prezzo speciale',
                description: 'Combina massaggio, trattamento viso e sauna',
                cta: 'Visita il Sito',
                dailyBudget: 30,
                duration: 21,
                startDate: '2024-08-20',
                endDate: '2024-09-10',
                impressions: 12180,
                clicks: 567,
                conversions: 34,
                spent: 412,
                ctr: 4.7,
                cpc: 0.73
            }
        ];
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-header').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Setup audience listeners
        this.setupAudienceListeners();
    }

    setupAudienceListeners() {
        // Age range sliders
        const ageMin = document.getElementById('ageMin');
        const ageMax = document.getElementById('ageMax');
        const ageMinValue = document.getElementById('ageMinValue');
        const ageMaxValue = document.getElementById('ageMaxValue');

        if (ageMin && ageMax) {
            ageMin.addEventListener('input', (e) => {
                if (ageMinValue) ageMinValue.textContent = e.target.value;
                this.updateEstimatedReach();
            });

            ageMax.addEventListener('input', (e) => {
                if (ageMaxValue) ageMaxValue.textContent = e.target.value;
                this.updateEstimatedReach();
            });
        }

        // Interest tags
        document.querySelectorAll('.interest-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.target.classList.toggle('active');
                this.updateEstimatedReach();
            });
        });
    }

    setupTabs() {
        this.switchTab('campaigns');
    }

    switchTab(tabName) {
        this.activeTab = tabName;

        // Update tab headers
        document.querySelectorAll('.tab-header').forEach(header => {
            header.classList.remove('active');
        });
        const activeHeader = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeHeader) activeHeader.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(tabName);
        if (activeContent) activeContent.classList.add('active');

        // Load content based on tab
        if (tabName === 'campaigns') {
            this.renderCampaigns();
        } else if (tabName === 'audience') {
            this.updateEstimatedReach();
        }
    }

    renderCampaigns() {
        const campaignsList = document.getElementById('campaignsList');
        if (!campaignsList) return;

        campaignsList.innerHTML = this.campaigns.map(campaign => `
            <div class="campaign-card" data-campaign-id="${campaign.id}">
                <div class="campaign-header">
                    <div class="campaign-info">
                        <h4>${campaign.name}</h4>
                        <p class="campaign-objective">${this.getObjectiveLabel(campaign.objective)}</p>
                    </div>
                    <span class="campaign-status ${campaign.status}">
                        ${this.getStatusLabel(campaign.status)}
                    </span>
                </div>

                <div class="campaign-metrics">
                    <div class="metric-item">
                        <div class="metric-value">${campaign.impressions.toLocaleString()}</div>
                        <div class="metric-label">Impressions</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${campaign.clicks}</div>
                        <div class="metric-label">Click</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${campaign.ctr}%</div>
                        <div class="metric-label">CTR</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">€${campaign.spent}</div>
                        <div class="metric-label">Speso</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${campaign.conversions}</div>
                        <div class="metric-label">Conversioni</div>
                    </div>
                </div>

                <div class="campaign-actions">
                    ${campaign.status === 'active' ?
                        `<button class="campaign-action-btn" onclick="adsSystem.pauseCampaign(${campaign.id})">Pausa</button>` :
                        campaign.status === 'paused' ?
                        `<button class="campaign-action-btn primary" onclick="adsSystem.resumeCampaign(${campaign.id})">Riprendi</button>` :
                        ''
                    }
                    <button class="campaign-action-btn" onclick="adsSystem.viewCampaignDetails(${campaign.id})">Dettagli</button>
                </div>
            </div>
        `).join('');
    }

    getObjectiveLabel(objective) {
        const labels = {
            'awareness': 'Aumenta la visibilità',
            'traffic': 'Porta visite al sito',
            'conversions': 'Aumenta le prenotazioni',
            'engagement': 'Aumenta l\'interazione'
        };
        return labels[objective] || objective;
    }

    getStatusLabel(status) {
        const labels = {
            'active': 'Attiva',
            'paused': 'In Pausa',
            'ended': 'Terminata'
        };
        return labels[status] || status;
    }

    updateStats() {
        const activeCampaigns = this.campaigns.filter(c => c.status === 'active').length;
        const totalImpressions = this.campaigns.reduce((sum, c) => sum + c.impressions, 0);
        const totalClicks = this.campaigns.reduce((sum, c) => sum + c.clicks, 0);
        const monthlyBudget = this.campaigns.reduce((sum, c) => sum + c.spent, 0);

        const elements = {
            'activeCampaigns': activeCampaigns,
            'totalImpressions': this.formatNumber(totalImpressions),
            'totalClicks': this.formatNumber(totalClicks),
            'monthlyBudget': `€${monthlyBudget}`
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    updateEstimatedReach() {
        const activeInterests = document.querySelectorAll('.interest-tag.active').length;
        const baseReach = 10000;
        const interestMultiplier = Math.max(0.3, activeInterests * 0.2);
        const reach = Math.floor(baseReach * interestMultiplier * (0.8 + Math.random() * 0.4));

        const reachElement = document.getElementById('estimatedReach');
        if (reachElement) {
            reachElement.textContent = reach.toLocaleString();
        }
    }

    // Campaign Actions
    pauseCampaign(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (campaign) {
            campaign.status = 'paused';
            this.renderCampaigns();
            this.updateStats();
            this.showNotification(`Campagna "${campaign.name}" messa in pausa`, 'info');
        }
    }

    resumeCampaign(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (campaign) {
            campaign.status = 'active';
            this.renderCampaigns();
            this.updateStats();
            this.showNotification(`Campagna "${campaign.name}" riattivata`, 'success');
        }
    }

    viewCampaignDetails(campaignId) {
        const campaign = this.campaigns.find(c => c.id === campaignId);
        if (campaign) {
            this.showNotification(`Dettagli campagna "${campaign.name}" - Feature in sviluppo`, 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ads-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('.ads-notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'ads-notification-styles';
            styles.textContent = `
                .ads-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    padding: 16px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    max-width: 350px;
                    animation: slideInRight 0.3s ease-out;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .ads-notification.info { background: #52A373; }
                .ads-notification.error { background: #ef4444; }
                .ads-notification.success { background: #52A373; }
                .ads-notification .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                .ads-notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .ads-notification button:hover {
                    background: rgba(255,255,255,0.2);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }
}

// Global functions
function openCreateCampaignModal() {
    if (window.adsSystem) {
        window.adsSystem.showNotification('Creazione campagna - Feature in sviluppo', 'info');
    }
}

function closeCreateCampaignModal() {
    const modal = document.getElementById('createCampaignModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.adsSystem = new AdsSystem();
});

console.log('Sistema Pubblicità Premium caricato');