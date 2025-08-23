// ===== PROFESSIONISTI - JS PULITO COME SERVIZI =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('👨‍⚕️ Professionisti - JavaScript caricato');

    // ===============================================
    // ELEMENTI DOM
    // ===============================================
    const citySelector = document.querySelector('.professionals-city-dropdown');
    const filterButtons = document.querySelectorAll('.professionals-filter-btn');
    const ratingDropdown = document.querySelector('.professionals-rating-dropdown');
    const searchInput = document.querySelector('.professionals-search-input');
    const professionalCards = document.querySelectorAll('.professional-card');

    // ===============================================
    // DROPDOWN CITTÀ FUNZIONANTE (come servizi.js)
    // ===============================================
    if (citySelector) {
        citySelector.addEventListener('change', function () {
            const selectedCity = this.value;
            console.log(`Città selezionata: ${selectedCity.toUpperCase()}`);

            // Feedback visivo temporaneo
            const cityContainer = this.closest('.professionals-city-selector');
            const originalBg = cityContainer.style.backgroundColor;

            cityContainer.style.backgroundColor = 'var(--color-primary)';
            cityContainer.style.color = 'white';

            setTimeout(() => {
                cityContainer.style.backgroundColor = originalBg;
                cityContainer.style.color = 'var(--color-text)';
            }, 500);

            // Toast feedback
            showToast(`Professionisti caricati per ${selectedCity.toUpperCase()}`, 'success');
        });
    }

    // ===============================================
    // FILTRI CATEGORIE
    // ===============================================
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Rimuovi active da tutti
            filterButtons.forEach(b => b.classList.remove('active'));
            // Aggiungi active al clicked
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterProfessionalsByCategory(category);
            console.log(`Filtro categoria: ${category}`);
        });
    });

    function filterProfessionalsByCategory(category) {
        let visibleCount = 0;

        professionalCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.3s ease-out';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`${visibleCount} professionisti visibili per categoria: ${category}`);
    }

    // ===============================================
    // FILTRO RATING
    // ===============================================
    if (ratingDropdown) {
        ratingDropdown.addEventListener('change', function () {
            const selectedRating = this.value;
            filterProfessionalsByRating(selectedRating);
            console.log(`Filtro rating: ${selectedRating}`);
        });
    }

    function filterProfessionalsByRating(minRating) {
        let visibleCount = 0;

        professionalCards.forEach(card => {
            if (card.style.display === 'none') return; // Skip se già nascosta

            const ratingText = card.querySelector('.rating-text');
            if (!ratingText) return;

            // Estrai rating dal testo "4.9 (127 recensioni)"
            const ratingMatch = ratingText.textContent.match(/(\d+\.?\d*)/);
            const cardRating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

            if (minRating === 'all' || cardRating >= parseFloat(minRating)) {
                if (card.style.display !== 'none') {
                    visibleCount++;
                }
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`${visibleCount} professionisti visibili per rating >= ${minRating}`);
    }

    // ===============================================
    // RICERCA RAPIDA (come servizi.js)
    // ===============================================
    if (searchInput) {
        let searchTimeout;

        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();

            searchTimeout = setTimeout(() => {
                if (query.length > 0) {
                    searchProfessionals(query);
                } else {
                    showAllCards();
                }
            }, 300);
        });
    }

    function searchProfessionals(query) {
        let visibleCount = 0;

        professionalCards.forEach(card => {
            const name = card.querySelector('.professional-name')?.textContent.toLowerCase() || '';
            const specialization = card.querySelector('.professional-specialization')?.textContent.toLowerCase() || '';

            const isMatch = name.includes(query) ||
                specialization.includes(query) ||
                query.includes('massaggio') && specialization.includes('massaggio') ||
                query.includes('trainer') && specialization.includes('trainer') ||
                query.includes('estetista') && specialization.includes('estetista') ||
                query.includes('fisio') && specialization.includes('fisio');

            if (isMatch) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.3s ease-out';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`${visibleCount} professionisti trovati per: "${query}"`);
    }

    function showAllCards() {
        professionalCards.forEach(card => {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.3s ease-out';
        });
    }

    // ===============================================
    // CLICK CARD PROFESSIONISTI (come servizi.js)
    // ===============================================
    professionalCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Non fare niente se click su bottone
            if (e.target.closest('.professional-cta')) return;

            const name = this.querySelector('.professional-name')?.textContent || 'Professionista';
            console.log(`Card clicked: ${name}`);

            // Simula apertura profilo
            showToast(`Apertura profilo di ${name}`, 'info');

            // Effetto click feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Accessibilità keyboard
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Vai al profilo di ${card.querySelector('.professional-name')?.textContent}`);

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Click su bottoni CTA
    document.querySelectorAll('.professional-cta').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();

            const card = this.closest('.professional-card');
            const name = card.querySelector('.professional-name')?.textContent || 'Professionista';

            console.log(`CTA clicked: ${name}`);
            showToast(`Apertura profilo di ${name}`, 'success');
        });
    });

    // ===============================================
    // ANIMAZIONI AL CARICAMENTO (come servizi.js)
    // ===============================================
    professionalCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 * (index + 1));
    });

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' :
                type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ===============================================
    // LAZY LOADING IMMAGINI
    // ===============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1
        });

        const professionalImages = document.querySelectorAll('.professional-image');
        professionalImages.forEach(img => {
            img.style.opacity = '0.8';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE COMPLETA
    // ===============================================
    console.log('✅ Professionisti - Tutto inizializzato (versione pulita)');
    console.log(`🎯 ${professionalCards.length} professionisti caricati`);

    // Statistiche iniziali
    const premiumCards = document.querySelectorAll('.professional-card.premium').length;
    const lastMinuteCards = document.querySelectorAll('.last-minute-badge').length;

    console.log(`📊 Premium: ${premiumCards} | Last Minute: ${lastMinuteCards}`);
});

// CSS per animazioni toast
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);