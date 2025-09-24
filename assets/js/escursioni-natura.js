// ===== ESCURSIONI & NATURA - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('[INIT] Escursioni & Natura - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.escursioni-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Escursioni & Natura resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.escursioni-filters input[type="checkbox"], .escursioni-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.escursioni-price-input, .escursioni-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.escursioni-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('escursioni-load-more')) return;

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
            tipologia: getCheckedValues('input[name="tipologia"]:checked'),
            difficolta: getCheckedValues('input[name="difficolta"]:checked'),
            durata: getCheckedValues('input[name="durata"]:checked'),
            certificazioni: getCheckedValues('input[name="certificazioni"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.escursioni-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.escursioni-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.escursioni-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        // Logica semplificata di matching
        const cardText = card.textContent.toLowerCase();

        // Tipologia Escursione
        if (filters.tipologia.length > 0) {
            const hasTipologia = filters.tipologia.some(t => {
                switch (t) {
                    case 'trekking':
                        return cardText.includes('trekking') || cardText.includes('hiking') || cardText.includes('monti');
                    case 'forest-bathing':
                        return cardText.includes('forest') || cardText.includes('bagno') || cardText.includes('foresta');
                    case 'mindfulness':
                        return cardText.includes('mindfulness') || cardText.includes('meditazione') || cardText.includes('yoga');
                    case 'birdwatching':
                        return cardText.includes('birdwatching') || cardText.includes('uccelli') || cardText.includes('natura');
                    case 'fotografia':
                        return cardText.includes('fotografia') || cardText.includes('foto') || cardText.includes('alba') || cardText.includes('tramonto');
                    default:
                        return false;
                }
            });
            if (!hasTipologia) return false;
        }

        // Difficoltà
        if (filters.difficolta.length > 0) {
            const hasDifficolta = filters.difficolta.some(d => {
                switch (d) {
                    case 'facile':
                        return cardText.includes('tutti') || cardText.includes('principianti') || cardText.includes('facile');
                    case 'medio':
                        return cardText.includes('intermedio') || cardText.includes('medio') || cardText.includes('buona forma');
                    case 'difficile':
                        return cardText.includes('esperti') || cardText.includes('avanzato') || cardText.includes('difficile');
                    default:
                        return false;
                }
            });
            if (!hasDifficolta) return false;
        }

        // Durata
        if (filters.durata.length > 0) {
            const hasDurata = filters.durata.some(d => {
                switch (d) {
                    case 'mezza-giornata':
                        return cardText.includes('mezza giornata') || cardText.includes('4h') || cardText.includes('3h') || cardText.includes('2h');
                    case 'giornata-intera':
                        return cardText.includes('giornata') || cardText.includes('8h') || cardText.includes('6h');
                    case 'weekend':
                        return cardText.includes('weekend') || cardText.includes('2gg') || cardText.includes('giorni');
                    default:
                        return false;
                }
            });
            if (!hasDurata) return false;
        }

        // Certificazioni
        if (filters.certificazioni.length > 0) {
            const hasCertificazioni = filters.certificazioni.some(c => {
                switch (c) {
                    case 'aigae':
                        return cardText.includes('aigae');
                    case 'cai':
                        return cardText.includes('cai');
                    case 'rescue':
                        return cardText.includes('rescue') || cardText.includes('primo soccorso');
                    default:
                        return false;
                }
            });
            if (!hasCertificazioni) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.escursioni-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('escursioni-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.escursioni-filters input[type="checkbox"], .escursioni-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.escursioni-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.escursioni-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const trekkingCheckbox = document.querySelector('input[name="tipologia"][value="trekking"]');
        if (trekkingCheckbox) trekkingCheckbox.checked = true;

        const facileCheckbox = document.querySelector('input[name="difficolta"][value="facile"]');
        if (facileCheckbox) facileCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.escursioni-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Guide trovate`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.escursioni-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Escursioni & Natura toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.escursioni-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.escursioni-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace('dott.ssa', '').replace('dott.', '');

                console.log(`Vai al profilo Escursioni: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.escursioni-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.escursioni-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Escursione con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=escursioni`;
            });
        });

        // Click su card
        document.querySelectorAll('.escursioni-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Escursioni clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.escursioni-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Escursioni: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.escursioni-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.escursioni-professional-card')).filter(card =>
            !card.classList.contains('escursioni-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.escursioni-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.escursioni-rating-value')?.textContent) || 0;
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
                    const premiumA = a.classList.contains('escursioni-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('escursioni-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.escursioni-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.escursioni-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.escursioni-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.escursioni-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.escursioni-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.escursioni-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altre guide Escursioni...');

                    this.textContent = 'Carica altre guide';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.escursioni-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 42 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA ESCURSIONI
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
            document.querySelectorAll('.escursioni-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.escursioni-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('escursioni-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Escursioni & Natura
            const isMatch = cardText.includes(query) ||
                query.includes('trekking') && cardText.includes('trekking') ||
                query.includes('hiking') && cardText.includes('hiking') ||
                query.includes('natura') && cardText.includes('natura') ||
                query.includes('forest') && cardText.includes('forest') ||
                query.includes('mindfulness') && cardText.includes('mindfulness') ||
                query.includes('foto') && (cardText.includes('foto') || cardText.includes('alba')) ||
                query.includes('guida') && cardText.includes('guida') ||
                query.includes('escursione') && cardText.includes('escursioni');

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

    // INIZIALIZZAZIONE FINALE
    console.log('✅ Escursioni & Natura - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.escursioni-professional-card:not(.escursioni-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - ESCURSIONI
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.escursioni-professional-card img, .escursioni-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-escursioni.jpg';
            this.alt = 'Escursioni - Immagine non disponibile';
            console.log('[WARNING] Immagine Escursioni sostituita con placeholder');
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
    🏔️ ===============================================
       ESCURSIONI & NATURA - Statistiche Debug
       Guide: ${document.querySelectorAll('.escursioni-professional-card:not(.escursioni-load-more)').length}
       Filtri: ${document.querySelectorAll('.escursioni-filter-group').length}
       Tipologie: Trekking, Forest Bathing, Mindfulness, Birdwatching, Fotografia
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const tipologiaOptions = document.querySelectorAll('input[name="tipologia"]').length;
    const difficoltaOptions = document.querySelectorAll('input[name="difficolta"]').length;
    const certificazioniOptions = document.querySelectorAll('input[name="certificazioni"]').length;

    console.log(`📊 Filtri disponibili: ${tipologiaOptions} tipologie, ${difficoltaOptions} difficoltà, ${certificazioniOptions} certificazioni`);
});