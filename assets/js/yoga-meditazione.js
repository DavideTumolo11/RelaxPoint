// ===== YOGA & MEDITAZIONE - JS COMPLETO =====

document.addEventListener('DOMContentLoaded', function () {
    console.log('[INIT] Yoga & Meditazione - JavaScript caricato');

    // INIZIALIZZAZIONE
    initializeFilters();
    initializeProfessionalCards();
    initializeSorting();
    initializeLoadMore();
    initializeSearch();
    initializeSmartFilters();

    // GESTIONE FILTRI
    function initializeFilters() {
        const resetBtn = document.querySelector('.yoga-reset-filters');

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetAllFilters();
                applyFilters();
                console.log('Filtri Yoga & Meditazione resettati');
            });
        }

        // Auto-apply sui cambi per checkbox/radio
        const autoFilters = document.querySelectorAll('.yoga-filters input[type="checkbox"], .yoga-filters input[type="radio"]');
        autoFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });

        // Apply manuale per input numerici e select
        const manualFilters = document.querySelectorAll('.yoga-price-input, .yoga-distance-select');
        manualFilters.forEach(filter => {
            filter.addEventListener('change', function () {
                setTimeout(() => applyFilters(), 100);
            });
        });
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.yoga-professional-card');
        const filters = getActiveFilters();
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('yoga-load-more')) return;

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
            stile: getCheckedValues('input[name="stile"]:checked'),
            pratica: getCheckedValues('input[name="pratica"]:checked'),
            livello: getCheckedValues('input[name="livello"]:checked'),
            obiettivo: getCheckedValues('input[name="obiettivo"]:checked'),
            rating: getCheckedValue('input[name="rating"]:checked'),
            minPrice: parseInt(document.querySelector('.yoga-price-input[placeholder="Min €"]')?.value) || 0,
            maxPrice: parseInt(document.querySelector('.yoga-price-input[placeholder="Max €"]')?.value) || 999,
            maxDistance: parseInt(document.querySelector('.yoga-distance-select')?.value) || 50
        };
    }

    function matchesFilters(card, filters) {
        const cardText = card.textContent.toLowerCase();

        // Modalità Servizio
        if (filters.modalita.length > 0) {
            const hasModalita = filters.modalita.some(m => {
                if (m === 'domicilio') return cardText.includes('domicilio');
                if (m === 'studio') return cardText.includes('studio');
                if (m === 'outdoor') return cardText.includes('outdoor') || cardText.includes('parchi') || cardText.includes('natura');
                if (m === 'online') return cardText.includes('online') || cardText.includes('virtuale');
                return false;
            });
            if (!hasModalita) return false;
        }

        // Stile Yoga
        if (filters.stile.length > 0) {
            const hasStile = filters.stile.some(s => {
                switch (s) {
                    case 'hatha':
                        return cardText.includes('hatha');
                    case 'vinyasa':
                        return cardText.includes('vinyasa') || cardText.includes('flow');
                    case 'yin':
                        return cardText.includes('yin') || cardText.includes('rilassante');
                    case 'kundalini':
                        return cardText.includes('kundalini');
                    case 'restorative':
                        return cardText.includes('restorative') || cardText.includes('rilassamento');
                    default:
                        return false;
                }
            });
            if (!hasStile) return false;
        }

        // Tipo Pratica
        if (filters.pratica.length > 0) {
            const hasPratica = filters.pratica.some(p => {
                switch (p) {
                    case 'solo-yoga':
                        return cardText.includes('yoga') && !cardText.includes('meditazione');
                    case 'solo-meditazione':
                        return cardText.includes('meditazione') && !cardText.includes('yoga');
                    case 'yoga-meditazione':
                        return cardText.includes('yoga') && cardText.includes('meditazione');
                    case 'terapie-energetiche':
                        return cardText.includes('reiki') || cardText.includes('chakra') || cardText.includes('energetiche');
                    case 'sound-healing':
                        return cardText.includes('sound') || cardText.includes('bagni sonori') || cardText.includes('tibetani');
                    default:
                        return false;
                }
            });
            if (!hasPratica) return false;
        }

        // Livello
        if (filters.livello.length > 0) {
            const hasLivello = filters.livello.some(l => {
                switch (l) {
                    case 'principiante':
                        return cardText.includes('principiante') || cardText.includes('base') || cardText.includes('beginner');
                    case 'base':
                        return cardText.includes('base') || cardText.includes('hatha');
                    case 'intermedio':
                        return cardText.includes('intermedio') || cardText.includes('vinyasa');
                    case 'avanzato':
                        return cardText.includes('avanzato') || cardText.includes('power');
                    case 'esperto':
                        return cardText.includes('esperto') || cardText.includes('teacher') || cardText.includes('master');
                    default:
                        return false;
                }
            });
            if (!hasLivello) return false;
        }

        // Obiettivo
        if (filters.obiettivo.length > 0) {
            const hasObiettivo = filters.obiettivo.some(o => {
                switch (o) {
                    case 'riduzione-stress':
                        return cardText.includes('stress') || cardText.includes('mindfulness') || cardText.includes('rilassamento');
                    case 'flessibilita':
                        return cardText.includes('flessibilità') || cardText.includes('stretching') || cardText.includes('yin');
                    case 'forza-equilibrio':
                        return cardText.includes('forza') || cardText.includes('equilibrio') || cardText.includes('power');
                    case 'rilassamento':
                        return cardText.includes('rilassamento') || cardText.includes('nidra') || cardText.includes('restorative');
                    case 'crescita-spirituale':
                        return cardText.includes('spirituale') || cardText.includes('kundalini') || cardText.includes('chakra');
                    default:
                        return false;
                }
            });
            if (!hasObiettivo) return false;
        }

        // Rating
        if (filters.rating) {
            const ratingValue = parseFloat(card.querySelector('.yoga-rating-value')?.textContent) || 0;
            switch (filters.rating) {
                case '4plus':
                    if (ratingValue < 4.0) return false;
                    break;
                case '45plus':
                    if (ratingValue < 4.5) return false;
                    break;
                case 'premium':
                    if (!card.classList.contains('yoga-premium')) return false;
                    break;
            }
        }

        return true;
    }

    function resetAllFilters() {
        document.querySelectorAll('.yoga-filters input[type="checkbox"], .yoga-filters input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        document.querySelectorAll('.yoga-price-input').forEach(input => {
            input.value = '';
        });

        const distanceSelect = document.querySelector('.yoga-distance-select');
        if (distanceSelect) distanceSelect.value = '10';

        // Reset default: domicilio
        const domicilioCheckbox = document.querySelector('input[name="modalita"][value="domicilio"]');
        if (domicilioCheckbox) domicilioCheckbox.checked = true;
    }

    function updateResultsCount(count) {
        const resultsTitle = document.querySelector('.yoga-results-info h2');
        if (resultsTitle) {
            resultsTitle.textContent = `${count} Insegnanti trovati`;
        }
    }

    // GESTIONE CARDS PROFESSIONISTI
    function initializeProfessionalCards() {
        // Pulsanti preferiti
        document.querySelectorAll('.yoga-favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('active');

                // Animazione
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                console.log('Preferito Yoga & Meditazione toggled');
            });
        });

        // Pulsanti profilo
        document.querySelectorAll('.yoga-profile-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.yoga-professional-card');
                const name = card.querySelector('h3').textContent;
                const slug = name.toLowerCase().replace(/\s+/g, '-');

                console.log(`Vai al profilo Yoga: ${name}`);
                // window.location.href = `/pages/professionista/${slug}.html`;
            });
        });

        // Pulsanti prenota
        document.querySelectorAll('.yoga-book-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = this.closest('.yoga-professional-card');
                const name = card.querySelector('h3').textContent;

                console.log(`Prenota Yoga con: ${name}`);
                // window.location.href = `/pages/prenotazione/prenota.html?prof=${name}&service=yoga`;
            });
        });

        // Click su card
        document.querySelectorAll('.yoga-professional-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;

                const name = this.querySelector('h3').textContent;
                console.log(`Card Yoga clicked: ${name}`);
            });
        });
    }

    // ORDINAMENTO
    function initializeSorting() {
        const sortSelect = document.querySelector('.yoga-sort-select');

        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const sortBy = this.value;
                sortProfessionals(sortBy);
                console.log(`Ordinamento Yoga: ${sortBy}`);
            });
        }
    }

    function sortProfessionals(sortBy) {
        const container = document.querySelector('.yoga-professionals-grid');
        const cards = Array.from(container.querySelectorAll('.yoga-professional-card')).filter(card =>
            !card.classList.contains('yoga-load-more')
        );

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.yoga-rating-value')?.textContent) || 0;
                    const ratingB = parseFloat(b.querySelector('.yoga-rating-value')?.textContent) || 0;
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
                    const premiumA = a.classList.contains('yoga-premium') ? 1 : 0;
                    const premiumB = b.classList.contains('yoga-premium') ? 1 : 0;
                    if (premiumA !== premiumB) return premiumB - premiumA;

                    const ratingA2 = parseFloat(a.querySelector('.yoga-rating-value')?.textContent) || 0;
                    const ratingB2 = parseFloat(b.querySelector('.yoga-rating-value')?.textContent) || 0;
                    return ratingB2 - ratingA2;
            }
        });

        // Riordina DOM
        cards.forEach(card => container.appendChild(card));

        // Mantieni load-more alla fine
        const loadMore = container.querySelector('.yoga-load-more');
        if (loadMore) container.appendChild(loadMore);
    }

    function getMinPrice(card) {
        const pricingText = card.querySelector('.yoga-pricing')?.textContent || '';
        const prices = pricingText.match(/€(\d+)/g);
        if (prices && prices.length > 0) {
            return Math.min(...prices.map(p => parseInt(p.replace('€', ''))));
        }
        return 999;
    }

    function getDistance(card) {
        const distanceText = card.querySelector('.yoga-distance')?.textContent || '';
        const match = distanceText.match(/(\d+\.?\d*)\s*km/);
        return match ? parseFloat(match[1]) : 999;
    }

    // LOAD MORE
    function initializeLoadMore() {
        const loadMoreBtn = document.querySelector('.yoga-load-more-btn');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function () {
                this.textContent = 'Caricamento...';
                this.disabled = true;

                setTimeout(() => {
                    console.log('Caricamento altri insegnanti Yoga...');

                    this.textContent = 'Carica altri insegnanti';
                    this.disabled = false;

                    // Aggiorna contatore
                    const info = document.querySelector('.yoga-load-more p');
                    if (info) {
                        info.textContent = 'Mostrando 12 di 34 risultati';
                    }
                }, 1000);
            });
        }
    }

    // RICERCA SPECIALIZZATA YOGA
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
            document.querySelectorAll('.yoga-professional-card').forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        const cards = document.querySelectorAll('.yoga-professional-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (card.classList.contains('yoga-load-more')) return;

            const cardText = card.textContent.toLowerCase();

            // Ricerca specifica per Yoga & Meditazione
            const isMatch = cardText.includes(query) ||
                query.includes('yoga') && cardText.includes('yoga') ||
                query.includes('meditazione') && cardText.includes('meditazione') ||
                query.includes('hatha') && cardText.includes('hatha') ||
                query.includes('vinyasa') && cardText.includes('vinyasa') ||
                query.includes('yin') && cardText.includes('yin') ||
                query.includes('mindfulness') && cardText.includes('mindfulness') ||
                query.includes('reiki') && cardText.includes('reiki') ||
                query.includes('sound') && cardText.includes('sound');

            if (isMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount(visibleCount);
    }

    // FILTRI SMART YOGA
    function initializeSmartFilters() {
        // Auto-suggerimenti intelligenti
        const stressCheckbox = document.querySelector('input[name="obiettivo"][value="riduzione-stress"]');
        const rilassamentoCheckbox = document.querySelector('input[name="obiettivo"][value="rilassamento"]');

        if (stressCheckbox) {
            stressCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    // Auto-suggerisci stili rilassanti
                    const yinCheckbox = document.querySelector('input[name="stile"][value="yin"]');
                    const meditazioneCheckbox = document.querySelector('input[name="pratica"][value="solo-meditazione"]');

                    if (yinCheckbox && !yinCheckbox.checked) {
                        yinCheckbox.style.background = '#dcfce7';
                        setTimeout(() => yinCheckbox.style.background = '', 2000);
                    }
                }
            });
        }

        if (rilassamentoCheckbox) {
            rilassamentoCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    // Auto-suggerisci pratiche rilassanti
                    const restorativeCheckbox = document.querySelector('input[name="stile"][value="restorative"]');
                    const energeticheCheckbox = document.querySelector('input[name="pratica"][value="terapie-energetiche"]');

                    if (restorativeCheckbox && !restorativeCheckbox.checked) {
                        restorativeCheckbox.style.background = '#dcfce7';
                        setTimeout(() => restorativeCheckbox.style.background = '', 2000);
                    }
                }
            });
        }

        // Filtri dinamici per principianti
        const principianteCheckbox = document.querySelector('input[name="livello"][value="principiante"]');
        if (principianteCheckbox) {
            principianteCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    // Auto-suggerisci Hatha per principianti
                    const hathaCheckbox = document.querySelector('input[name="stile"][value="hatha"]');
                    if (hathaCheckbox && !hathaCheckbox.checked) {
                        hathaCheckbox.style.background = '#dcfce7';
                        setTimeout(() => hathaCheckbox.style.background = '', 2000);
                    }
                }
            });
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

    // INIZIALIZZAZIONE FINALE
    console.log('✅ Yoga & Meditazione - Tutto inizializzato');

    // Conteggio iniziale
    updateResultsCount(document.querySelectorAll('.yoga-professional-card:not(.yoga-load-more)').length);
});

