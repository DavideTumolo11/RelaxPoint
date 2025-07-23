// ===== GRAVIDANZA & NEO-MAMME - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('🤱 Gravidanza & Neo-mamme - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.gravidanza-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Gravidanza & Neo-mamme resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.gravidanza-filters input[type="checkbox"], .gravidanza-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select (prezzo, distanza)
        const manualFilters = document.querySelectorAll('.gravidanza-price-input, .gravidanza-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.gravidanza-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('gravidanza-load-more')) return;

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
            fase: getCheckedValues('input[name="fase"]:checked'),
            specializzazione: getCheckedValues('input[name="specializzazione"]:checked'),
            trimestre: getCheckedValues('input[name="trimestre"]:checked'),
            certificazioni: getCheckedValues('input[name="certificazioni"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.gravidanza-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.gravidanza-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.gravidanza-distance-select')?.value) || 50
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
                if (m === 'online') return cardText.includes('online') || cardText.includes('consulenza');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Fase
        if (filters.fase.length > 0) {
            const hasFase = filters.fase.some(f => {
                switch (f) {
                    case 'gravidanza':
                        return cardText.includes('prenatale') || cardText.includes('gravidanza') || cardText.includes('prenascita');
                    case 'post-parto':
                        return cardText.includes('post-parto') || cardText.includes('post parto') || cardText.includes('baby blues');
                    case 'neonato':
                        return cardText.includes('baby') || cardText.includes('neonato') || cardText.includes('0-') || cardText.includes('svezzamento');
                    case 'famiglia':
                        return cardText.includes('famiglia') || cardText.includes('coppia') || cardText.includes('primo soccorso');
                    default:
                        return false;
                }
            });
            if (!hasFase) return false;
        }

        // Specializzazione
        if (filters.specializzazione.length > 0) {
            const hasSpecializzazione = filters.specializzazione.some(s => {
                switch (s) {
                    case 'massaggi':
                        return cardText.includes('massaggi') || cardText.includes('massaggio') || cardText.includes('riflessologia');
                    case 'yoga':
                        return cardText.includes('yoga') || cardText.includes('respirazione') || cardText.includes('movimento');
                    case 'consulenze':
                        return cardText.includes('consulenza') || cardText.includes('ostetrica') || cardText.includes('allattamento');
                    case 'corsi':
                        return cardText.includes('corso') || cardText.includes('preparazione') || cardText.includes('formazione');
                    case 'baby-care':
                        return cardText.includes('baby') || cardText.includes('puericultura') || cardText.includes('svezzamento');
                    default:
                        return false;
                }
            });
            if (!hasSpecializzazione) return false;
        }

        // Certificazioni
        if (filters.certificazioni.length > 0) {
            const hasCertificazioni = filters.certificazioni.some(c => {
                switch (c) {
                    case 'ostetrica':
                        return cardText.includes('ostetrica');
                    case 'doula':
                        return cardText.includes('doula');
                    case 'puericultura':
                        return cardText.includes('puericultura') || cardText.includes('puericultrice');
                    case 'yoga-prenatale':
                        return cardText.includes('yoga') && (cardText.includes('prenatale') || cardText.includes('gravidanza'));
                    default:
                        return false;
                }
            });
            if (!hasCertificazioni) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.gravidanza-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('gravidanza-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.gravidanza-filters input[type="checkbox"], .gravidanza-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.gravidanza-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.gravidanza-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.gravidanza-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Specialisti trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.gravidanza-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Gravidanza & Neo-mamme toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.gravidanza-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.gravidanza-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-').replace('dott.ssa', '').replace('dott.', '');

                console.log(`Vai al profilo Gravidanza: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.gravidanza-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.gravidanza-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Gravidanza con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=gravidanza`;
            });
        });

        // Click su card
        document.querySelectorAll('.gravidanza-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Gravidanza clicked: ${name}`);
                // Vai al profilo
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.gravidanza-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Gravidanza: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.gravidanza-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.gravidanza-professional-card')).filter(card =>
            !card.classList.contains('gravidanza-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.gravidanza-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.gravidanza-rating-value')?.textContent) || 0;
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
                    const premiumA = a.classList.contains('gravidanza-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('gravidanza-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.gravidanza-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.gravidanza-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.gravidanza-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.gravidanza-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.gravidanza-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.gravidanza-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri specialisti Gravidanza...');

                    this.textContent = 'Carica altri specialisti';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.gravidanza-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 28 risultati';
                    }

                    // Simula fine risultati dopo qualche caricamento
                    // In produzione: gestire con API

                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA GRAVIDANZA
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
            document.querySelectorAll('.gravidanza-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.gravidanza-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('gravidanza-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Gravidanza & Neo-mamme
            const isMatch = cardText.includes(query) ||
                query.includes('ostetrica') && cardText.includes('ostetrica') ||
                query.includes('doula') && cardText.includes('doula') ||
                query.includes('baby') && cardText.includes('baby') ||
                query.includes('prenatale') && cardText.includes('prenatale') ||
                query.includes('gravidanza') && cardText.includes('gravidanza') ||
                query.includes('allattamento') && cardText.includes('allattamento') ||
                query.includes('yoga') && cardText.includes('yoga');

            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }



    // FILTRI DINAMICI PER TRIMESTRE
    function initializeDynamicFilters() {
        const gravidanzaCheckbox = document.querySelector('input[name="fase"][value="gravidanza"]');
        const trimestreGroup = document.querySelector('.gravidanza-filter-group:has(input[name="trimestre"])');

        if (gravidanzaCheckbox && trimestreGroup) {
            const toggleTrimestreVisibility = () => {
                if (gravidanzaCheckbox.checked) {
                    trimestreGroup.style.display = 'block';
                } else {
                    trimestreGroup.style.display = 'none';
                    // Reset trimestre quando gravidanza non è selezionata
                    document.querySelectorAll('input[name="trimestre"]').forEach(input => {
                        input.checked = false;
                    });
                }
            };

            gravidanzaCheckbox.addEventListener('change', toggleTrimestreVisibility);

            // Inizializza stato
            toggleTrimestreVisibility();
        }
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

    // INIZIALIZZA FILTRI DINAMICI
    initializeDynamicFilters();

    // INIZIALIZZAZIONE FINALE
    console.log('✅ Gravidanza & Neo-mamme - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.gravidanza-professional-card:not(.gravidanza-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - GRAVIDANZA
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.gravidanza-professional-card img, .gravidanza-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-gravidanza.jpg';
            this.alt = 'Gravidanza - Immagine non disponibile';
            console.log('⚠️ Immagine Gravidanza sostituita con placeholder');
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
    🤱 ===============================================
       GRAVIDANZA & NEO-MAMME - Statistiche Debug
       Specialisti: ${document.querySelectorAll('.gravidanza-professional-card:not(.gravidanza-load-more)').length}
       Filtri: ${document.querySelectorAll('.gravidanza-filter-group').length}
       Specializzazioni: Massaggi, Yoga, Consulenze, Corsi, Baby Care
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const faseOptions = document.querySelectorAll('input[name="fase"]').length;
    const specializzazioneOptions = document.querySelectorAll('input[name="specializzazione"]').length;
    const certificazioniOptions = document.querySelectorAll('input[name="certificazioni"]').length;

    console.log(`📊 Filtri disponibili: ${faseOptions} fasi, ${specializzazioneOptions} specializzazioni, ${certificazioniOptions} certificazioni`);
});