// ===============================================
// PREMIUM UPGRADE PAGE LOGIC
// ===============================================

class PremiumUpgrade {
    constructor() {
        this.selectedPlan = 'annual';
        this.isAnnual = true;
        this.spotsLeft = 23;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startCountdown();
        this.animateCounters();
        console.log('Premium Upgrade inizializzato');
    }

    setupEventListeners() {
        // Payment method selection
        const methodOptions = document.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
            option.addEventListener('click', () => {
                methodOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                const method = option.dataset.method;
                this.showPaymentFields(method);
            });
        });

        // Pricing toggle
        const pricingToggle = document.getElementById('pricingToggle');
        if (pricingToggle) {
            pricingToggle.addEventListener('change', (e) => {
                this.togglePricing(e.target.checked);
            });
        }

        // Smooth scrolling for CTA buttons
        const ctaButtons = document.querySelectorAll('[onclick*="scrollToPlans"]');
        ctaButtons.forEach(button => {
            button.removeAttribute('onclick');
            button.addEventListener('click', () => this.scrollToPlans());
        });

        // FAQ toggles
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.removeAttribute('onclick');
            question.addEventListener('click', () => this.toggleFaq(question));
        });

        // Form validation
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            const inputs = paymentForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', this.formatInput.bind(this));
            });
        }
    }

    scrollToPlans() {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Add highlight effect
            pricingSection.style.animation = 'highlight 2s ease-in-out';
            setTimeout(() => {
                pricingSection.style.animation = '';
            }, 2000);
        }
    }

    togglePricing(isAnnual) {
        this.isAnnual = isAnnual;

        const monthlyCard = document.querySelector('.pricing-card.monthly');
        const annualCard = document.querySelector('.pricing-card.annual');

        if (isAnnual) {
            monthlyCard.classList.remove('active');
            annualCard.classList.add('active');
        } else {
            annualCard.classList.remove('active');
            monthlyCard.classList.add('active');
        }

        // Update button texts if needed
        this.updatePricingButtons();
    }

    updatePricingButtons() {
        const buttons = document.querySelectorAll('.btn-select-plan');
        buttons.forEach(button => {
            if (button.closest('.monthly')) {
                button.style.opacity = this.isAnnual ? '0.7' : '1';
            } else {
                button.style.opacity = this.isAnnual ? '1' : '0.7';
            }
        });
    }

    selectPlan(planType) {
        this.selectedPlan = planType;
        this.showPaymentModal(planType);
    }

    showPaymentModal(planType) {
        const modal = document.getElementById('paymentModal');
        const planName = document.getElementById('planName');
        const planPrice = document.getElementById('planPrice');
        const discountItem = document.getElementById('discountItem');

        if (planType === 'annual') {
            planName.textContent = 'RelaxPoint Premium Annuale';
            planPrice.textContent = '€412/anno';
            discountItem.style.display = 'flex';
        } else {
            planName.textContent = 'RelaxPoint Premium Mensile';
            planPrice.textContent = '€49/mese';
            discountItem.style.display = 'none';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Animate modal entrance
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.4s ease-out';
    }

    closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.style.animation = 'modalSlideOut 0.3s ease-in';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    showPaymentFields(method) {
        const cardFields = document.getElementById('cardFields');
        const paypalFields = document.getElementById('paypalFields');

        if (method === 'card') {
            cardFields.style.display = 'block';
            paypalFields.style.display = 'none';
        } else {
            cardFields.style.display = 'none';
            paypalFields.style.display = 'block';
        }
    }

    formatInput(event) {
        const input = event.target;
        const value = input.value;

        // Format card number
        if (input.placeholder.includes('1234')) {
            const formatted = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
            input.value = formatted;
        }

        // Format expiry date
        if (input.placeholder.includes('MM/AA')) {
            const formatted = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
            input.value = formatted;
        }

        // Format CVV
        if (input.placeholder.includes('123')) {
            input.value = value.replace(/\D/g, '');
        }
    }

    toggleFaq(questionElement) {
        const faqItem = questionElement.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current FAQ
        if (!isActive) {
            faqItem.classList.add('active');
        }
    }

    completePayment() {
        const form = document.getElementById('paymentForm');
        const button = document.querySelector('.btn-complete-payment');
        const buttonText = document.getElementById('paymentButtonText');

        // Basic validation
        const requiredFields = form.querySelectorAll('input[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#d1d5db';
            }
        });

        if (!isValid) {
            this.showNotification('Compila tutti i campi obbligatori', 'error');
            return;
        }

        // Check terms checkbox
        const termsCheckbox = form.querySelector('input[type="checkbox"]');
        if (!termsCheckbox.checked) {
            this.showNotification('Accetta i termini e condizioni per continuare', 'error');
            return;
        }

        // Show loading state
        button.disabled = true;
        buttonText.innerHTML = 'Elaborazione pagamento...';

        // Simulate payment processing
        setTimeout(() => {
            this.processPayment();
        }, 3000);
    }

    processPayment() {
        // Simulate successful payment
        localStorage.setItem('userPremium', 'true');

        this.showSuccessModal();
        this.closePaymentModal();
    }

    showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay success-modal';
        modal.innerHTML = `
            <div class="modal-content success-content">
                <div class="success-animation">
                    <div class="checkmark">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#10b981">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>

                <div class="success-text">
                    <h2>Benvenuto in Premium!</h2>
                    <p>Il tuo account è stato aggiornato con successo.</p>
                    <p>Ora puoi accedere a tutte le funzionalità Premium!</p>

                    <div class="premium-features-unlocked">
                        <h4>Hai sbloccato:</h4>
                        <ul>
                            <li>✓ Servizi e foto illimitati</li>
                            <li>✓ Video fino a 60 secondi</li>
                            <li>✓ Gestione multi-location</li>
                            <li>✓ CRM clienti completo</li>
                            <li>✓ Sistema pubblicitario</li>
                            <li>✓ Stories premium</li>
                        </ul>
                    </div>
                </div>

                <div class="success-actions">
                    <button class="btn-go-dashboard" onclick="goToDashboard()">
                        Vai alla Dashboard Premium
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-redirect after 10 seconds
        setTimeout(() => {
            this.goToDashboard();
        }, 10000);
    }

    goToDashboard() {
        window.location.href = '/pages/dashboard-professionista/dashboard-professionista.html';
    }

    startCountdown() {
        setInterval(() => {
            if (this.spotsLeft > 0) {
                this.spotsLeft--;
                const spotsElement = document.getElementById('spotsLeft');
                if (spotsElement) {
                    spotsElement.textContent = this.spotsLeft;

                    // Add animation when spots decrease
                    spotsElement.style.animation = 'none';
                    setTimeout(() => {
                        spotsElement.style.animation = 'countdown 1s ease-in-out infinite';
                    }, 10);
                }
            }
        }, Math.random() * 30000 + 15000); // Random between 15-45 seconds
    }

    animateCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatNumbers(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe stat numbers
        const statNumbers = document.querySelectorAll('.stat-number, .price-amount');
        statNumbers.forEach(stat => observer.observe(stat));
    }

    animateStatNumbers(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));

        if (isNaN(number)) return;

        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = text;
                clearInterval(timer);
            } else {
                element.textContent = text.replace(number, Math.floor(current));
            }
        }, 30);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add notification styles if not present
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    padding: 16px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    max-width: 300px;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification.info { background: #3b82f6; }
                .notification.error { background: #ef4444; }
                .notification.success { background: #10b981; }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                .notification button {
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

// Global Functions for onclick handlers
function scrollToPlans() {
    window.premiumUpgrade.scrollToPlans();
}

function togglePricing() {
    const toggle = document.getElementById('pricingToggle');
    window.premiumUpgrade.togglePricing(toggle.checked);
}

function selectPlan(planType) {
    window.premiumUpgrade.selectPlan(planType);
}

function closePaymentModal() {
    window.premiumUpgrade.closePaymentModal();
}

function completePayment() {
    window.premiumUpgrade.completePayment();
}

function toggleFaq(element) {
    window.premiumUpgrade.toggleFaq(element);
}

function goToDashboard() {
    window.premiumUpgrade.goToDashboard();
}

// Add CSS animations for modals
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
    }

    @keyframes highlight {
        0%, 100% { background-color: transparent; }
        50% { background-color: rgba(251, 191, 36, 0.1); }
    }

    .success-modal .modal-content {
        text-align: center;
        padding: 40px 30px;
    }

    .success-animation {
        margin-bottom: 30px;
    }

    .checkmark {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        animation: successPulse 1s ease-out;
    }

    @keyframes successPulse {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }

    .success-text h2 {
        color: var(--premium-dark);
        margin-bottom: 16px;
        font-size: 2em;
        font-weight: 900;
    }

    .success-text p {
        color: var(--text-secondary);
        margin-bottom: 12px;
        font-size: 1.1em;
    }

    .premium-features-unlocked {
        background: rgba(82, 163, 115, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
    }

    .premium-features-unlocked h4 {
        color: var(--premium-dark);
        margin-bottom: 16px;
        text-align: center;
    }

    .premium-features-unlocked ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .premium-features-unlocked li {
        padding: 6px 0;
        font-weight: 500;
        color: var(--premium-dark);
    }

    .btn-go-dashboard {
        background: var(--premium-gradient);
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 1.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(82, 163, 115, 0.3);
    }

    .btn-go-dashboard:hover {
        background: var(--premium-gradient-dark);
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(82, 163, 115, 0.5);
    }
`;
document.head.appendChild(modalStyles);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.premiumUpgrade = new PremiumUpgrade();
});

console.log('Premium Upgrade JS caricato completamente');