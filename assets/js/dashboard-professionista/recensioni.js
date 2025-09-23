/* ===============================================
   RELAXPOINT - JAVASCRIPT RECENSIONI PROFESSIONISTA
   Versione corretta che funziona con l'HTML esistente
   =============================================== */

console.log('Caricamento recensioni JavaScript...');

// ===============================================
// FUNZIONI GLOBALI - Chiamate direttamente dall'HTML
// ===============================================

// Mostra form risposta
function replyToReview(reviewId) {
    console.log('Aprendo form risposta per:', reviewId);

    const replyForm = document.getElementById('replyForm' + reviewId);
    if (replyForm) {
        replyForm.style.display = 'block';

        // Focus sulla textarea
        const textarea = replyForm.querySelector('.reply-textarea');
        if (textarea) {
            textarea.focus();
            // Aggiorna contatore caratteri
            updateCharCount(textarea, reviewId);
        }

        console.log('Form risposta mostrato per:', reviewId);
        showMessage('Form risposta aperto', 'success');
    } else {
        console.error('Form risposta non trovato:', 'replyForm' + reviewId);
        showMessage('Errore: form non trovato', 'error');
    }
}

// Nascondi form risposta
function cancelReply(reviewId) {
    console.log('Chiudendo form risposta per:', reviewId);

    const replyForm = document.getElementById('replyForm' + reviewId);
    if (replyForm) {
        replyForm.style.display = 'none';

        // Reset textarea
        const textarea = replyForm.querySelector('.reply-textarea');
        if (textarea) {
            textarea.value = '';
            updateCharCount(textarea, reviewId);
        }

        console.log('Form risposta nascosto per:', reviewId);
        showMessage('Risposta cancellata', 'info');
    }
}

// Invia risposta
function sendReply(reviewId) {
    console.log('Inviando risposta per:', reviewId);

    const replyForm = document.getElementById('replyForm' + reviewId);
    if (!replyForm) {
        console.error('Form non trovato per:', reviewId);
        showMessage('Errore: form non trovato', 'error');
        return;
    }

    const textarea = replyForm.querySelector('.reply-textarea');
    if (!textarea || !textarea.value.trim()) {
        showMessage('Inserisci una risposta prima di inviare', 'error');
        return;
    }

    const replyText = textarea.value.trim();
    if (replyText.length > 300) {
        showMessage('La risposta non può superare i 300 caratteri', 'error');
        return;
    }

    // Trova il bottone e mostra loading
    const sendButton = replyForm.querySelector('.btn-primary');
    if (sendButton) {
        const originalText = sendButton.textContent;
        sendButton.textContent = 'Invio...';
        sendButton.disabled = true;

        // Simula invio
        setTimeout(() => {
            // Trova la review card
            const reviewCard = replyForm.closest('.review-card');
            if (reviewCard) {
                // Cambia stato
                reviewCard.classList.remove('pending');
                reviewCard.classList.add('replied');

                // Aggiorna badge
                const statusBadge = reviewCard.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = 'Risposta Inviata';
                    statusBadge.className = 'status-badge replied';
                }

                // Nascondi form e azioni
                replyForm.style.display = 'none';
                const reviewActions = reviewCard.querySelector('.review-actions');
                if (reviewActions) {
                    reviewActions.style.display = 'none';
                }

                // Aggiungi risposta professionale
                const professionalReply = document.createElement('div');
                professionalReply.className = 'professional-reply';
                professionalReply.innerHTML = `
                    <div class="reply-header">
                        <strong>La tua risposta:</strong>
                        <span class="reply-date">Ora</span>
                    </div>
                    <p class="reply-text">${escapeHtml(replyText)}</p>
                `;

                // Aggiungi dopo il contenuto della recensione
                const reviewContent = reviewCard.querySelector('.review-content');
                if (reviewContent) {
                    reviewContent.appendChild(professionalReply);
                }
            }

            showMessage('Risposta inviata con successo!', 'success');
            console.log('Risposta inviata per:', reviewId);

            // Ripristina bottone
            sendButton.textContent = originalText;
            sendButton.disabled = false;
        }, 1500);
    }
}

// Segnala recensione
function reportReview(reviewId) {
    console.log('Segnalando recensione:', reviewId);

    if (confirm('Sei sicuro di voler segnalare questa recensione come inappropriata?')) {
        showMessage('Recensione segnalata. Sarà esaminata dal nostro team', 'info');
        console.log('Recensione segnalata:', reviewId);
    }
}

// Pulisci filtri
function clearFilters() {
    console.log('Pulendo filtri...');

    ['ratingFilter', 'periodFilter', 'statusFilter'].forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.value = '';
        }
    });

    // Mostra tutte le recensioni
    const allReviews = document.querySelectorAll('.review-card');
    allReviews.forEach(review => {
        review.style.display = 'block';
    });

    showMessage('Filtri rimossi', 'info');
    console.log('Filtri puliti');
}

// ===============================================
// FUNZIONI UTILITY
// ===============================================

// Aggiorna contatore caratteri
function updateCharCount(textarea, reviewId) {
    const maxLength = 300;
    const currentLength = textarea.value.length;
    const charCountElement = document.getElementById('charCount' + reviewId);

    if (charCountElement) {
        charCountElement.textContent = currentLength;

        // Cambia colore in base alla lunghezza
        if (currentLength > maxLength * 0.9) {
            charCountElement.style.color = '#dc2626';
        } else if (currentLength > maxLength * 0.8) {
            charCountElement.style.color = '#f59e0b';
        } else {
            charCountElement.style.color = '#64748b';
        }
    }
}

