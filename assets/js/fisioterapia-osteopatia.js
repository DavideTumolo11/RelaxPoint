// ===== FISIOTERAPIA & OSTEOPATIA - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('🏥 Fisioterapia & Osteopatia - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.fisio-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Fisioterapia & Osteopatia resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.fisio-filters input[type="checkbox"], .fisio-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.fisio-price-input, .fisio-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.fisio-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('fisio-load-more')) return;

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
            problema: getCheckedValues('input[name="problema"]:checked'),
            attrezzature: getCheckedValues('input[name="attrezzature"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.fisio-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.fisio-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.fisio-distance-select')?.value) || 50
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
                if (m === 'palestra') return cardText.includes('palestra') || cardText.includes('riabilitativa');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Tipo Terapia
        if (filters.tipo.length > 0) {
            const hasTipo = filters.tipo.some(t => {
                switch (t) {
                    case 'fisioterapia':
                        return cardText.includes('fisioterapia') || cardText.includes('fisioterapista');
                    case 'osteopatia':
                        return cardText.includes('osteopata') || cardText.includes('osteopatia') || cardText.includes('manipolazioni');
                    case 'strumentale':
                        return cardText.includes('tecar') || cardText.includes('laser') || cardText.includes('ultrasuoni') || cardText.includes('onde');
                    case 'posturale':
                        return cardText.includes('rpg') || cardText.includes('posturale') || cardText.includes('postura');
                    default:
                        return false;
                }
            });
            if (!hasTipo) return false;
        }

        // Problema Specifico
        if (filters.problema.length > 0) {
            const hasProblema = filters.problema.some(p => {
                switch (p) {
                    case 'cervicale':
                        return cardText.includes('cervical');
                    case 'lombare':
                        return cardText.includes('lombar') || cardText.includes('schiena');
                    case 'ginocchio':
                        return cardText.includes('ginocchio');
                    case 'spalla':
                        return cardText.includes('spalla');
                    case 'post-trauma':
                        return cardText.includes('post-trauma') || cardText.includes('trauma');
                    case 'sportivo':
                        return cardText.includes('sportiv') || cardText.includes('infortun');
                    default:
                        return false;
                }
            });
            if (!hasProblema) return false;
        }

        // Attrezzature
        if (filters.attrezzature.length > 0) {
            const hasAttrezzature = filters.attrezzature.some(a => {
                switch (a) {
                    case 'tecar':
                        return cardText.includes('tecar');
                    case 'laser':
                        return cardText.includes('laser');
                    case 'ultrasuoni':
                        return cardText.includes('ultrasuoni');
                    case 'manuale':
                        return cardText.includes('manuale') || cardText.includes('manipolazioni');
                    default:
                        return false;
                }
            });
            if (!hasAttrezzature) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.fisio-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('fisio-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.fisio-filters input[type="checkbox"], .fisio-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.fisio-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.fisio-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.fisio-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Professionisti trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.fisio-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Fisioterapia & Osteopatia toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.fisio-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.fisio-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace('dr.', '').replace('dr.ssa', '');

                console.log(`Vai al profilo Fisioterapia: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.fisio-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.fisio-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Fisioterapia con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=fisioterapia`;
            });
        });

        // Click su card
        document.querySelectorAll('.fisio-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Fisioterapia clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.fisio-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Fisioterapia: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.fisio-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.fisio-professional-card')).filter(card =>
            !card.classList.contains('fisio-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.fisio-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.fisio-rating-value')?.textContent) || 0;
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
                    const premiumA = a.classList.contains('fisio-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('fisio-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.fisio-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.fisio-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.fisio-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.fisio-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.fisio-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.fisio-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri professionisti Fisioterapia...');

                    this.textContent = 'Carica altri professionisti';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.fisio-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 42 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA FISIOTERAPIA
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
            document.querySelectorAll('.fisio-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.fisio-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('fisio-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Fisioterapia & Osteopatia
            const isMatch = cardText.includes(query) ||
                query.includes('fisio') && cardText.includes('fisioterapia') ||
                query.includes('osteo') && cardText.includes('osteopatia') ||
                query.includes('tecar') && cardText.includes('tecar') ||
                query.includes('cervical') && cardText.includes('cervical') ||
                query.includes('lombar') && cardText.includes('lombar') ||
                query.includes('schiena') && cardText.includes('schiena');

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
    console.log('✅ Fisioterapia & Osteopatia - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.fisio-professional-card:not(.fisio-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - FISIOTERAPIA
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.fisio-professional-card img, .fisio-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-fisioterapia.jpg';
            this.alt = 'Fisioterapia - Immagine non disponibile';
            console.log('⚠️ Immagine Fisioterapia sostituita con placeholder');
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
    🏥 ===============================================
       FISIOTERAPIA & OSTEOPATIA - Statistiche Debug
       Professionisti: ${document.querySelectorAll('.fisio-professional-card:not(.fisio-load-more)').length}
       Filtri: ${document.querySelectorAll('.fisio-filter-group').length}
       Specializzazioni: Fisioterapia, Osteopatia, Strumentale, Posturale
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const tipoOptions = document.querySelectorAll('input[name="tipo"]').length;
    const problemaOptions = document.querySelectorAll('input[name="problema"]').length;
    const attrezzatureOptions = document.querySelectorAll('input[name="attrezzature"]').length;

    console.log(`📊 Filtri disponibili: ${tipoOptions} terapie, ${problemaOptions} problemi, ${attrezzatureOptions} attrezzature`);
});