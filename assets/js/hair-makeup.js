// ===== HAIR & MAKE-UP - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('💄 Hair & Make-up - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.hair-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Hair & Make-up resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.hair-filters input[type="checkbox"], .hair-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.hair-price-input, .hair-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.hair-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('hair-load-more')) return;

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
            categoria: getCheckedValues('input[name="categoria"]:checked'),
            occasione: getCheckedValues('input[name="occasione"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.hair-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.hair-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.hair-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        // Logica semplificata di matching
        const cardText = card.textContent.toLowerCase();

        // Modalità Servizio
        if (filters.modalita.length > 0) {
            const hasModalita = filters.modalita.some(m => {
                if (m === 'domicilio') return cardText.includes('domicilio');
                if (m === 'studio') return cardText.includes('studio');
                if (m === 'location') return cardText.includes('location') || cardText.includes('eventi');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Categoria Servizio
        if (filters.categoria.length > 0) {
            const hasCategoria = filters.categoria.some(c => {
                switch (c) {
                    case 'makeup':
                        return cardText.includes('make-up') || cardText.includes('makeup') || cardText.includes('trucco');
                    case 'hair':
                        return cardText.includes('hair') || cardText.includes('capelli') || cardText.includes('stylist') || cardText.includes('taglio') || cardText.includes('colore');
                    case 'combo':
                        return cardText.includes('combo') || cardText.includes('completa');
                    case 'uomo':
                        return cardText.includes('uomo') || cardText.includes('barbiere') || cardText.includes('barba');
                    default:
                        return false;
                }
            });
            if (!hasCategoria) return false;
        }

        // Occasione
        if (filters.occasione.length > 0) {
            const hasOccasione = filters.occasione.some(o => {
                switch (o) {
                    case 'quotidiano':
                        return cardText.includes('giorno') || cardText.includes('quotidiano');
                    case 'eventi':
                        return cardText.includes('eventi') || cardText.includes('sera');
                    case 'sposa':
                        return cardText.includes('sposa') || cardText.includes('matrimonio') || cardText.includes('wedding');
                    case 'fashion':
                        return cardText.includes('fashion') || cardText.includes('shooting') || cardText.includes('moda');
                    default:
                        return false;
                }
            });
            if (!hasOccasione) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.hair-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('hair-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.hair-filters input[type="checkbox"], .hair-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.hair-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.hair-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.hair-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Professionisti trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.hair-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Hair & Make-up toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.hair-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.hair-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-');

                console.log(`Vai al profilo Hair & Make-up: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.hair-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.hair-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Hair & Make-up con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=hair-makeup`;
            });
        });

        // Click su card
        document.querySelectorAll('.hair-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Hair & Make-up clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.hair-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Hair & Make-up: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.hair-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.hair-professional-card')).filter(card =>
            !card.classList.contains('hair-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.hair-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.hair-rating-value')?.textContent) || 0;
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
                    const premiumA = a.classList.contains('hair-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('hair-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.hair-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.hair-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.hair-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.hair-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.hair-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.hair-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri professionisti Hair & Make-up...');

                    this.textContent = 'Carica altri professionisti';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.hair-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 35 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA HAIR & MAKE-UP
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
            document.querySelectorAll('.hair-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.hair-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('hair-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Hair & Make-up
            const isMatch = cardText.includes(query) ||
                query.includes('makeup') && cardText.includes('make-up') ||
                query.includes('hair') && cardText.includes('capelli') ||
                query.includes('barba') && cardText.includes('barbiere') ||
                query.includes('sposa') && cardText.includes('wedding');

            if (isMatch) {
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

    // INIZIALIZZA FILTRI SMART
    initializeSmartFilters();

    // INIZIALIZZAZIONE FINALE
    console.log('✅ Hair & Make-up - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.hair-professional-card:not(.hair-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - HAIR & MAKE-UP
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.hair-professional-card img, .hair-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-hair-makeup.jpg';
            this.alt = 'Hair & Make-up - Immagine non disponibile';
            console.log('⚠️ Immagine Hair & Make-up sostituita con placeholder');
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

// ANALYTICS E DEBUG
document.addEventListener('DOMContentLoaded', function () {
    console.log(`
    💄 ===============================================
       HAIR & MAKE-UP - Statistiche Debug
       Professionisti: ${document.querySelectorAll('.hair-professional-card:not(.hair-load-more)').length}
       Filtri: ${document.querySelectorAll('.hair-filter-group').length}
       Specializzazioni: Make-up, Hair Styling, Combo, Uomo
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const categoriaOptions = document.querySelectorAll('input[name="categoria"]').length;
    const occasioneOptions = document.querySelectorAll('input[name="occasione"]').length;

    console.log(`📊 Filtri disponibili: ${categoriaOptions} categorie, ${occasioneOptions} occasioni`);
});