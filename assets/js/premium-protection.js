// ===============================================
// SISTEMA PROTEZIONE UNIVERSALE PREMIUM
// ===============================================

class PremiumProtection {
    constructor() {
        this.userStatus = this.checkUserPremiumStatus();
        this.protectedSections = [
            'multi-location',
            'crm-clienti',
            'pubblicita',
            'stories-premium',
            'analytics-avanzate',
            'supporto-priority'
        ];
        this.init();
    }

    init() {
        this.setupProtectionChecks();
        this.monitorPageAccess();
        console.log('Sistema protezione Premium inizializzato');
    }

    checkUserPremiumStatus() {
        // DEVELOPMENT MODE - Allow access to premium features for testing
        // TODO: Remove this return true when integrating with backend
        return true;

        // Check localStorage first
        const localStatus = localStorage.getItem('userPremium');
        if (localStatus === 'true') {
            return true;
        }

        // Check session storage
        const sessionStatus = sessionStorage.getItem('userPremium');
        if (sessionStatus === 'true') {
            return true;
        }

        // In production: check via API call
        // For now, default to false
        return false;
    }

    setupProtectionChecks() {
        // Protect navigation menu items
        this.protectMenuItems();

        // Protect content sections
        this.protectContentSections();

        // Protect action buttons
        this.protectActionButtons();
    }