// GESTIONE ERRORI IMMAGINI - YOGA
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.yoga-professional-card img, .yoga-hero-image img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/assets/images/placeholder-yoga.jpg';
            this.alt = 'Yoga - Immagine non disponibile';
            console.log('[WARNING] Immagine Yoga sostituita con placeholder');
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
    🧘 ===============================================
       YOGA & MEDITAZIONE - Statistiche Debug
       Insegnanti: ${document.querySelectorAll('.yoga-professional-card:not(.yoga-load-more)').length}
       Filtri: ${document.querySelectorAll('.yoga-filter-group').length}
       Discipline: Hatha, Vinyasa, Yin, Kundalini, Reiki, Sound Healing
       Build: ${new Date().toISOString().split('T')[0]}
    ===============================================
    `);

    // Statistiche filtri
    const stileOptions = document.querySelectorAll('input[name="stile"]').length;
    const praticaOptions = document.querySelectorAll('input[name="pratica"]').length;
    const livelloOptions = document.querySelectorAll('input[name="livello"]').length;
    const obiettivoOptions = document.querySelectorAll('input[name="obiettivo"]').length;

    console.log(`📊 Filtri disponibili: ${stileOptions} stili, ${praticaOptions} pratiche, ${livelloOptions} livelli, ${obiettivoOptions} obiettivi`);

    // Verifica filtri smart attivi
    const smartFiltersCount = document.querySelectorAll('input[name="obiettivo"], input[name="livello"]').length;
    console.log(`🤖 Sistema filtri smart: ${smartFiltersCount} filtri con auto-suggerimenti attivi`);

    // Performance check
    const loadTime = performance.now();
    console.log(`[FAST] Tempo caricamento JavaScript: ${loadTime.toFixed(2)}ms`);
});