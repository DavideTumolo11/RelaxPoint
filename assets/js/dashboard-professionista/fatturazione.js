/* ===============================================
   RELAXPOINT - JAVASCRIPT FATTURAZIONE PROFESSIONISTA
   Gestione completa fatturazione automatica, template e compliance
   =============================================== */

console.log('Caricamento fatturazione JavaScript...');

// ===============================================
// DATI SIMULATI
// ===============================================
const invoiceData = {
    template: {
        businessName: 'Marco Bianchi - Massoterapista',
        vatNumber: '12345678901',
        address: 'Via Roma, 123\n09124 Cagliari (CA)',
        taxRegime: 'forfeit',
        nextNumber: '024/2024',
        notes: 'Pagamento entro 30 giorni - Grazie per aver scelto i nostri servizi'
    },
    pending: [
        {
            id: 'INV001',
            client: 'Laura Martini',
            service: 'Massaggio Hot Stone',
            amount: 80.00,
            serviceDate: '2024-01-12',
            daysLeft: 2
        },
        {
            id: 'INV002',
            client: 'Marco Rossi',
            service: 'Riflessologia Plantare',
            amount: 70.00,
            serviceDate: '2024-01-09',
            daysLeft: 5
        },
        {
            id: 'INV003',
            client: 'Elena Bianchi',
            service: 'Massaggio Svedese',
            amount: 70.00,
            serviceDate: '2024-01-06',
            daysLeft: 8
        }
    ]
};

// ===============================================
// FUNZIONI GLOBALI
// ===============================================

function previewInvoice(invoiceId) {
    console.log('Preview fattura:', invoiceId);
    showMessage('Anteprima fattura caricata', 'info');
}

function approveInvoice(invoiceId) {
    console.log('Approvazione fattura:', invoiceId);

    const invoice = invoiceData.pending.find(inv => inv.id === invoiceId);
    if (!invoice) {
        showMessage('Fattura non trovata', 'error');
        return;
    }

    if (confirm('Confermi approvazione e invio della fattura per ' + invoice.client + '?')) {
        showMessage('Invio fattura in corso...', 'info');

        setTimeout(() => {
            const invoiceElement = document.querySelector('[onclick="approveInvoice(\'' + invoiceId + '\')"]').closest('.pending-invoice');
            if (invoiceElement) {
                invoiceElement.style.opacity = '0.5';
                invoiceElement.style.pointerEvents = 'none';

                setTimeout(() => {
                    invoiceElement.remove();
                    updatePendingCount();
                }, 500);
            }

            addToInvoicesTable(invoice);
            showMessage('Fattura ' + invoiceId + ' approvata e inviata!', 'success');
        }, 2000);
    }
}

function downloadInvoice(invoiceNumber) {
    console.log('Download fattura:', invoiceNumber);
    showMessage('PDF scaricato: ' + invoiceNumber, 'success');
}

function resendInvoice(invoiceNumber) {
    console.log('Reinvio fattura:', invoiceNumber);
    if (confirm('Reinviare la fattura ' + invoiceNumber + ' via email?')) {
        showMessage('Fattura ' + invoiceNumber + ' reinviata!', 'success');
    }
}

function viewInvoice(invoiceNumber) {
    console.log('Visualizza fattura:', invoiceNumber);
    showMessage('Fattura caricata', 'success');
}

function sendReminder(invoiceNumber) {
    console.log('Sollecito fattura:', invoiceNumber);
    if (confirm('Inviare sollecito per fattura ' + invoiceNumber + '?')) {
        showMessage('Sollecito inviato', 'success');
    }
}

function openTemplateModal() {
    const modal = document.getElementById('templateModal');
    if (modal) {
        modal.style.display = 'flex';
        loadTemplateData();
    }
}

function closeTemplateModal() {
    const modal = document.getElementById('templateModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function previewLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const preview = document.getElementById('logoPreview');

        reader.onload = function (e) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Logo preview" style="max-width: 100px; max-height: 100px; border-radius: 8px;">';
        };

        reader.readAsDataURL(input.files[0]);
        showMessage('Logo caricato con successo', 'success');
    }
}

function saveTemplate() {
    console.log('Salvataggio template...');

    const businessName = document.getElementById('businessName').value.trim();
    const vatNumber = document.getElementById('vatNumber').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!businessName || !vatNumber || !address) {
        showMessage('Compila tutti i campi obbligatori', 'error');
        return;
    }

    if (vatNumber.length !== 11) {
        showMessage('Partita IVA deve contenere 11 cifre', 'error');
        return;
    }

    showMessage('Salvataggio template...', 'info');

    setTimeout(() => {
        invoiceData.template = {
            businessName: businessName,
            vatNumber: vatNumber,
            address: address,
            taxRegime: document.getElementById('taxRegime').value,
            nextNumber: document.getElementById('nextNumber').value,
            notes: document.getElementById('templateNotes').value
        };

        closeTemplateModal();
        showMessage('Template salvato con successo!', 'success');
    }, 1500);
}