    protectMenuItems() {
        const menuItems = document.querySelectorAll('[data-premium-required]');

        menuItems.forEach(item => {
            if (!this.userStatus) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const featureName = item.getAttribute('data-premium-required');
                    this.showPremiumRequired(featureName);
                });

                // Add visual indicator
                this.addPremiumBadge(item);
            }
        });
    }

    protectContentSections() {
        const premiumSections = document.querySelectorAll('.premium-only');

        premiumSections.forEach(section => {
            if (!this.userStatus) {
                this.addPremiumOverlay(section);
            }
        });
    }

    protectActionButtons() {
        const premiumButtons = document.querySelectorAll('.premium-button');

        premiumButtons.forEach(button => {
            if (!this.userStatus) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const featureName = button.getAttribute('data-feature-name') || 'questa funzionalità';
                    this.showPremiumRequired(featureName);
                });
            }
        });
    }

    addPremiumBadge(element) {
        if (element.querySelector('.premium-badge')) return;

        const badge = document.createElement('span');
        badge.className = 'premium-badge';
        badge.textContent = 'PREMIUM';
        badge.style.cssText = `
            background: linear-gradient(135deg, #52A373 0%, #82C49C 100%);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 600;
            margin-left: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;

        element.appendChild(badge);
    }

    addPremiumOverlay(section) {
        if (section.querySelector('.premium-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'premium-overlay';
        overlay.innerHTML = `
            <div class="premium-overlay-content">
                <div class="premium-overlay-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#52A373">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="premium-overlay-text">
                    <h3>Funzionalità Premium</h3>
                    <p>Accesso esclusivo per utenti Premium</p>
                    <button class="btn-upgrade-now" onclick="window.premiumProtection.redirectToUpgrade()">
                        Passa a Premium
                    </button>
                </div>
            </div>
        `;

        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            z-index: 10;
            cursor: pointer;
        `;

        // Style the overlay content
        const overlayContent = overlay.querySelector('.premium-overlay-content');
        overlayContent.style.cssText = `
            text-align: center;
            padding: 30px;
            max-width: 300px;
        `;

        const overlayIcon = overlay.querySelector('.premium-overlay-icon');
        overlayIcon.style.cssText = `
            margin-bottom: 16px;
        `;

        const overlayText = overlay.querySelector('.premium-overlay-text h3');
        overlayText.style.cssText = `
            color: #2D5A3D;
            margin-bottom: 8px;
            font-size: 1.3em;
            font-weight: 700;
        `;

        const overlayDesc = overlay.querySelector('.premium-overlay-text p');
        overlayDesc.style.cssText = `
            color: #7f8c8d;
            margin-bottom: 20px;
            line-height: 1.5;
        `;

        const upgradeBtn = overlay.querySelector('.btn-upgrade-now');
        upgradeBtn.style.cssText = `
            background: linear-gradient(135deg, #52A373 0%, #82C49C 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(82, 163, 115, 0.3);
        `;

        upgradeBtn.onmouseover = () => {
            upgradeBtn.style.transform = 'translateY(-2px)';
            upgradeBtn.style.boxShadow = '0 6px 16px rgba(82, 163, 115, 0.4)';
        };

        upgradeBtn.onmouseout = () => {
            upgradeBtn.style.transform = 'translateY(0)';
            upgradeBtn.style.boxShadow = '0 4px 12px rgba(82, 163, 115, 0.3)';
        };

        // Make parent position relative if not already
        const position = window.getComputedStyle(section).position;
        if (position === 'static') {
            section.style.position = 'relative';
        }

        section.appendChild(overlay);

        // Add click handler to overlay
        overlay.addEventListener('click', () => {
            this.redirectToUpgrade();
        });
    }

    showPremiumRequired(featureName) {
        const modal = document.createElement('div');
        modal.className = 'premium-required-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="premium-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="#52A373">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h2>Accesso Premium Richiesto</h2>
                        <button class="modal-close" onclick="this.closest('.premium-required-modal').remove()">&times;</button>
                    </div>

                    <div class="modal-body">
                        <p class="feature-name">Per accedere a <strong>${featureName}</strong> è necessario un account Premium.</p>

                        <div class="premium-benefits">
                            <h4>Con Premium ottieni:</h4>
                            <ul>
                                <li>Gestione multi-location illimitata</li>
                                <li>CRM clienti completo</li>
                                <li>Sistema pubblicitario avanzato</li>
                                <li>Stories premium con templates</li>
                                <li>Analytics dettagliate</li>
                                <li>Supporto prioritario</li>
                            </ul>
                        </div>

                        <div class="pricing-highlight">
                            <div class="price-tag">
                                <span class="price">€49,99/mese</span>
                                <span class="period">fatturati annualmente</span>
                                <span class="save">Risparmi 30%</span>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-upgrade" onclick="window.premiumProtection.redirectToUpgrade()">
                            Passa a Premium Ora
                        </button>
                        <button class="btn-cancel" onclick="this.closest('.premium-required-modal').remove()">
                            Forse più tardi
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.styleModal(modal);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Auto-close after 30 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        }, 30000);
    }

    styleModal(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        `;

        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 90%;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            animation: modalSlideUp 0.4s ease-out;
        `;

        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            text-align: center;
            padding: 30px 30px 20px;
            border-bottom: 1px solid #e5e7eb;
            position: relative;
        `;

        const premiumIcon = modal.querySelector('.premium-icon');
        premiumIcon.style.cssText = `
            margin-bottom: 16px;
        `;

        const title = modal.querySelector('h2');
        title.style.cssText = `
            color: #2D5A3D;
            font-size: 1.5em;
            font-weight: 700;
            margin: 0;
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            color: #7f8c8d;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        closeBtn.onmouseover = () => {
            closeBtn.style.background = '#f3f4f6';
            closeBtn.style.color = '#374151';
        };

        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = '#7f8c8d';
        };

        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 30px;
        `;

        const featureName = modal.querySelector('.feature-name');
        featureName.style.cssText = `
            font-size: 1.1em;
            line-height: 1.6;
            color: #374151;
            margin-bottom: 24px;
            text-align: center;
        `;

        const benefits = modal.querySelector('.premium-benefits');
        benefits.style.cssText = `
            margin-bottom: 24px;
        `;

        const benefitsTitle = benefits.querySelector('h4');
        benefitsTitle.style.cssText = `
            color: #2D5A3D;
            font-size: 1.1em;
            margin-bottom: 12px;
            font-weight: 600;
        `;

        const benefitsList = benefits.querySelector('ul');
        benefitsList.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0;
        `;

        const listItems = benefits.querySelectorAll('li');
        listItems.forEach(item => {
            item.style.cssText = `
                padding: 6px 0;
                color: #374151;
                position: relative;
                padding-left: 20px;
            `;

            item.innerHTML = `<span style="
                position: absolute;
                left: 0;
                color: #52A373;
                font-weight: bold;
            ">✓</span> ${item.textContent}`;
        });

        const pricingHighlight = modal.querySelector('.pricing-highlight');
        pricingHighlight.style.cssText = `
            background: linear-gradient(135deg, #52A373 0%, #82C49C 100%);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            color: white;
            margin-bottom: 20px;
        `;

        const priceTag = modal.querySelector('.price-tag');
        priceTag.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        `;

        const price = modal.querySelector('.price');
        price.style.cssText = `
            font-size: 2em;
            font-weight: 900;
        `;

        const period = modal.querySelector('.period');
        period.style.cssText = `
            opacity: 0.9;
            font-size: 0.9em;
        `;

        const save = modal.querySelector('.save');
        save.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
            margin-top: 8px;
        `;

        const footer = modal.querySelector('.modal-footer');
        footer.style.cssText = `
            padding: 20px 30px 30px;
            display: flex;
            gap: 12px;
            flex-direction: column;
        `;

        const upgradeBtn = modal.querySelector('.btn-upgrade');
        upgradeBtn.style.cssText = `
            background: linear-gradient(135deg, #52A373 0%, #82C49C 100%);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 1.1em;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(82, 163, 115, 0.3);
        `;

        upgradeBtn.onmouseover = () => {
            upgradeBtn.style.transform = 'translateY(-2px)';
            upgradeBtn.style.boxShadow = '0 6px 16px rgba(82, 163, 115, 0.4)';
        };

        upgradeBtn.onmouseout = () => {
            upgradeBtn.style.transform = 'translateY(0)';
            upgradeBtn.style.boxShadow = '0 4px 12px rgba(82, 163, 115, 0.3)';
        };

        const cancelBtn = modal.querySelector('.btn-cancel');
        cancelBtn.style.cssText = `
            background: transparent;
            color: #7f8c8d;
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        cancelBtn.onmouseover = () => {
            cancelBtn.style.background = '#f3f4f6';
            cancelBtn.style.color = '#374151';
        };

        cancelBtn.onmouseout = () => {
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = '#7f8c8d';
        };
    }

    redirectToUpgrade() {
        // Close any open modals
        document.querySelectorAll('.premium-required-modal, .modal').forEach(modal => {
            modal.remove();
        });
        document.body.style.overflow = 'auto';

        // Redirect to upgrade page
        window.location.href = '/pages/premium-upgrade.html';
    }

    monitorPageAccess() {
        // Check if current page requires premium
        const currentPage = window.location.pathname;
        const premiumPages = [
            'multi-location.html',
            'crm-clienti.html',
            'pubblicita.html',
            'stories-premium.html'
        ];

        const isPremiumPage = premiumPages.some(page => currentPage.includes(page));

        if (isPremiumPage && !this.userStatus) {
            // Delay to let page load
            setTimeout(() => {
                const pageName = currentPage.split('/').pop().replace('.html', '').replace('-', ' ');
                this.showPremiumRequired(pageName);
            }, 500);
        }
    }

    // Methods for enabling premium access
    enablePremiumAccess() {
        this.userStatus = true;
        localStorage.setItem('userPremium', 'true');

        // Remove all protection overlays
        document.querySelectorAll('.premium-overlay').forEach(overlay => {
            overlay.remove();
        });

        // Remove premium badges
        document.querySelectorAll('.premium-badge').forEach(badge => {
            badge.remove();
        });

        // Re-enable protected items
        document.querySelectorAll('[data-premium-required]').forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });

        console.log('Accesso Premium abilitato');
    }

    disablePremiumAccess() {
        this.userStatus = false;
        localStorage.removeItem('userPremium');
        sessionStorage.removeItem('userPremium');

        // Re-initialize protection
        this.setupProtectionChecks();

        console.log('Accesso Premium disabilitato');
    }
}

// Global functions
window.enablePremium = function() {
    window.premiumProtection.enablePremiumAccess();
};

window.disablePremium = function() {
    window.premiumProtection.disablePremiumAccess();
};

// Add modal animations CSS
const protectionStyles = document.createElement('style');
protectionStyles.textContent = `
    @keyframes modalSlideUp {
        from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .premium-overlay {
        transition: all 0.3s ease;
    }

    .premium-overlay:hover {
        background: rgba(255, 255, 255, 0.98) !important;
    }
`;
document.head.appendChild(protectionStyles);

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.premiumProtection = new PremiumProtection();
});

console.log('Sistema protezione Premium caricato');