// Escape HTML per sicurezza
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Sistema messaggi
function showMessage(message, type = 'info') {
    console.log('Messaggio:', message, type);

    // Rimuovi messaggi esistenti
    const existing = document.querySelectorAll('.temp-message');
    existing.forEach(msg => msg.remove());

    // Crea nuovo messaggio
    const messageDiv = document.createElement('div');
    messageDiv.className = 'temp-message';
    messageDiv.textContent = message;

    // Stili messaggio
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10000',
        minWidth: '250px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });

    // Colori per tipo
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    messageDiv.style.backgroundColor = colors[type] || colors.info;

    // Aggiungi al DOM
    document.body.appendChild(messageDiv);

    // Rimuovi dopo 3 secondi
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Filtra recensioni
function filterReviews() {
    const ratingFilter = document.getElementById('ratingFilter').value;
    const periodFilter = document.getElementById('periodFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    console.log('Applicando filtri:', { ratingFilter, periodFilter, statusFilter });

    const allReviews = document.querySelectorAll('.review-card');
    let visibleCount = 0;

    allReviews.forEach(review => {
        let shouldShow = true;

        // Filtro rating
        if (ratingFilter && review.dataset.rating !== ratingFilter) {
            shouldShow = false;
        }

        // Filtro periodo
        if (periodFilter && review.dataset.period !== periodFilter) {
            shouldShow = false;
        }

        // Filtro stato
        if (statusFilter && review.dataset.status !== statusFilter) {
            shouldShow = false;
        }

        // Mostra/nascondi recensione
        if (shouldShow) {
            review.style.display = 'block';
            visibleCount++;
        } else {
            review.style.display = 'none';
        }
    });

    console.log(`Filtri applicati: ${visibleCount} recensioni visibili`);
    showMessage(`Mostrando ${visibleCount} recensioni`, 'info');
}

// Cambia pagina
function changePage(page) {
    console.log('Cambiando pagina a:', page);

    // Aggiorna bottoni attivi
    document.querySelectorAll('.pagination-number').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page.toString()) {
            btn.classList.add('active');
        }
    });

    // Aggiorna bottoni precedente/successivo
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.disabled = (page === 1);
    }

    if (nextBtn) {
        nextBtn.disabled = (page === 12); // Assumendo 12 pagine totali
    }

    // Scroll in alto
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showMessage(`Pagina ${page} caricata`, 'info');
}

// ===============================================
// SETUP AL CARICAMENTO PAGINA
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM caricato, inizializzando recensioni...');

    // 1. Setup bottone pulisci filtri
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', function (e) {
            e.preventDefault();
            clearFilters();
        });
        console.log('Bottone pulisci filtri collegato');
    } else {
        console.log('Bottone clearFilters non trovato');
    }

    // 2. Setup auto-apply filtri (senza bisogno di bottone applica)
    ['ratingFilter', 'periodFilter', 'statusFilter'].forEach(filterId => {
        const select = document.getElementById(filterId);
        if (select) {
            select.addEventListener('change', function () {
                const filterName = filterId.replace('Filter', '');
                const value = this.value;
                console.log(`Filtro ${filterName} cambiato a:`, value || 'Tutti');
                filterReviews();
            });
            console.log(`Filtro ${filterId} collegato`);
        } else {
            console.log(`Filtro ${filterId} NON trovato`);
        }
    });

    // 3. Setup contatori caratteri su tutte le textarea
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('reply-textarea')) {
            const textarea = e.target;
            const replyForm = textarea.closest('.reply-form');
            if (replyForm) {
                const reviewId = replyForm.id.replace('replyForm', '');
                updateCharCount(textarea, reviewId);
            }
        }
    });
    console.log('Contatori caratteri collegati');

    // 4. Setup paginazione
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    paginationNumbers.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            changePage(page);
        });
    });

    // Setup bottoni precedente/successivo
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!this.disabled) {
                const currentPage = parseInt(document.querySelector('.pagination-number.active').dataset.page);
                changePage(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!this.disabled) {
                const currentPage = parseInt(document.querySelector('.pagination-number.active').dataset.page);
                changePage(currentPage + 1);
            }
        });
    }

    console.log('Paginazione collegata');

    // 5. Test iniziale per verificare che tutto funzioni
    console.log('=== TEST ELEMENTI PAGINA ===');
    console.log('Filtri trovati:', {
        rating: !!document.getElementById('ratingFilter'),
        period: !!document.getElementById('periodFilter'),
        status: !!document.getElementById('statusFilter'),
        clear: !!document.getElementById('clearFilters')
    });

    console.log('Form risposta trovati:', {
        replyForm1: !!document.getElementById('replyForm1'),
        replyForm3: !!document.getElementById('replyForm3'),
        replyForm4: !!document.getElementById('replyForm4')
    });

    console.log('Contatori caratteri trovati:', {
        charCount1: !!document.getElementById('charCount1'),
        charCount3: !!document.getElementById('charCount3'),
        charCount4: !!document.getElementById('charCount4')
    });

    console.log('Recensioni trovate:', document.querySelectorAll('.review-card').length);

    // Messaggio di completamento
    showMessage('Recensioni caricate correttamente', 'success');
    console.log('Setup recensioni completato!');
});

console.log('Recensioni JavaScript caricato completamente');