// ===============================================
// FUNZIONI UTILITY
// ===============================================

function updatePendingCount() {
    const pendingElements = document.querySelectorAll('.pending-invoice');
    const count = pendingElements.length;

    const countBadges = document.querySelectorAll('.count-badge');
    countBadges.forEach(badge => {
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        }
    });

    const pendingCard = document.querySelector('.pending .card-value');
    if (pendingCard) {
        pendingCard.textContent = count;
    }
}

function addToInvoicesTable(invoice) {
    const tableBody = document.getElementById('invoicesTableBody');
    if (!tableBody) return;

    const template = invoiceData.template;
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-status', 'sent');

    newRow.innerHTML = '<td><span class="invoice-number">' + template.nextNumber + '</span></td>' +
        '<td><div class="client-cell"><strong>' + invoice.client + '</strong><span class="client-email">' +
        invoice.client.toLowerCase().replace(' ', '.') + '@email.com</span></div></td>' +
        '<td>' + invoice.service + '</td>' +
        '<td class="amount-cell">€' + invoice.amount.toFixed(2) + '</td>' +
        '<td>' + new Date().toLocaleDateString('it-IT') + '</td>' +
        '<td><span class="status-badge sent">Inviata</span></td>' +
        '<td><div class="action-buttons">' +
        '<button class="btn-action" onclick="downloadInvoice(\'' + template.nextNumber + '\')" title="Scarica PDF">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" /></svg></button>' +
        '<button class="btn-action" onclick="resendInvoice(\'' + template.nextNumber + '\')" title="Reinvia Email">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" /></svg></button>' +
        '</div></td>';

    tableBody.insertBefore(newRow, tableBody.firstChild);
    updateNextInvoiceNumber();
}

function updateNextInvoiceNumber() {
    const currentNumber = invoiceData.template.nextNumber;
    const parts = currentNumber.split('/');
    const number = parseInt(parts[0]) + 1;
    const year = parts[1];

    const newNumber = String(number).padStart(3, '0') + '/' + year;
    invoiceData.template.nextNumber = newNumber;

    const nextNumberElement = document.getElementById('nextNumber');
    if (nextNumberElement) {
        nextNumberElement.value = newNumber;
    }

    const sequenceCard = document.querySelector('.sequence .card-value');
    if (sequenceCard) {
        sequenceCard.textContent = newNumber;
    }
}

function loadTemplateData() {
    const template = invoiceData.template;

    document.getElementById('businessName').value = template.businessName;
    document.getElementById('vatNumber').value = template.vatNumber;
    document.getElementById('address').value = template.address;
    document.getElementById('taxRegime').value = template.taxRegime;
    document.getElementById('nextNumber').value = template.nextNumber;
    document.getElementById('templateNotes').value = template.notes || '';
}

function filterInvoices(status) {
    const rows = document.querySelectorAll('#invoicesTableBody tr');

    rows.forEach(row => {
        if (status === 'all' || row.getAttribute('data-status') === status) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });

    console.log('Filtro applicato:', status);
}

function exportInvoices() {
    console.log('Esportazione fatture...');
    showMessage('Preparazione export...', 'info');

    setTimeout(() => {
        let csvContent = 'Numero,Cliente,Servizio,Importo,Data,Stato\n';

        const rows = document.querySelectorAll('#invoicesTableBody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const numero = cells[0].textContent.trim();
                const cliente = cells[1].querySelector('strong').textContent.trim();
                const servizio = cells[2].textContent.trim();
                const importo = cells[3].textContent.trim();
                const data = cells[4].textContent.trim();
                const stato = cells[5].textContent.trim();

                csvContent += '"' + numero + '","' + cliente + '","' + servizio + '","' + importo + '","' + data + '","' + stato + '"\n';
            }
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'fatture_' + new Date().toISOString().split('T')[0] + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showMessage('Fatture esportate con successo!', 'success');
    }, 1500);
}

function showMessage(message, type = 'info') {
    console.log('Messaggio:', message, type);

    const existing = document.querySelectorAll('.temp-message');
    existing.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = 'temp-message';
    messageDiv.textContent = message;

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

    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    messageDiv.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// ===============================================
// SETUP AL CARICAMENTO PAGINA
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM caricato, inizializzando fatturazione...');

    const templateBtn = document.getElementById('templateBtn');
    if (templateBtn) {
        templateBtn.addEventListener('click', openTemplateModal);
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            filterInvoices(this.value);
        });
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportInvoices);
    }

    const modal = document.getElementById('templateModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeTemplateModal();
            }
        });
    }

    console.log('Fatturazione inizializzata con successo');
    showMessage('Dashboard fatturazione caricata', 'success');
});

console.log('Fatturazione JavaScript caricato completamente');