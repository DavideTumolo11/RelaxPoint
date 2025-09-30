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
// GESTIONE MODALE CREAZIONE CAMPAGNA
// ===============================================

function openCreateCampaignModal() {
    const modal = document.getElementById('createCampaignModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCreateCampaignModal() {
    const modal = document.getElementById('createCampaignModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    // Reset form
    const form = document.querySelector('#createCampaignModal form');
    if (form) form.reset();
    // Reset to first step
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });
    const stepBackBtn = document.getElementById('stepBackBtn');
    const stepNextBtn = document.getElementById('stepNextBtn');
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    if (stepBackBtn) stepBackBtn.style.display = 'none';
    if (stepNextBtn) stepNextBtn.style.display = 'inline-block';
    if (createCampaignBtn) createCampaignBtn.style.display = 'none';
}

function nextStep() {
    const currentStep = document.querySelector('.form-step.active');
    if (!currentStep) return;

    const currentStepNum = parseInt(currentStep.id.replace('step', ''));
    const nextStepNum = currentStepNum + 1;
    const nextStep = document.getElementById(`step${nextStepNum}`);

    if (nextStep) {
        currentStep.classList.remove('active');
        nextStep.classList.add('active');

        // Update buttons
        const stepBackBtn = document.getElementById('stepBackBtn');
        const stepNextBtn = document.getElementById('stepNextBtn');
        const createCampaignBtn = document.getElementById('createCampaignBtn');

        if (stepBackBtn) stepBackBtn.style.display = 'inline-block';

        if (nextStepNum === 3) {
            if (stepNextBtn) stepNextBtn.style.display = 'none';
            if (createCampaignBtn) createCampaignBtn.style.display = 'inline-block';
        }
    }
}

function previousStep() {
    const currentStep = document.querySelector('.form-step.active');
    if (!currentStep) return;

    const currentStepNum = parseInt(currentStep.id.replace('step', ''));
    const prevStepNum = currentStepNum - 1;
    const prevStep = document.getElementById(`step${prevStepNum}`);

    if (prevStep) {
        currentStep.classList.remove('active');
        prevStep.classList.add('active');

        // Update buttons
        const stepBackBtn = document.getElementById('stepBackBtn');
        const stepNextBtn = document.getElementById('stepNextBtn');
        const createCampaignBtn = document.getElementById('createCampaignBtn');

        if (prevStepNum === 1) {
            if (stepBackBtn) stepBackBtn.style.display = 'none';
        }

        if (stepNextBtn) stepNextBtn.style.display = 'inline-block';
        if (createCampaignBtn) createCampaignBtn.style.display = 'none';
    }
}

function createCampaign() {
    // Get form data
    const campaignData = {
        name: document.getElementById('campaignName')?.value || '',
        objective: document.getElementById('campaignObjective')?.value || '',
        service: document.getElementById('serviceToPromote')?.value || '',
        title: document.getElementById('adTitle')?.value || '',
        description: document.getElementById('adDescription')?.value || '',
        cta: document.getElementById('callToAction')?.value || '',
        dailyBudget: document.getElementById('dailyBudgetCampaign')?.value || '',
        duration: document.getElementById('campaignDuration')?.value || ''
    };

    console.log('Creazione campagna:', campaignData);

    // Add to campaigns array
    const newCampaign = {
        id: Date.now(),
        title: campaignData.name,
        status: 'active',
        impressions: 0,
        clicks: 0,
        conversions: 0,
        budget: parseFloat(campaignData.dailyBudget) * parseInt(campaignData.duration) || 0,
        spent: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + parseInt(campaignData.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'sponsored',
        target: 'local'
    };

    campaignsData.unshift(newCampaign);
    updateStats();
    renderCampaigns(getFilteredCampaigns());

    // Show success message
    showNotification('Campagna creata con successo! La revisione richiederà 2-4 ore.', 'success', 5000);

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
window.createCampaign = createCampaign;

console.log('Pubblicità Premium script caricato');