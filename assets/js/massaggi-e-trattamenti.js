// ===== MASSAGGI E TRATTAMENTI - JS SEMPLIFICATO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('[INIT] Massaggi e Trattamenti - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.massaggi-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.massaggi-filters input[type="checkbox"], .massaggi-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.massaggi-price-input, .massaggi-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.massaggi-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('massaggi-load-more')) return;

            const isVisible = matchesFilters(card, filters);

            if (isVisible) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }

    function getActiveFilters() {
        return {
            modalita: getCheckedValues('input[name="modalita"]:checked'),
            tipo: getCheckedValues('input[name="tipo"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.massaggi-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.massaggi-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.massaggi-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        // Logica semplificata di matching
        const cardText = card.textContent.toLowerCase();

        // Modalità
        if (filters.modalita.length > 0) {
            const hasModalita = filters.modalita.some(m => {
                if (m === 'domicilio') return cardText.includes('domicilio');
                if (m === 'studio') return cardText.includes('studio');
                if (m === 'entrambe') return cardText.includes('studio') && cardText.includes('domicilio');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Tipo
        if (filters.tipo.length > 0) {
            const hasTipo = filters.tipo.some(t => cardText.includes(t.toLowerCase()));
            if (!hasTipo) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.massaggi-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('massaggi-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.massaggi-filters input[type="checkbox"], .massaggi-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.massaggi-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.massaggi-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.massaggi-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Professionisti trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.massaggi-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.massaggi-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.massaggi-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-');

                console.log(`Vai al profilo: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.massaggi-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.massaggi-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}`;
            });
        });

        // Click su card
        document.querySelectorAll('.massaggi-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.massaggi-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.massaggi-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.massaggi-professional-card')).filter(card =>
            !card.classList.contains('massaggi-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.massaggi-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.massaggi-rating-value')?.textContent) || 0;
                    return ratingB - ratingA;

                case 'prezzo-asc':
                case 'prezzo-desc':
                    const priceA = getMinPrice(a);
                    const priceB = getMinPrice(b);
                    return sortBy === 'prezzo-asc' ? priceA - priceB : priceB - priceA;

                case 'distanza':
                    const distA = getDistance(a);
                    const distB = getDistance(b);
                    return distA - distB;

                default: // rilevanza
                    const premiumA = a.classList.contains('massaggi-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('massaggi-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.massaggi-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.massaggi-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.massaggi-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.massaggi-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.massaggi-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.massaggi-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri professionisti...');

                    this.textContent = 'Carica altri professionisti';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.massaggi-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 6 di 47 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const query = this.value.toLowerCase().trim();
                searchProfessionals(query);
            });
        }
    }

    function searchProfessionals(query) {
        if (!query) {
            // Mostra tutti
            document.querySelectorAll('.massaggi-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.massaggi-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('massaggi-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            if (cardText.includes(query)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }

    // UTILITY FUNCTIONS
    function getCheckedValues(selector) {
        return Array.from(document.querySelectorAll(selector))
            .map(input => input.value);
    }

    function getCheckedValue(selector) {
        const input = document.querySelector(selector);
        return input ? input.value : null;
    }

    // INIZIALIZZA RICERCA
    initializeSearch();

    // INIZIALIZZAZIONE FINALE
    console.log('✅ Massaggi e Trattamenti - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.massaggi-professional-card:not(.massaggi-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.massaggi-professional-image img, .massaggi-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-professional.jpg';
            this.alt = 'Immagine non disponibile';
            console.log('[WARNING] Immagine sostituita con placeholder');
        });
    });
});

// SMOOTH SCROLLING
document.addEventListener('DOMContentLoaded', function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// PERFORMANCE: LAZY LOADING
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Applica a immagini con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ANALYTICS (per debug)
document.addEventListener('DOMContentLoaded', function () {
    console.log(`
    🌿 ===============================================
       MASSAGGI E TRATTAMENTI - Statistiche Debug
       Professionisti: ${document.querySelectorAll('.massaggi-professional-card:not(.massaggi-load-more)').length}
       Filtri: ${document.querySelectorAll('.massaggi-filter-group').length}
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);
});