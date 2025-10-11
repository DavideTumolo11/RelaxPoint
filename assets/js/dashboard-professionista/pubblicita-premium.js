/**
 * Pubblicità Premium - Dashboard Professionista
 * JavaScript per la gestione delle campagne pubblicitarie premium
 */

// ===============================================
// STATO DELL'APPLICAZIONE
// ===============================================

let campaignsData = [];
let currentFilter = 'all';
let isLoading = false;

// ===============================================
// DATI DEMO INIZIALI
// ===============================================

const initialCampaignsData = [
    {
        id: 1,
        title: 'Promozione Primavera 2024',
        status: 'active',
        impressions: 15420,
        clicks: 892,
        conversions: 45,
        budget: 500,
        spent: 387,
        startDate: '2024-03-01',
        endDate: '2024-04-30',
        type: 'sponsored',
        target: 'local'
    },
    {
        id: 2,
        title: 'Offerta Weekend Wellness',
        status: 'active',
        impressions: 8750,
        clicks: 421,
        conversions: 28,
        budget: 300,
        spent: 245,
        startDate: '2024-03-15',
        endDate: '2024-04-15',
        type: 'banner',
        target: 'regional'
    },
    {
        id: 3,
        title: 'Last Minute Spa',
        status: 'paused',
        impressions: 12300,
        clicks: 567,
        conversions: 32,
        budget: 400,
        spent: 289,
        startDate: '2024-02-01',
        endDate: '2024-03-31',
        type: 'featured',
        target: 'national'
    },
    {
        id: 4,
        title: 'Trattamenti Anti-Age',
        status: 'completed',
        impressions: 22100,
        clicks: 1245,
        conversions: 67,
        budget: 700,
        spent: 700,
        startDate: '2024-01-15',
        endDate: '2024-02-28',
        type: 'sponsored',
        target: 'local'
    }
];

// ===============================================
// INIZIALIZZAZIONE
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Pubblicità Premium - Inizializzazione...');
    initializePubblicitaPremium();
});

function initializePubblicitaPremium() {
    try {
        setupEventListeners();
        loadCampaignsData();
        updateDashboardTitle();

        console.log('Pubblicità Premium - Inizializzato con successo');
    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
        showNotification('Errore durante il caricamento della pagina', 'error');
    }
}

function updateDashboardTitle() {
    const userDetailsTitle = document.querySelector('.user-details h1');
    if (userDetailsTitle) {
        userDetailsTitle.textContent = 'Sistema Pubblicità Premium';
    }

    const userStatus = document.querySelector('.user-status .status-badge');
    if (userStatus) {
        userStatus.textContent = 'Gestisci le tue campagne';
    }
}

// ===============================================
// GESTIONE EVENTI
// ===============================================

function setupEventListeners() {
    // Filter select
    const filterSelect = document.getElementById('campaignFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            currentFilter = e.target.value;
            filterCampaigns(currentFilter);
        });
    }

    // Create campaign button
    const createBtn = document.querySelector('[onclick*="createNewCampaign"]');
    if (createBtn) {
        createBtn.addEventListener('click', createNewCampaign);
    }

    console.log('Event listeners configurati');
}

// ===============================================
// CARICAMENTO E GESTIONE DATI
// ===============================================

function loadCampaignsData() {
    if (isLoading) return;

    isLoading = true;
    showLoadingState();

    // Simula il caricamento dei dati
    setTimeout(() => {
        try {
            campaignsData = [...initialCampaignsData];
            updateStats();
            renderCampaigns(getFilteredCampaigns());
            isLoading = false;

            showNotification('Campagne caricate con successo!', 'success');
        } catch (error) {
            console.error('Errore durante il caricamento:', error);
            showNotification('Errore durante il caricamento delle campagne', 'error');
            isLoading = false;
            showErrorState();
        }
    }, 1000);
}

function getFilteredCampaigns() {
    if (currentFilter === 'all') {
        return campaignsData;
    }
    return campaignsData.filter(campaign => campaign.status === currentFilter);
}

function filterCampaigns(filter) {
    const filteredCampaigns = getFilteredCampaigns();
    renderCampaigns(filteredCampaigns);

    const filterLabel = getFilterLabel(filter);
    showNotification(`Filtro applicato: ${filterLabel}`, 'info');
}

function getFilterLabel(filter) {
    const labels = {
        'all': 'Tutte le Campagne',
        'active': 'Campagne Attive',
        'paused': 'In Pausa',
        'completed': 'Completate'
    };
    return labels[filter] || filter;
}

