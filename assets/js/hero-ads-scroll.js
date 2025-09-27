// ===============================================
// STORIES PREMIUM - SISTEMA STORIE AVANZATO
// ===============================================

class StoriesPremium {
    constructor() {
        this.stories = [];
        this.templates = [];
        this.currentStep = 1;
        this.maxSteps = 3;
        this.selectedTemplate = null;
        this.currentStory = {};
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.renderStories();
        this.loadTemplatesLibrary();
        console.log('Sistema Stories Premium inizializzato');
    }

    loadSampleData() {
        // Sample stories data
        this.stories = [
            {
                id: 1,
                title: 'Massaggio Rilassante Autunnale',
                subtitle: 'Lasciati coccolare dai nostri trattamenti',
                template: 'wellness',
                cta: 'prenota',
                status: 'active',
                duration: 24,
                views: 847,
                engagement: 156,
                reach: 623,
                createdAt: '2024-09-20',
                scheduledAt: null,
                expiresAt: '2024-09-21'
            },
            {
                id: 2,
                title: 'Trattamento Viso Luminoso',
                subtitle: 'Rigenera la tua pelle naturalmente',
                template: 'beauty',
                cta: 'scopri',
                status: 'active',
                duration: 48,
                views: 1203,
                engagement: 234,
                reach: 891,
                createdAt: '2024-09-19',
                scheduledAt: null,
                expiresAt: '2024-09-21'
            },
            {
                id: 3,
                title: 'Massaggio Sportivo Post-Workout',
                subtitle: 'Recupera velocemente dopo l\'allenamento',
                template: 'fitness',
                cta: 'chiama',
                status: 'archived',
                duration: 24,
                views: 678,
                engagement: 98,
                reach: 445,
                createdAt: '2024-09-15',
                scheduledAt: null,
                expiresAt: '2024-09-16'
            },
            {
                id: 4,
                title: 'Esperienza Spa Esclusiva',
                subtitle: 'Lusso e benessere in un solo trattamento',
                template: 'luxury',
                cta: 'prenota',
                status: 'scheduled',
                duration: 72,
                views: 0,
                engagement: 0,
                reach: 0,
                createdAt: '2024-09-25',
                scheduledAt: '2024-09-30 10:00',
                expiresAt: null
            }
        ];

        // Sample templates data
        this.templates = [
            {
                id: 'wellness',
                name: 'Wellness & Relax',
                category: 'wellness',
                description: 'Perfetto per promuovere trattamenti rilassanti',
                colors: ['#52A373', '#82C49C', '#E8F5E8'],
                preview: 'Rilassati e rigenera'
            },
            {
                id: 'beauty',
                name: 'Beauty & Care',
                category: 'beauty',
                description: 'Ideale per trattamenti estetici',
                colors: ['#D4A574', '#F4E4BC', '#FDF8F0'],
                preview: 'Bellezza naturale'
            },
            {
                id: 'fitness',
                name: 'Sport & Fitness',
                category: 'fitness',
                description: 'Per massaggi sportivi e recupero',
                colors: ['#FF6B35', '#F7931E', '#FFF3E0'],
                preview: 'Energia e movimento'
            },
            {
                id: 'luxury',
                name: 'Luxury Spa',
                category: 'luxury',
                description: 'Per servizi premium e spa',
                colors: ['#8B4513', '#DAA520', '#FFF8DC'],
                preview: 'Esperienza esclusiva'
            },
            {
                id: 'autumn',
                name: 'Atmosfera Autunnale',
                category: 'seasonal',
                description: 'Colori caldi per la stagione autunnale',
                colors: ['#CD853F', '#DEB887', '#FFF8DC'],
                preview: 'Calore autunnale'
            },
            {
                id: 'winter',
                name: 'Relax Invernale',
                category: 'seasonal',
                description: 'Perfetto per i mesi più freddi',
                colors: ['#4682B4', '#87CEEB', '#F0F8FF'],
                preview: 'Calore nel freddo'
            }
        ];
    }

