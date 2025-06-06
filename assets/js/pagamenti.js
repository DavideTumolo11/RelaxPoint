/**
 * ===============================================
 * RELAXPOINT - JAVASCRIPT PAGAMENTI
 * Gestione completa pagamenti cliente
 * ===============================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // ===============================================
    // VARIABILI GLOBALI
    // ===============================================
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const addPaymentModal = document.getElementById('addPaymentModal');
    const closeAddPaymentModal = document.getElementById('closeAddPaymentModal');
    const cancelAddPayment = document.getElementById('cancelAddPayment');
    const savePaymentMethod = document.getElementById('savePaymentMethod');

    const useCashbackBtn = document.getElementById('useCashbackBtn');
    const cashbackHistoryBtn = document.getElementById('cashbackHistoryBtn');
    const changePaymentBtn = document.getElementById('changePaymentBtn');
    const cancelSubscriptionBtn = document.getElementById('cancelSubscriptionBtn');

    const statusFilterPay = document.getElementById('statusFilterPay');
    const typeFilter = document.getElementById('typeFilter');
    const periodFilterPay = document.getElementById('periodFilterPay');

    // ===============================================
    // MODAL GESTIONE
    // ===============================================
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Event listeners per modal
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', () => {
            openModal(addPaymentModal);
        });
    }

    if (closeAddPaymentModal) {
        closeAddPaymentModal.addEventListener('click', () => {
            closeModal(addPaymentModal);
        });
    }

    if (cancelAddPayment) {
        cancelAddPayment.addEventListener('click', () => {
            closeModal(addPaymentModal);
        });
    }

    // Chiudi modal cliccando fuori
    if (addPaymentModal) {
        addPaymentModal.addEventListener('click', (e) => {
            if (e.target === addPaymentModal) {
                closeModal(addPaymentModal);
            }
        });
    }

    // ===============================================
    // GESTIONE TIPI PAGAMENTO MODAL
    // ===============================================
    const paymentTypeBtns = document.querySelectorAll('.payment-type-btn');
    const cardForm = document.getElementById('cardForm');

    paymentTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Rimuovi active da tutti
            paymentTypeBtns.forEach(b => b.classList.remove('active'));
            // Aggiungi active al cliccato
            btn.classList.add('active');

            const type = btn.dataset.type;
            if (type === 'card') {
                cardForm.style.display = 'flex';
            } else {
                cardForm.style.display = 'none';
            }
        });
    });

    // ===============================================
    // FORMATTAZIONE INPUT CARTA
    // ===============================================
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // ===============================================
    // SALVATAGGIO METODO PAGAMENTO
    // ===============================================
    if (savePaymentMethod) {
        savePaymentMethod.addEventListener('click', () => {
            const activeType = document.querySelector('.payment-type-btn.active');
            const type = activeType ? activeType.dataset.type : 'card';

            if (type === 'card') {
                const cardNumber = document.getElementById('cardNumber').value;
                const cardExpiry = document.getElementById('cardExpiry').value;
                const cardCvv = document.getElementById('cardCvv').value;
                const cardHolder = document.getElementById('cardHolder').value;

                if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
                    showNotification('Compila tutti i campi della carta', 'error');
                    return;
                }

                // Validazione base
                if (cardNumber.replace(/\s/g, '').length < 13) {
                    showNotification('Numero carta non valido', 'error');
                    return;
                }

                if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                    showNotification('Data scadenza non valida', 'error');
                    return;
                }

                if (cardCvv.length < 3) {
                    showNotification('CVV non valido', 'error');
                    return;
                }
            }

            // Simula salvataggio
            showNotification('Metodo di pagamento aggiunto con successo', 'success');
            closeModal(addPaymentModal);

            // Reset form
            setTimeout(() => {
                resetPaymentForm();
            }, 300);
        });
    }

    function resetPaymentForm() {
        const inputs = document.querySelectorAll('#cardForm input');
        inputs.forEach(input => input.value = '');

        paymentTypeBtns.forEach(btn => btn.classList.remove('active'));
        paymentTypeBtns[0]?.classList.add('active');

        if (cardForm) {
            cardForm.style.display = 'flex';
        }
    }

    // ===============================================
    // GESTIONE CASHBACK
    // ===============================================
    if (useCashbackBtn) {
        useCashbackBtn.addEventListener('click', () => {
            const balance = document.getElementById('cashbackBalance');
            const currentBalance = parseFloat(balance.textContent.replace('€', ''));

            if (currentBalance < 5) {
                showNotification('Saldo cashback insufficiente (minimo €5)', 'error');
                return;
            }

            showConfirmDialog(
                'Usa Cashback',
                `Vuoi utilizzare €${currentBalance.toFixed(2)} di cashback per la prossima prenotazione?`,
                () => {
                    showNotification('Cashback applicato alla prossima prenotazione', 'success');
                    // Aggiorna UI
                    updateCashbackBalance(0);
                }
            );
        });
    }

    if (cashbackHistoryBtn) {
        cashbackHistoryBtn.addEventListener('click', () => {
            showNotification('Apertura storico cashback...', 'info');
            // Qui andrà la logica per aprire modal storico cashback
        });
    }

    function updateCashbackBalance(newBalance) {
        const balanceElement = document.querySelector('.balance-amount');
        if (balanceElement) {
            balanceElement.textContent = `€${newBalance.toFixed(2)}`;
        }

        // Aggiorna anche nelle statistiche
        const statCashback = document.getElementById('cashbackBalance');
        if (statCashback) {
            statCashback.textContent = `€${newBalance.toFixed(2)}`;
        }
    }

    // ===============================================
    // GESTIONE ABBONAMENTO PREMIUM
    // ===============================================
    if (changePaymentBtn) {
        changePaymentBtn.addEventListener('click', () => {
            openModal(addPaymentModal);
            // Pre-seleziona tipo per abbonamento
            showNotification('Seleziona il nuovo metodo per l\'abbonamento Premium', 'info');
        });
    }

    if (cancelSubscriptionBtn) {
        cancelSubscriptionBtn.addEventListener('click', () => {
            showConfirmDialog(
                'Disdici Abbonamento Premium',
                'Sei sicuro di voler disdire l\'abbonamento Premium? Perderai tutti i vantaggi alla scadenza (15 Giugno 2025).',
                () => {
                    showNotification('Richiesta di disdetta inviata. Riceverai conferma via email.', 'success');
                    // Aggiorna stato Premium
                    updatePremiumStatus('pending_cancellation');
                },
                'Disdici',
                'danger'
            );
        });
    }

    function updatePremiumStatus(status) {
        const statusElement = document.querySelector('.premium-status');
        if (statusElement) {
            statusElement.className = `premium-status ${status}`;

            const statusText = {
                'active': 'Attivo',
                'pending_cancellation': 'In Disdetta',
                'expired': 'Scaduto'
            };

            statusElement.textContent = statusText[status] || 'Sconosciuto';
        }
    }

    // ===============================================
    // FILTRI TRANSAZIONI
    // ===============================================
    const filters = {
        status: 'all',
        type: 'all',
        period: 'all'
    };

    function initializeFilters() {
        if (statusFilterPay) {
            statusFilterPay.addEventListener('change', (e) => {
                filters.status = e.target.value;
                filterTransactions();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                filters.type = e.target.value;
                filterTransactions();
            });
        }

        if (periodFilterPay) {
            periodFilterPay.addEventListener('change', (e) => {
                filters.period = e.target.value;
                filterTransactions();
            });
        }
    }

    function filterTransactions() {
        const rows = document.querySelectorAll('.transaction-row');
        let visibleCount = 0;

        rows.forEach(row => {
            let show = true;

            // Filtro per tipo
            if (filters.type !== 'all') {
                const rowType = row.dataset.type;
                if (rowType !== filters.type) {
                    show = false;
                }
            }

            // Filtro per stato
            if (filters.status !== 'all') {
                const statusBadge = row.querySelector('.status-badge');
                const rowStatus = statusBadge ? statusBadge.textContent.toLowerCase() : '';

                const statusMap = {
                    'completed': ['completato', 'accreditato'],
                    'pending': ['in sospeso', 'pendente'],
                    'refunded': ['rimborsato', 'rimborso']
                };

                if (statusMap[filters.status] && !statusMap[filters.status].some(s => rowStatus.includes(s))) {
                    show = false;
                }
            }

            // Filtro per periodo (implementazione base)
            if (filters.period !== 'all') {
                const dateElement = row.querySelector('.date-main');
                if (dateElement) {
                    const rowDate = parseDate(dateElement.textContent);
                    const now = new Date();

                    switch (filters.period) {
                        case 'this-month':
                            if (rowDate.getMonth() !== now.getMonth() || rowDate.getFullYear() !== now.getFullYear()) {
                                show = false;
                            }
                            break;
                        case 'last-month':
                            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                            if (rowDate.getMonth() !== lastMonth.getMonth() || rowDate.getFullYear() !== lastMonth.getFullYear()) {
                                show = false;
                            }
                            break;
                        case 'this-year':
                            if (rowDate.getFullYear() !== now.getFullYear()) {
                                show = false;
                            }
                            break;
                    }
                }
            }

            row.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        // Aggiorna contatore
        const countBadge = document.getElementById('transactionsCount');
        if (countBadge) {
            countBadge.textContent = visibleCount;
        }
    }

    function parseDate(dateStr) {
        // Parsing per date formato "22 Lug 2024"
        const months = {
            'Gen': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mag': 4, 'Giu': 5,
            'Lug': 6, 'Ago': 7, 'Set': 8, 'Ott': 9, 'Nov': 10, 'Dic': 11
        };

        const parts = dateStr.split(' ');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = months[parts[1]];
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
        }

        return new Date();
    }

    // ===============================================
    // AZIONI TRANSAZIONI
    // ===============================================
    function initializeTransactionActions() {
        // Download fatture
        const invoiceButtons = document.querySelectorAll('.btn-table-action.invoice');
        invoiceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const transactionId = btn.dataset.transactionId;
                downloadInvoice(transactionId);
            });
        });

        // Dettagli transazione
        const detailButtons = document.querySelectorAll('.btn-table-action.details');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const transactionId = btn.dataset.transactionId;
                showTransactionDetails(transactionId);
            });
        });
    }

    function downloadInvoice(transactionId) {
        showNotification('Download fattura in corso...', 'info');

        // Simula download
        setTimeout(() => {
            // Qui andrebbe la logica reale di download
            const link = document.createElement('a');
            link.href = '#'; // URL reale della fattura
            link.download = `fattura-${transactionId}.pdf`;
            // link.click(); // Uncomment per download reale

            showNotification('Fattura scaricata con successo', 'success');
        }, 1000);
    }

    function showTransactionDetails(transactionId) {
        // Trova la riga della transazione
        const row = document.querySelector(`[data-transaction-id="${transactionId}"]`).closest('.transaction-row');

        if (row) {
            const service = row.querySelector('.service-name')?.textContent || '';
            const professional = row.querySelector('.professional-name')?.textContent || '';
            const amount = row.querySelector('.amount-main')?.textContent || '';
            const date = row.querySelector('.date-main')?.textContent || '';
            const time = row.querySelector('.time-detail')?.textContent || '';

            showInfoDialog(
                'Dettagli Transazione',
                `
                <div style="text-align: left;">
                    <p><strong>Servizio:</strong> ${service}</p>
                    <p><strong>Professionista:</strong> ${professional}</p>
                    <p><strong>Data:</strong> ${date} - ${time}</p>
                    <p><strong>Importo:</strong> ${amount}</p>
                    <p><strong>ID Transazione:</strong> TXN-${transactionId.padStart(6, '0')}</p>
                </div>
                `
            );
        }
    }

    // ===============================================
    // MENU CARTE DI PAGAMENTO
    // ===============================================
    function initializeCardMenus() {
        const cardMenuBtns = document.querySelectorAll('.btn-card-menu');

        cardMenuBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardId = btn.dataset.cardId;
                showCardMenu(e, cardId);
            });
        });

        // Chiudi menu cliccando altrove
        document.addEventListener('click', () => {
            closeAllCardMenus();
        });
    }

    function showCardMenu(event, cardId) {
        // Rimuovi menu esistenti
        closeAllCardMenus();

        const menu = document.createElement('div');
        menu.className = 'card-menu-dropdown';
        menu.innerHTML = `
            <button class="menu-item" data-action="set-primary" data-card-id="${cardId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                Imposta come principale
            </button>
            <button class="menu-item" data-action="edit" data-card-id="${cardId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M17.81,9.94"/>
                </svg>
                Modifica
            </button>
            <button class="menu-item danger" data-action="delete" data-card-id="${cardId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
                Rimuovi
            </button>
        `;

        // Posiziona il menu
        const rect = event.target.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        menu.style.zIndex = '1000';

        document.body.appendChild(menu);

        // Event listeners per azioni menu
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                const cardId = item.dataset.cardId;
                handleCardAction(action, cardId);
                closeAllCardMenus();
            });
        });
    }

    function closeAllCardMenus() {
        document.querySelectorAll('.card-menu-dropdown').forEach(menu => {
            menu.remove();
        });
    }

    function handleCardAction(action, cardId) {
        switch (action) {
            case 'set-primary':
                showNotification('Carta impostata come principale', 'success');
                updatePrimaryCard(cardId);
                break;
            case 'edit':
                showNotification('Apertura modifica carta...', 'info');
                // Apri modal di modifica
                break;
            case 'delete':
                showConfirmDialog(
                    'Rimuovi Carta',
                    'Sei sicuro di voler rimuovere questa carta di pagamento?',
                    () => {
                        showNotification('Carta rimossa con successo', 'success');
                        removeCard(cardId);
                    },
                    'Rimuovi',
                    'danger'
                );
                break;
        }
    }

    function updatePrimaryCard(cardId) {
        // Rimuovi badge primary da tutte le carte
        document.querySelectorAll('.primary-badge').forEach(badge => {
            badge.remove();
        });

        document.querySelectorAll('.payment-method-card').forEach(card => {
            card.classList.remove('primary');
        });

        // Aggiungi primary alla carta selezionata
        const targetCard = document.querySelector(`[data-card-id="${cardId}"]`).closest('.payment-method-card');
        if (targetCard) {
            targetCard.classList.add('primary');
            const actions = targetCard.querySelector('.card-actions');
            if (actions && !actions.querySelector('.primary-badge')) {
                const badge = document.createElement('span');
                badge.className = 'primary-badge';
                badge.textContent = 'Principale';
                actions.insertBefore(badge, actions.firstChild);
            }
        }
    }

    function removeCard(cardId) {
        const card = document.querySelector(`[data-card-id="${cardId}"]`).closest('.payment-method-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove dopo 5 secondi
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Rimuovi manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    function showConfirmDialog(title, message, onConfirm, confirmText = 'Conferma', type = 'primary') {
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                    <div class="modal-actions">
                        <button class="btn-${type}" id="confirmAction">${confirmText}</button>
                        <button class="btn-secondary" id="cancelAction">Annulla</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.style.display = 'flex';

        dialog.querySelector('#confirmAction').addEventListener('click', () => {
            onConfirm();
            dialog.remove();
        });

        dialog.querySelector('#cancelAction').addEventListener('click', () => {
            dialog.remove();
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    function showInfoDialog(title, content) {
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.style.display = 'flex';

        dialog.querySelector('.modal-close').addEventListener('click', () => {
            dialog.remove();
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    // ===============================================
    // INIZIALIZZAZIONE
    // ===============================================
    function init() {
        initializeFilters();
        initializeTransactionActions();
        initializeCardMenus();

        console.log('✅ Pagamenti JavaScript inizializzato');
    }

    // Avvia inizializzazione
    init();
});

// ===============================================
// CSS DINAMICO PER ELEMENTI CREATI VIA JS
// ===============================================
const dynamicStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    border-left: 4px solid;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
}

.notification.success { border-left-color: #22c55e; }
.notification.error { border-left-color: #ef4444; }
.notification.info { border-left-color: var(--color-primary); }

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    gap: 16px;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--color-secondary);
}

.card-menu-dropdown {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    border: 1px solid #e2e8f0;
    padding: 8px 0;
    min-width: 180px;
}

.card-menu-dropdown .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    font-size: 14px;
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.card-menu-dropdown .menu-item:hover {
    background: var(--color-gray-light);
}

.card-menu-dropdown .menu-item.danger {
    color: #ef4444;
}

.card-menu-dropdown .menu-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);