// ===============================================
// RENDERING COMPONENTI
// ===============================================

function updateStats() {
    const totalCampaigns = campaignsData.length;
    const activeCampaigns = campaignsData.filter(c => c.status === 'active').length;
    const totalImpressions = campaignsData.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaignsData.reduce((sum, c) => sum + c.clicks, 0);
    const totalSpent = campaignsData.reduce((sum, c) => sum + c.spent, 0);

    // Update stats cards
    const totalCampaignsEl = document.querySelector('.stat-card.campaigns h3');
    if (totalCampaignsEl) totalCampaignsEl.textContent = totalCampaigns;

    const activeCampaignsEl = document.querySelectorAll('.stat-card h3')[1];
    if (activeCampaignsEl) activeCampaignsEl.textContent = activeCampaigns;

    const impressionsEl = document.querySelectorAll('.stat-card h3')[2];
    if (impressionsEl) impressionsEl.textContent = formatNumber(totalImpressions);

    const clicksEl = document.querySelectorAll('.stat-card h3')[3];
    if (clicksEl) clicksEl.textContent = formatNumber(totalClicks);
}

function renderCampaigns(campaigns) {
    const list = document.getElementById('campaignsList');
    if (!list) return;

    if (campaigns.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                <h3>Nessuna campagna trovata</h3>
                <p>Non ci sono campagne per il filtro selezionato.<br>Inizia creando la tua prima campagna pubblicitaria!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = campaigns.map((campaign, index) => {
        const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : 0;
        const budgetUsed = campaign.budget > 0 ? ((campaign.spent / campaign.budget) * 100).toFixed(0) : 0;

        return `
            <div class="campaign-card ${campaign.status}"
                 onclick="PubblicitaPremium.viewCampaign(${campaign.id})"
                 style="animation-delay: ${index * 0.1}s"
                 tabindex="0"
                 role="button"
                 aria-label="Visualizza campagna: ${campaign.title}">
                <div class="campaign-header">
                    <div class="campaign-title-section">
                        <h4>${campaign.title}</h4>
                        <span class="campaign-status ${campaign.status}">${getStatusLabel(campaign.status)}</span>
                    </div>
                    <div class="campaign-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); PubblicitaPremium.editCampaign(${campaign.id})" title="Modifica">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); PubblicitaPremium.pauseCampaign(${campaign.id})" title="${campaign.status === 'paused' ? 'Riprendi' : 'Pausa'}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="${campaign.status === 'paused' ? 'M8 5v14l11-7z' : 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'}"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="campaign-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Impressioni</span>
                        <span class="stat-value">${formatNumber(campaign.impressions)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Click</span>
                        <span class="stat-value">${formatNumber(campaign.clicks)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">CTR</span>
                        <span class="stat-value">${ctr}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Conversioni</span>
                        <span class="stat-value">${campaign.conversions}</span>
                    </div>
                </div>

                <div class="campaign-budget">
                    <div class="budget-info">
                        <span>Budget: €${campaign.spent} / €${campaign.budget}</span>
                        <span>${budgetUsed}%</span>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-progress" style="width: ${budgetUsed}%"></div>
                    </div>
                </div>

                <div class="campaign-dates">
                    <span>${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}</span>
                    <span class="campaign-type">${getCampaignTypeLabel(campaign.type)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ===============================================
// FUNZIONI PRINCIPALI PUBBLICITÀ
// ===============================================

const PubblicitaPremium = {
    createNewCampaign() {
        console.log('Creazione nuova campagna...');
        showNotification('Apertura form per nuova campagna...', 'info');

        setTimeout(() => {
            showNotification('Form campagna aperto! 📢', 'success');
            // Qui si aprirebbe un modal o form per creare la campagna
        }, 1200);
    },

    viewCampaign(campaignId) {
        const campaign = campaignsData.find(c => c.id === campaignId);
        if (campaign) {
            console.log('Visualizzazione campagna:', campaign);
            showNotification(`Apertura dettagli "${campaign.title}"`, 'info');

            setTimeout(() => {
                showNotification('Dettagli campagna caricati! 📊', 'success');
                // Qui si aprirebbero i dettagli della campagna
            }, 600);
        } else {
            showNotification('Campagna non trovata!', 'error');
        }
    },

    editCampaign(campaignId) {
        const campaign = campaignsData.find(c => c.id === campaignId);
        if (campaign) {
            console.log('Modifica campagna:', campaign);
            showNotification(`Apertura editor per "${campaign.title}"`, 'info');

            setTimeout(() => {
                showNotification('Editor campagna aperto! ✏️', 'success');
                // Qui si aprirebbe l'editor per modificare la campagna
            }, 600);
        } else {
            showNotification('Campagna non trovata!', 'error');
        }
    },

    pauseCampaign(campaignId) {
        const campaign = campaignsData.find(c => c.id === campaignId);
        if (!campaign) {
            showNotification('Campagna non trovata!', 'error');
            return;
        }

        if (campaign.status === 'paused') {
            campaign.status = 'active';
            showNotification(`Campagna "${campaign.title}" riattivata!`, 'success');
        } else if (campaign.status === 'active') {
            campaign.status = 'paused';
            showNotification(`Campagna "${campaign.title}" messa in pausa!`, 'info');
        }

        updateStats();
        renderCampaigns(getFilteredCampaigns());
    },

    deleteCampaign(campaignId) {
        const campaign = campaignsData.find(c => c.id === campaignId);
        if (!campaign) {
            showNotification('Campagna non trovata!', 'error');
            return;
        }

        if (confirm(`Sei sicuro di voler eliminare la campagna "${campaign.title}"?`)) {
            campaignsData = campaignsData.filter(c => c.id !== campaignId);
            updateStats();
            renderCampaigns(getFilteredCampaigns());
            showNotification('Campagna eliminata con successo!', 'success');
        }
    },

    duplicateCampaign(campaignId) {
        const campaign = campaignsData.find(c => c.id === campaignId);
        if (!campaign) {
            showNotification('Campagna non trovata!', 'error');
            return;
        }

        const newCampaign = {
            ...campaign,
            id: Date.now(),
            title: `${campaign.title} (Copia)`,
            status: 'paused',
            impressions: 0,
            clicks: 0,
            conversions: 0,
            spent: 0,
            startDate: new Date().toISOString().split('T')[0]
        };

        campaignsData.unshift(newCampaign);
        updateStats();
        renderCampaigns(getFilteredCampaigns());
        showNotification('Campagna duplicata con successo!', 'success');
    }
};

// ===============================================
// STATI SPECIALI
// ===============================================

function showLoadingState() {
    const list = document.getElementById('campaignsList');
    if (list) {
        list.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Caricamento campagne...</p>
            </div>
        `;
    }
}

function showErrorState() {
    const list = document.getElementById('campaignsList');
    if (list) {
        list.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3>Errore nel caricamento</h3>
                <p>Si è verificato un errore durante il caricamento delle campagne.<br>
                <button class="btn-primary" onclick="loadCampaignsData()" style="margin-top: 16px;">
                    Riprova
                </button></p>
            </div>
        `;
    }
}

// ===============================================
// SISTEMA NOTIFICHE
// ===============================================

function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getStatusLabel(status) {
    const labels = {
        'active': 'Attiva',
        'paused': 'In Pausa',
        'completed': 'Completata',
        'draft': 'Bozza'
    };
    return labels[status] || status;
}

function getCampaignTypeLabel(type) {
    const labels = {
        'sponsored': 'Sponsorizzata',
        'banner': 'Banner',
        'featured': 'In Evidenza',
        'story': 'Story Ads'
    };
    return labels[type] || type;
}

// ===============================================
// FUNZIONI HELPER PER CREAZIONE CAMPAGNA
// ===============================================

function createNewCampaign() {
    PubblicitaPremium.createNewCampaign();
}

function viewAnalytics() {
    showNotification('Caricamento analytics dettagliate...', 'info');
    setTimeout(() => {
        showNotification('Analytics caricate! 📈', 'success');
    }, 1000);
}

function optimizeCampaigns() {
    showNotification('Analisi e ottimizzazione in corso...', 'info');
    setTimeout(() => {
        showNotification('Suggerimenti di ottimizzazione disponibili! 💡', 'success');
    }, 1500);
}

// ===============================================
// ESPOSIZIONE GLOBALE
// ===============================================

// Rende le funzioni disponibili globalmente per gli event handler inline
window.PubblicitaPremium = PubblicitaPremium;
window.loadCampaignsData = loadCampaignsData;
window.filterCampaigns = filterCampaigns;
window.createNewCampaign = createNewCampaign;
window.viewAnalytics = viewAnalytics;
window.optimizeCampaigns = optimizeCampaigns;

// Debug helpers (solo in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugPubblicitaPremium = {
        campaignsData: () => campaignsData,
        currentFilter: () => currentFilter,
        reloadData: loadCampaignsData,
        showTestNotification: () => showNotification('Test notification', 'info'),
        addTestCampaign: () => {
            const testCampaign = {
                id: Date.now(),
                title: 'Test Campaign',
                status: 'active',
                impressions: Math.floor(Math.random() * 10000),
                clicks: Math.floor(Math.random() * 500),
                conversions: Math.floor(Math.random() * 50),
                budget: 500,
                spent: Math.floor(Math.random() * 500),
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
                type: 'sponsored',
                target: 'local'
            };
            campaignsData.unshift(testCampaign);
            updateStats();
            renderCampaigns(getFilteredCampaigns());
            showNotification('Test campaign aggiunta!', 'success');
        }
    };

    console.log('Debug helpers available at window.debugPubblicitaPremium');
}

// ===============================================
// GESTIONE WIZARD CREAZIONE CAMPAGNA - 4 STEP
// ===============================================

// Wizard state
const wizardState = {
    currentStep: 1,
    placement: null,
    contentType: null,
    uploadMethod: null,
    uploadedFile: null,
    graphicServiceData: null
};

// Placement data with pricing and restrictions
const placementData = {
    'homepage-hero': {
        name: 'Homepage Hero',
        price: 150,
        format: '1200x400px',
        contentTypes: ['all'],
        description: 'Massima visibilità in homepage'
    },
    'homepage-banner': {
        name: 'Homepage Banner',
        price: 100,
        format: '1000x300px',
        contentTypes: ['professionista', 'servizio'],
        description: 'Banner centrale homepage'
    },
    'ispirazioni-lateral': {
        name: 'Ispirazioni Lateral',
        price: 80,
        format: '400x500px',
        contentTypes: ['foto', 'offerta'],
        description: 'Ads laterali ispirazioni'
    },
    'services-hero': {
        name: 'Servizi Hero',
        price: 70,
        format: '1000x350px',
        contentTypes: ['categoria-specifica'],
        description: 'Hero pagine servizi',
        requiresCategory: true
    },
    'services-banner': {
        name: 'Servizi Banner',
        price: 90,
        format: '900x280px',
        contentTypes: ['professionista', 'servizio'],
        description: 'Banner pagine servizi',
        requiresCategory: true
    },
    'services-lateral': {
        name: 'Servizi Lateral',
        price: 50,
        format: '200x300px',
        contentTypes: ['all'],
        description: 'Ads laterali servizi',
        requiresCategory: true
    }
};

// Content types
const contentTypes = {
    'all': {
        'professionista': { label: 'Promuovi te stesso o la tua attività', description: 'Presenta la tua professionalità' },
        'servizio': { label: 'Servizio/Trattamento', description: 'Promuovi un servizio specifico' },
        'foto': { label: 'Foto', description: 'Contenuto fotografico professionale' },
        'offerta': { label: 'Offerta', description: 'Locandine con promozioni e sconti' }
    },
    'professionista-servizio': {
        'professionista': { label: 'Promuovi te stesso o la tua attività', description: 'Presenta la tua professionalità' },
        'servizio': { label: 'Servizio/Trattamento', description: 'Promuovi un servizio specifico' }
    },
    'foto-offerta': {
        'foto': { label: 'Foto', description: 'Contenuto fotografico professionale' },
        'offerta': { label: 'Offerta', description: 'Locandine con promozioni e sconti' }
    },
    'categoria-specifica': {
        'servizio-categoria': { label: 'Servizio di Categoria', description: 'Servizio specifico della categoria' }
    }
};

function openCreateCampaignModal() {
    const modal = document.getElementById('createCampaignModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetWizard();
    }
}

function closeCreateCampaignModal() {
    const modal = document.getElementById('createCampaignModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetWizard();
    }
}

function resetWizard() {
    wizardState.currentStep = 1;
    wizardState.placement = null;
    wizardState.contentType = null;
    wizardState.uploadMethod = null;
    wizardState.uploadedFile = null;
    wizardState.graphicServiceData = null;

    // Reset form
    const form = document.getElementById('createCampaignForm');
    if (form) form.reset();

    // Reset steps
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });

    // Reset progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) step.classList.add('active');
    });

    // Reset buttons
    updateWizardButtons();
}

function updateWizardButtons() {
    const stepBackBtn = document.getElementById('stepBackBtn');
    const stepNextBtn = document.getElementById('stepNextBtn');
    const createCampaignBtn = document.getElementById('createCampaignBtn');

    if (stepBackBtn) {
        stepBackBtn.style.display = wizardState.currentStep > 1 ? 'inline-block' : 'none';
    }

    if (stepNextBtn && createCampaignBtn) {
        if (wizardState.currentStep < 4) {
            stepNextBtn.style.display = 'inline-block';
            createCampaignBtn.style.display = 'none';
        } else {
            stepNextBtn.style.display = 'none';
            createCampaignBtn.style.display = 'inline-block';
        }
    }
}

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < wizardState.currentStep) {
            step.classList.add('completed');
        } else if (stepNum === wizardState.currentStep) {
            step.classList.add('active');
        }
    });
}

// STEP 1: Select Placement
function selectPlacement(placementId) {
    wizardState.placement = placementId;

    // Update UI
    document.querySelectorAll('.placement-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-placement="${placementId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    document.getElementById('selectedPlacement').value = placementId;
}

// STEP 2: Select Content Type
function nextStep() {
    const currentStepEl = document.querySelector('.form-step.active');
    if (!currentStepEl) return;

    // Validate current step
    if (!validateCurrentStep()) {
        return;
    }

    // Move to next step
    wizardState.currentStep++;

    // Hide current step
    currentStepEl.classList.remove('active');

    // Show next step
    const nextStepEl = document.getElementById(`step${wizardState.currentStep}`);
    if (nextStepEl) {
        nextStepEl.classList.add('active');
    }

    // Populate step content if needed
    if (wizardState.currentStep === 2) {
        populateContentTypes();
    } else if (wizardState.currentStep === 3) {
        populateUploadRequirements();
    } else if (wizardState.currentStep === 4) {
        populateCampaignSummary();
        calculateBudget();
    }

    updateProgressBar();
    updateWizardButtons();

    // Scroll to top of modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
}

function previousStep() {
    if (wizardState.currentStep <= 1) return;

    const currentStepEl = document.querySelector('.form-step.active');

    // Move to previous step
    wizardState.currentStep--;

    // Hide current step
    if (currentStepEl) currentStepEl.classList.remove('active');

    // Show previous step
    const prevStepEl = document.getElementById(`step${wizardState.currentStep}`);
    if (prevStepEl) {
        prevStepEl.classList.add('active');
    }

    updateProgressBar();
    updateWizardButtons();

    // Scroll to top of modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
}

function validateCurrentStep() {
    switch (wizardState.currentStep) {
        case 1:
            if (!wizardState.placement) {
                showNotification('Seleziona un posizionamento per continuare', 'error');
                return false;
            }
            return true;

        case 2:
            if (!wizardState.contentType) {
                showNotification('Seleziona un tipo di contenuto per continuare', 'error');
                return false;
            }
            return true;

        case 3:
            if (!wizardState.uploadMethod) {
                showNotification('Scegli un metodo di caricamento per continuare', 'error');
                return false;
            }

            if (wizardState.uploadMethod === 'upload' && !wizardState.uploadedFile) {
                showNotification('Carica un file per continuare', 'error');
                return false;
            }

            if (wizardState.uploadMethod === 'service') {
                const brief = document.getElementById('graphicBrief')?.value;
                if (!brief || brief.trim() === '') {
                    showNotification('Descrivi il contenuto che desideri per continuare', 'error');
                    return false;
                }
            }
            return true;

        default:
            return true;
    }
}

function populateContentTypes() {
    const placement = placementData[wizardState.placement];
    if (!placement) return;

    const grid = document.getElementById('contentTypeGrid');
    const infoEl = document.getElementById('placementRestrictionInfo');

    let contentTypesSet;
    if (placement.contentTypes.includes('all')) {
        contentTypesSet = contentTypes.all;
        infoEl.textContent = 'Questo posizionamento accetta qualsiasi tipo di contenuto.';
    } else if (placement.contentTypes.includes('professionista') || placement.contentTypes.includes('servizio')) {
        contentTypesSet = contentTypes['professionista-servizio'];
        infoEl.textContent = 'Promuovi te stesso come professionista o un servizio/trattamento specifico.';
    } else if (placement.contentTypes.includes('foto') || placement.contentTypes.includes('offerta')) {
        contentTypesSet = contentTypes['foto-offerta'];
        infoEl.textContent = 'Contenuti fotografici professionali o locandine con offerte e promozioni.';
    } else if (placement.contentTypes.includes('categoria-specifica')) {
        contentTypesSet = contentTypes['categoria-specifica'];
        infoEl.textContent = 'Solo servizi della categoria specifica selezionata possono essere promossi.';
    }

    grid.innerHTML = Object.entries(contentTypesSet).map(([key, data]) => `
        <div class="content-type-card" data-content-type="${key}" onclick="selectContentType('${key}')">
            <h5>${data.label}</h5>
            <p>${data.description}</p>
        </div>
    `).join('');
}

function selectContentType(contentType) {
    wizardState.contentType = contentType;

    // Update UI
    document.querySelectorAll('.content-type-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-content-type="${contentType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    document.getElementById('selectedContentType').value = contentType;
}

function populateUploadRequirements() {
    const placement = placementData[wizardState.placement];
    if (!placement) return;

    const requirementsEl = document.getElementById('formatRequirements');
    const uploadFormatInfo = document.getElementById('uploadFormatInfo');

    const formatInfo = `
        <strong>Requisiti:</strong>
        <ul>
            <li>Dimensioni: ${placement.format}</li>
            <li>Formato: JPG, PNG</li>
            <li>Dimensione max: 2MB</li>
            <li>Risoluzione: 72-150 DPI</li>
        </ul>
    `;

    requirementsEl.innerHTML = formatInfo;
    uploadFormatInfo.textContent = `${placement.format} - JPG, PNG max 2MB`;
}

function selectUploadOption(method) {
    wizardState.uploadMethod = method;

    // Update UI
    document.querySelectorAll('.upload-option').forEach(option => {
        option.classList.remove('selected');
    });

    if (method === 'upload') {
        document.getElementById('uploadOptionCard').classList.add('selected');
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('graphicServiceForm').style.display = 'none';
        setupFileUpload();
    } else {
        document.getElementById('graphicServiceCard').classList.add('selected');
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('graphicServiceForm').style.display = 'block';
    }

    document.getElementById('uploadMethod').value = method;
}

function setupFileUpload() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('adFileInput');

    if (!dropzone || !fileInput) return;

    // Click to upload
    dropzone.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Drag and drop
    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
}

function handleFileUpload(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Carica solo file immagine (JPG, PNG)', 'error');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showNotification('File troppo grande. Dimensione massima: 2MB', 'error');
        return;
    }

    wizardState.uploadedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('uploadDropzone').style.display = 'none';
        document.getElementById('uploadPreview').style.display = 'block';
        document.getElementById('previewImage').src = e.target.result;
    };
    reader.readAsDataURL(file);

    showNotification('File caricato con successo!', 'success');
}

function removeUpload() {
    wizardState.uploadedFile = null;
    document.getElementById('uploadDropzone').style.display = 'block';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('previewImage').src = '';
    document.getElementById('adFileInput').value = '';
}

function calculateBudget() {
    const placement = placementData[wizardState.placement];
    if (!placement) return;

    const startDate = document.getElementById('campaignStartDate')?.value;
    const endDate = document.getElementById('campaignEndDate')?.value;

    let days = 30; // default
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    const dailyPrice = placement.price;
    let totalBudget = dailyPrice * days;

    // Add graphic service cost if selected
    if (wizardState.uploadMethod === 'service') {
        totalBudget += 20;
    }

    document.getElementById('totalBudget').value = totalBudget;

    // Update breakdown
    const breakdownEl = document.getElementById('budgetBreakdown');
    let breakdownHTML = `
        <div class="breakdown-item">
            <span>Costo giornaliero:</span>
            <span>€${dailyPrice}</span>
        </div>
        <div class="breakdown-item">
            <span>Durata:</span>
            <span>${days} giorni</span>
        </div>
        <div class="breakdown-item">
            <span>Costo pubblicità:</span>
            <span>€${dailyPrice * days}</span>
        </div>
    `;

    if (wizardState.uploadMethod === 'service') {
        breakdownHTML += `
            <div class="breakdown-item">
                <span>Servizio grafico:</span>
                <span>€20</span>
            </div>
        `;
    }

    breakdownHTML += `
        <div class="breakdown-item" style="border-top: 2px solid #dee2e6; margin-top: 0.5rem; padding-top: 0.5rem; font-weight: 700;">
            <span>Totale:</span>
            <span>€${totalBudget}</span>
        </div>
    `;

    breakdownEl.innerHTML = breakdownHTML;
}

function populateCampaignSummary() {
    const placement = placementData[wizardState.placement];
    if (!placement) return;

    const summaryGrid = document.getElementById('campaignSummary');

    // Show category selection if required
    if (placement.requiresCategory) {
        document.getElementById('categorySelectionGroup').style.display = 'block';
    }

    let summaryHTML = `
        <div class="summary-item">
            <div class="summary-label">Posizionamento</div>
            <div class="summary-value">${placement.name}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Formato</div>
            <div class="summary-value">${placement.format}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Tipo Contenuto</div>
            <div class="summary-value">${getContentTypeLabel()}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Metodo Upload</div>
            <div class="summary-value">${wizardState.uploadMethod === 'upload' ? 'Caricamento diretto' : 'Servizio grafico (+€20)'}</div>
        </div>
    `;

    summaryGrid.innerHTML = summaryHTML;

    // Add event listeners for date change to recalculate budget
    const startDateInput = document.getElementById('campaignStartDate');
    const endDateInput = document.getElementById('campaignEndDate');

    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', calculateBudget);
        endDateInput.addEventListener('change', calculateBudget);
    }
}

function getContentTypeLabel() {
    const allContentTypes = { ...contentTypes.all, ...contentTypes['professionista-servizio'], ...contentTypes['foto-offerta'], ...contentTypes['categoria-specifica'] };
    const contentType = allContentTypes[wizardState.contentType];
    return contentType ? contentType.label : wizardState.contentType;
}

function submitCampaign() {
    // Validate final step
    const title = document.getElementById('campaignTitle')?.value;
    const link = document.getElementById('campaignLink')?.value;
    const startDate = document.getElementById('campaignStartDate')?.value;
    const endDate = document.getElementById('campaignEndDate')?.value;

    if (!title || !link || !startDate || !endDate) {
        showNotification('Compila tutti i campi obbligatori', 'error');
        return;
    }

    const placement = placementData[wizardState.placement];
    if (placement.requiresCategory) {
        const category = document.getElementById('serviceCategory')?.value;
        if (!category) {
            showNotification('Seleziona una categoria servizio', 'error');
            return;
        }
    }

    // Collect campaign data
    const campaignData = {
        placement: wizardState.placement,
        contentType: wizardState.contentType,
        uploadMethod: wizardState.uploadMethod,
        title: title,
        description: document.getElementById('campaignDescription')?.value || '',
        link: link,
        startDate: startDate,
        endDate: endDate,
        budget: parseFloat(document.getElementById('totalBudget')?.value) || 0,
        category: document.getElementById('serviceCategory')?.value || null
    };

    if (wizardState.uploadMethod === 'service') {
        campaignData.graphicService = {
            brief: document.getElementById('graphicBrief')?.value || '',
            text: document.getElementById('graphicText')?.value || '',
            colors: document.getElementById('graphicColors')?.value || ''
        };
    }

    console.log('Invio campagna:', campaignData);

    // Create new campaign
    const newCampaign = {
        id: Date.now(),
        title: campaignData.title,
        status: 'pending', // Pending approval
        impressions: 0,
        clicks: 0,
        conversions: 0,
        budget: campaignData.budget,
        spent: 0,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        type: 'sponsored',
        target: 'local',
        placement: campaignData.placement
    };

    campaignsData.unshift(newCampaign);
    updateStats();
    renderCampaigns(getFilteredCampaigns());

    // Show success message
    showNotification('Richiesta inviata! Il team admin la revisionerà entro 24-48h. Riceverai una notifica quando sarà approvata.', 'success', 5000);

    closeCreateCampaignModal();
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('createCampaignModal');
    if (event.target === modal) {
        closeCreateCampaignModal();
    }
});

// ===============================================
// ESPOSIZIONE GLOBALE FUNZIONI MODALE
// ===============================================

window.openCreateCampaignModal = openCreateCampaignModal;
window.closeCreateCampaignModal = closeCreateCampaignModal;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.selectPlacement = selectPlacement;
window.selectContentType = selectContentType;
window.selectUploadOption = selectUploadOption;
window.removeUpload = removeUpload;
window.submitCampaign = submitCampaign;

console.log('Pubblicità Premium script caricato');