    setupEventListeners() {
        // Story creation wizard navigation
        document.querySelectorAll('input[name="publishTime"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const scheduleOptions = document.getElementById('scheduleOptions');
                if (e.target.value === 'schedule') {
                    scheduleOptions.style.display = 'block';
                } else {
                    scheduleOptions.style.display = 'none';
                }
            });
        });

        // Template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectTemplate(card.dataset.template);
            });
        });

        // Content editor inputs
        const inputs = ['storyTitle', 'storySubtitle', 'storyCta'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateStoryPreview();
                });
            }
        });

        // Stories filter
        const storiesFilter = document.getElementById('storiesFilter');
        if (storiesFilter) {
            storiesFilter.addEventListener('change', (e) => {
                this.filterStories(e.target.value);
            });
        }

        // Templates library categories
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTemplateCategory(e.target.dataset.category);
            });
        });
    }

    renderStories() {
        const storiesGrid = document.getElementById('storiesGrid');
        if (!storiesGrid) return;

        const activeStories = this.stories.filter(story => story.status !== 'archived');

        if (activeStories.length === 0) {
            storiesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <h4>Nessuna Story Attiva</h4>
                    <p>Crea la tua prima story per iniziare a coinvolgere i tuoi clienti</p>
                    <button class="btn-primary" onclick="createNewStory()">Crea Prima Story</button>
                </div>
            `;
            return;
        }

        storiesGrid.innerHTML = activeStories.map(story => `
            <div class="story-card ${story.status}" data-story-id="${story.id}">
                <div class="story-preview">
                    <div class="story-template ${story.template}">
                        <div class="story-content-preview">
                            <h4>${story.title}</h4>
                            <p>${story.subtitle}</p>
                            ${story.cta ? `<div class="cta-preview">${this.getCtaLabel(story.cta)}</div>` : ''}
                        </div>
                    </div>
                    <div class="story-status-badge ${story.status}">
                        ${this.getStatusLabel(story.status)}
                    </div>
                </div>

                <div class="story-info">
                    <div class="story-title">
                        <h5>${story.title}</h5>
                        <span class="story-template-name">${this.getTemplateName(story.template)}</span>
                    </div>

                    <div class="story-metrics">
                        <div class="metric">
                            <span class="metric-value">${story.views}</span>
                            <span class="metric-label">Views</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${story.engagement}</span>
                            <span class="metric-label">Engagement</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${story.reach}</span>
                            <span class="metric-label">Reach</span>
                        </div>
                    </div>

                    <div class="story-actions">
                        ${story.status === 'active' ?
                            `<button class="action-btn" onclick="storiesPremium.archiveStory(${story.id})">Archivia</button>` :
                            story.status === 'scheduled' ?
                            `<button class="action-btn" onclick="storiesPremium.editSchedule(${story.id})">Modifica</button>` :
                            ''
                        }
                        <button class="action-btn primary" onclick="storiesPremium.duplicateStory(${story.id})">Duplica</button>
                        <button class="action-btn secondary" onclick="storiesPremium.viewAnalytics(${story.id})">Analytics</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateStats();
    }

    selectTemplate(templateId) {
        this.selectedTemplate = templateId;

        // Update UI
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-template="${templateId}"]`).classList.add('selected');

        // Enable next button
        const nextBtn = document.getElementById('storyNextBtn');
        if (nextBtn) nextBtn.disabled = false;

        this.currentStory.template = templateId;
    }

    updateStoryPreview() {
        const title = document.getElementById('storyTitle')?.value || '';
        const subtitle = document.getElementById('storySubtitle')?.value || '';
        const cta = document.getElementById('storyCta')?.value || '';

        this.currentStory = {
            ...this.currentStory,
            title,
            subtitle,
            cta
        };

        const previewContent = document.getElementById('previewContent');
        if (previewContent && this.selectedTemplate) {
            previewContent.innerHTML = `
                <div class="story-template ${this.selectedTemplate}">
                    <div class="story-content-preview">
                        <h4>${title || 'Inserisci un titolo...'}</h4>
                        <p>${subtitle || 'Inserisci un sottotitolo...'}</p>
                        ${cta ? `<div class="cta-preview">${this.getCtaLabel(cta)}</div>` : ''}
                    </div>
                </div>
            `;
        }
    }

    nextStoryStep() {
        if (this.currentStep < this.maxSteps) {
            // Hide current step
            document.querySelector('.creation-step.active').classList.remove('active');

            this.currentStep++;

            // Show next step
            const steps = ['templateStep', 'contentStep', 'publishStep'];
            document.getElementById(steps[this.currentStep - 1]).classList.add('active');

            // Update buttons
            const backBtn = document.getElementById('storyBackBtn');
            const nextBtn = document.getElementById('storyNextBtn');
            const publishBtn = document.getElementById('storyPublishBtn');

            if (backBtn) backBtn.style.display = 'inline-block';

            if (this.currentStep === this.maxSteps) {
                if (nextBtn) nextBtn.style.display = 'none';
                if (publishBtn) publishBtn.style.display = 'inline-block';
            }

            // Initialize step content
            if (this.currentStep === 2) {
                this.updateStoryPreview();
            }
        }
    }

    previousStoryStep() {
        if (this.currentStep > 1) {
            // Hide current step
            document.querySelector('.creation-step.active').classList.remove('active');

            this.currentStep--;

            // Show previous step
            const steps = ['templateStep', 'contentStep', 'publishStep'];
            document.getElementById(steps[this.currentStep - 1]).classList.add('active');

            // Update buttons
            const backBtn = document.getElementById('storyBackBtn');
            const nextBtn = document.getElementById('storyNextBtn');
            const publishBtn = document.getElementById('storyPublishBtn');

            if (this.currentStep === 1) {
                if (backBtn) backBtn.style.display = 'none';
            }

            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (publishBtn) publishBtn.style.display = 'none';
        }
    }

    publishStory() {
        // Collect all form data
        const title = document.getElementById('storyTitle')?.value;
        const subtitle = document.getElementById('storySubtitle')?.value;
        const cta = document.getElementById('storyCta')?.value;
        const duration = document.getElementById('storyDuration')?.value;
        const publishTime = document.querySelector('input[name="publishTime"]:checked')?.value;

        // Validation
        if (!title || !subtitle || !this.selectedTemplate) {
            this.showNotification('Completa tutti i campi obbligatori', 'error');
            return;
        }

        // Create new story
        const newStory = {
            id: Date.now(),
            title,
            subtitle,
            template: this.selectedTemplate,
            cta: cta || null,
            duration: parseInt(duration) || 24,
            status: publishTime === 'schedule' ? 'scheduled' : 'active',
            views: 0,
            engagement: 0,
            reach: 0,
            createdAt: new Date().toISOString().split('T')[0],
            scheduledAt: publishTime === 'schedule' ?
                `${document.getElementById('scheduleDate')?.value} ${document.getElementById('scheduleTime')?.value}` :
                null,
            expiresAt: publishTime === 'now' ?
                new Date(Date.now() + (parseInt(duration) * 60 * 60 * 1000)).toISOString().split('T')[0] :
                null
        };

        // Add to stories array
        this.stories.unshift(newStory);

        // Close modal and refresh
        this.closeCreateStoryModal();
        this.renderStories();

        const message = publishTime === 'schedule' ?
            'Story programmata con successo!' :
            'Story pubblicata con successo!';
        this.showNotification(message, 'success');
    }

    filterStories(filter) {
        let filteredStories = [];

        switch(filter) {
            case 'active':
                filteredStories = this.stories.filter(story => story.status === 'active');
                break;
            case 'archived':
                filteredStories = this.stories.filter(story => story.status === 'archived');
                break;
            case 'scheduled':
                filteredStories = this.stories.filter(story => story.status === 'scheduled');
                break;
            default:
                filteredStories = this.stories;
                break;
        }

        const storiesGrid = document.getElementById('storiesGrid');
        if (!storiesGrid) return;

        if (filteredStories.length === 0) {
            storiesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <h4>Nessuna Story Trovata</h4>
                    <p>Non ci sono stories per il filtro selezionato</p>
                </div>
            `;
            return;
        }

        storiesGrid.innerHTML = filteredStories.map(story => `
            <div class="story-card ${story.status}" data-story-id="${story.id}">
                <div class="story-preview">
                    <div class="story-template ${story.template}">
                        <div class="story-content-preview">
                            <h4>${story.title}</h4>
                            <p>${story.subtitle}</p>
                            ${story.cta ? `<div class="cta-preview">${this.getCtaLabel(story.cta)}</div>` : ''}
                        </div>
                    </div>
                    <div class="story-status-badge ${story.status}">
                        ${this.getStatusLabel(story.status)}
                    </div>
                </div>

                <div class="story-info">
                    <div class="story-title">
                        <h5>${story.title}</h5>
                        <span class="story-template-name">${this.getTemplateName(story.template)}</span>
                    </div>

                    <div class="story-metrics">
                        <div class="metric">
                            <span class="metric-value">${story.views}</span>
                            <span class="metric-label">Views</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${story.engagement}</span>
                            <span class="metric-label">Engagement</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${story.reach}</span>
                            <span class="metric-label">Reach</span>
                        </div>
                    </div>

                    <div class="story-actions">
                        ${story.status === 'active' ?
                            `<button class="action-btn" onclick="storiesPremium.archiveStory(${story.id})">Archivia</button>` :
                            story.status === 'scheduled' ?
                            `<button class="action-btn" onclick="storiesPremium.editSchedule(${story.id})">Modifica</button>` :
                            ''
                        }
                        <button class="action-btn primary" onclick="storiesPremium.duplicateStory(${story.id})">Duplica</button>
                        <button class="action-btn secondary" onclick="storiesPremium.viewAnalytics(${story.id})">Analytics</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadTemplatesLibrary() {
        const templatesShowcase = document.getElementById('templatesShowcase');
        if (!templatesShowcase) return;

        templatesShowcase.innerHTML = this.templates.map(template => `
            <div class="template-showcase-card" data-template="${template.id}" data-category="${template.category}">
                <div class="template-showcase-preview">
                    <div class="template-bg ${template.id}">
                        <div class="template-content">
                            <h3>${template.name}</h3>
                            <p>${template.preview}</p>
                        </div>
                    </div>
                </div>
                <div class="template-showcase-info">
                    <h5>${template.name}</h5>
                    <p>${template.description}</p>
                    <button class="btn-use-template" onclick="storiesPremium.useTemplate('${template.id}')">
                        Usa Template
                    </button>
                </div>
            </div>
        `).join('');
    }

    switchTemplateCategory(category) {
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter templates
        const showcaseCards = document.querySelectorAll('.template-showcase-card');
        showcaseCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    useTemplate(templateId) {
        this.selectTemplate(templateId);
        this.closeTemplatesLibraryModal();
        this.createNewStory();
    }

    updateStats() {
        const totalStories = this.stories.length;
        const totalViews = this.stories.reduce((sum, story) => sum + story.views, 0);
        const totalEngagement = this.stories.reduce((sum, story) => sum + story.engagement, 0);
        const totalReach = this.stories.reduce((sum, story) => sum + story.reach, 0);

        const elements = {
            'totalStories': totalStories,
            'totalViews': this.formatNumber(totalViews),
            'totalEngagement': totalEngagement,
            'totalReach': this.formatNumber(totalReach)
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    // Story Actions
    archiveStory(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (story) {
            story.status = 'archived';
            this.renderStories();
            this.showNotification(`Story "${story.title}" archiviata`, 'info');
        }
    }

    duplicateStory(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (story) {
            const duplicatedStory = {
                ...story,
                id: Date.now(),
                title: story.title + ' (Copia)',
                status: 'active',
                views: 0,
                engagement: 0,
                reach: 0,
                createdAt: new Date().toISOString().split('T')[0]
            };
            this.stories.unshift(duplicatedStory);
            this.renderStories();
            this.showNotification('Story duplicata con successo', 'success');
        }
    }

    viewAnalytics(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (story) {
            this.showNotification(`Analytics per "${story.title}" - Feature in sviluppo`, 'info');
        }
    }

    editSchedule(storyId) {
        this.showNotification('Modifica programmazione - Feature in sviluppo', 'info');
    }

    // Modal Management
    closeCreateStoryModal() {
        const modal = document.getElementById('createStoryModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Reset wizard
        this.currentStep = 1;
        this.selectedTemplate = null;
        this.currentStory = {};

        // Reset UI
        document.querySelectorAll('.creation-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('templateStep').classList.add('active');

        document.getElementById('storyBackBtn').style.display = 'none';
        document.getElementById('storyNextBtn').style.display = 'inline-block';
        document.getElementById('storyPublishBtn').style.display = 'none';

        // Clear form
        document.getElementById('storyTitle').value = '';
        document.getElementById('storySubtitle').value = '';
        document.getElementById('storyCta').value = '';
    }

    closeTemplatesLibraryModal() {
        const modal = document.getElementById('templatesLibraryModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Utility Methods
    getStatusLabel(status) {
        const labels = {
            'active': 'Attiva',
            'archived': 'Archiviata',
            'scheduled': 'Programmata'
        };
        return labels[status] || status;
    }

    getCtaLabel(cta) {
        const labels = {
            'prenota': 'Prenota Ora',
            'chiama': 'Chiama',
            'scopri': 'Scopri di Più',
            'offerta': 'Approfitta dell\'Offerta'
        };
        return labels[cta] || cta;
    }

    getTemplateName(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        return template ? template.name : templateId;
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `stories-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('.stories-notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'stories-notification-styles';
            styles.textContent = `
                .stories-notification {
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
                .stories-notification.info { background: #52A373; }
                .stories-notification.error { background: #ef4444; }
                .stories-notification.success { background: #52A373; }
                .stories-notification .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                .stories-notification button {
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
                .stories-notification button:hover {
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

// Global functions for HTML onclick events
function createNewStory() {
    const modal = document.getElementById('createStoryModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCreateStoryModal() {
    if (window.storiesPremium) {
        window.storiesPremium.closeCreateStoryModal();
    }
}

function nextStoryStep() {
    if (window.storiesPremium) {
        window.storiesPremium.nextStoryStep();
    }
}

function previousStoryStep() {
    if (window.storiesPremium) {
        window.storiesPremium.previousStoryStep();
    }
}

function publishStory() {
    if (window.storiesPremium) {
        window.storiesPremium.publishStory();
    }
}

function openTemplatesLibrary() {
    const modal = document.getElementById('templatesLibraryModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeTemplatesLibraryModal() {
    if (window.storiesPremium) {
        window.storiesPremium.closeTemplatesLibraryModal();
    }
}

function viewAnalytics() {
    if (window.storiesPremium) {
        window.storiesPremium.showNotification('Analytics Stories - Feature in sviluppo', 'info');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.storiesPremium = new StoriesPremium();
});

console.log('Sistema Stories Premium caricato');