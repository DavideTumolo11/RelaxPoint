// ===============================================
// CRM CLIENTI PREMIUM - GESTIONE COMPLETA
// ===============================================

class CRMClients {
    constructor() {
        this.clients = [];
        this.filteredClients = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilter = 'all';
        this.sortField = 'name';
        this.sortDirection = 'asc';
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.renderClients();
        this.updateStats();
        console.log('CRM Clienti inizializzato con', this.clients.length, 'clienti');
    }

    loadSampleData() {
        // Sample data per demo - in produzione caricato da API
        this.clients = [
            {
                id: 1,
                name: 'Marco',
                surname: 'Rossi',
                email: 'marco.rossi@email.com',
                phone: '+39 346 123 4567',
                birthdate: '1985-03-15',
                gender: 'M',
                address: 'Via Roma 123, Milano',
                notes: 'Preferisce massaggi rilassanti, allergia ai profumi',
                isVip: true,
                status: 'active',
                lastVisit: '2024-09-20',
                totalSpent: 890,
                visits: 15,
                registrationDate: '2023-05-12',
                history: [
                    { date: '2024-09-20', service: 'Massaggio Rilassante', price: 80 },
                    { date: '2024-09-05', service: 'Trattamento Viso', price: 65 },
                    { date: '2024-08-18', service: 'Massaggio Deep Tissue', price: 95 }
                ]
            },
            {
                id: 2,
                name: 'Sofia',
                surname: 'Bianchi',
                email: 'sofia.bianchi@email.com',
                phone: '+39 347 987 6543',
                birthdate: '1992-07-22',
                gender: 'F',
                address: 'Via Veneto 45, Roma',
                notes: 'Cliente fedele, prenota sempre il giovedì mattina',
                isVip: false,
                status: 'active',
                lastVisit: '2024-09-18',
                totalSpent: 1250,
                visits: 23,
                registrationDate: '2022-11-08',
                history: [
                    { date: '2024-09-18', service: 'Manicure', price: 35 },
                    { date: '2024-09-01', service: 'Massaggio Svedese', price: 85 },
                    { date: '2024-08-15', service: 'Trattamento Anti-Age', price: 120 }
                ]
            },
            {
                id: 3,
                name: 'Andrea',
                surname: 'Verdi',
                email: 'andrea.verdi@email.com',
                phone: '+39 348 555 7890',
                birthdate: '1978-12-03',
                gender: 'M',
                address: 'Corso Italia 78, Torino',
                notes: 'Preferisce trattamenti sportivi, atleta amatoriale',
                isVip: true,
                status: 'active',
                lastVisit: '2024-09-22',
                totalSpent: 2100,
                visits: 31,
                registrationDate: '2022-03-20',
                history: [
                    { date: '2024-09-22', service: 'Massaggio Sportivo', price: 100 },
                    { date: '2024-09-08', service: 'Fisioterapia', price: 80 },
                    { date: '2024-08-25', service: 'Massaggio Decontratturante', price: 90 }
                ]
            },
            {
                id: 4,
                name: 'Elena',
                surname: 'Ferrari',
                email: 'elena.ferrari@email.com',
                phone: '+39 349 111 2222',
                birthdate: '1989-04-10',
                gender: 'F',
                address: 'Piazza del Duomo 12, Firenze',
                notes: 'Pelle sensibile, evitare prodotti con alcool',
                isVip: false,
                status: 'inactive',
                lastVisit: '2024-07-15',
                totalSpent: 380,
                visits: 8,
                registrationDate: '2024-01-15',
                history: [
                    { date: '2024-07-15', service: 'Pulizia Viso', price: 50 },
                    { date: '2024-06-20', service: 'Massaggio Rilassante', price: 75 },
                    { date: '2024-05-18', service: 'Trattamento Idratante', price: 60 }
                ]
            },
            {
                id: 5,
                name: 'Luca',
                surname: 'Moretti',
                email: 'luca.moretti@email.com',
                phone: '+39 350 333 4444',
                birthdate: '1995-08-28',
                gender: 'M',
                address: 'Via Garibaldi 67, Bologna',
                notes: 'Nuovo cliente, interessato ai pacchetti wellness',
                isVip: false,
                status: 'active',
                lastVisit: '2024-09-25',
                totalSpent: 150,
                visits: 3,
                registrationDate: '2024-09-01',
                history: [
                    { date: '2024-09-25', service: 'Consulenza Wellness', price: 0 },
                    { date: '2024-09-10', service: 'Massaggio Californiano', price: 80 },
                    { date: '2024-09-05', service: 'Prima Visita', price: 70 }
                ]
            }
        ];

        // Apply filters initially
        this.applyFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('clientSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchClients(e.target.value);
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
                this.renderClients();
            });
        });

        // Sort headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                const field = e.target.dataset.sort;
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortDirection = 'asc';
                }
                this.sortClients();
                this.renderClients();
                this.updateSortIcons();
            });
        });

        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderClients();
                    this.updatePagination();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderClients();
                    this.updatePagination();
                }
            });
        }

        // Export button
        const exportBtn = document.querySelector('.btn-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportClients());
        }

        // Form handling
        const addClientForm = document.getElementById('addClientForm');
        if (addClientForm) {
            addClientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveClient();
            });
        }
    }

    searchClients(query) {
        if (!query.trim()) {
            this.applyFilters();
        } else {
            this.filteredClients = this.clients.filter(client => {
                const searchStr = `${client.name} ${client.surname}`.toLowerCase();
                return searchStr.includes(query.toLowerCase());
            });
        }
        this.currentPage = 1;
        this.renderClients();
        this.updatePagination();
    }

    applyFilters() {
        switch (this.currentFilter) {
            case 'active':
                this.filteredClients = this.clients.filter(c => c.status === 'active');
                break;
            case 'inactive':
                this.filteredClients = this.clients.filter(c => c.status === 'inactive');
                break;
            case 'vip':
                this.filteredClients = this.clients.filter(c => c.isVip);
                break;
            default:
                this.filteredClients = [...this.clients];
        }
        this.currentPage = 1;
    }

    sortClients() {
        this.filteredClients.sort((a, b) => {
            let valueA = a[this.sortField];
            let valueB = b[this.sortField];

            // Handle different data types
            if (this.sortField === 'name') {
                valueA = `${a.name} ${a.surname}`.toLowerCase();
                valueB = `${b.name} ${b.surname}`.toLowerCase();
            } else if (this.sortField === 'spent') {
                valueA = a.totalSpent;
                valueB = b.totalSpent;
            } else if (this.sortField === 'lastVisit') {
                valueA = new Date(a.lastVisit);
                valueB = new Date(b.lastVisit);
            }

            if (valueA < valueB) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    renderClients() {
        const tbody = document.getElementById('clientsTableBody');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const clientsToShow = this.filteredClients.slice(startIndex, endIndex);

        tbody.innerHTML = clientsToShow.map(client => `
            <tr class="client-row ${client.status}" data-client-id="${client.id}">
                <td class="client-name">
                    <div class="name-info">
                        <strong>${client.name} ${client.surname}</strong>
                        ${client.isVip ? '<span class="vip-badge">VIP</span>' : ''}
                    </div>
                </td>
                <td class="client-status">
                    <span class="status-badge ${client.status}">
                        ${client.status === 'active' ? 'Attivo' : 'Inattivo'}
                    </span>
                </td>
                <td class="client-last-visit">
                    ${this.formatDate(client.lastVisit)}
                </td>
                <td class="client-visits">
                    <strong>${client.visits || 0}</strong>
                </td>
                <td class="client-actions">
                    <button class="action-btn view" onclick="crmClients.viewClient(${client.id})" title="Visualizza">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                    </button>
                    <button class="action-btn edit" onclick="crmClients.editClient(${client.id})" title="Modifica">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="crmClients.deleteClient(${client.id})" title="Elimina">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');

        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (pageNumbers) {
            pageNumbers.innerHTML = `
                <span class="page-info">
                    Pagina ${this.currentPage} di ${totalPages || 1}
                    (${this.filteredClients.length} clienti)
                </span>
            `;
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }

    updateSortIcons() {
        document.querySelectorAll('.sortable .sort-icon').forEach(icon => {
            icon.textContent = '↕';
        });

        const currentHeader = document.querySelector(`[data-sort="${this.sortField}"] .sort-icon`);
        if (currentHeader) {
            currentHeader.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
        }
    }

    updateStats() {
        const totalClients = this.clients.length;
        const activeClients = this.clients.filter(c => c.status === 'active').length;
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth());
        const newClients = this.clients.filter(c => {
            const regDate = new Date(c.registrationDate);
            return regDate.getMonth() === thisMonth.getMonth() &&
                   regDate.getFullYear() === thisMonth.getFullYear();
        }).length;
        const monthlyRevenue = this.clients.reduce((sum, client) => {
            return sum + (client.history
                .filter(h => {
                    const histDate = new Date(h.date);
                    return histDate.getMonth() === thisMonth.getMonth() &&
                           histDate.getFullYear() === thisMonth.getFullYear();
                })
                .reduce((total, h) => total + h.price, 0));
        }, 0);

        document.getElementById('totalClients').textContent = totalClients;
        document.getElementById('activeClients').textContent = activeClients;
        document.getElementById('newClients').textContent = newClients;
        document.getElementById('monthlyRevenue').textContent = `€${monthlyRevenue.toLocaleString()}`;
    }

    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    viewClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        const modal = document.getElementById('clientDetailModal');
        const title = document.getElementById('clientDetailTitle');
        const personalInfo = document.getElementById('clientPersonalInfo');
        const history = document.getElementById('clientHistory');

        title.textContent = `${client.name} ${client.surname}`;

        personalInfo.innerHTML = `
            <div class="client-details-grid">
                <div class="detail-item">
                    <label>Email:</label>
                    <span>${client.email}</span>
                </div>
                <div class="detail-item">
                    <label>Telefono:</label>
                    <span>${client.phone || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <label>Data di Nascita:</label>
                    <span>${this.formatDate(client.birthdate)}</span>
                </div>
                <div class="detail-item">
                    <label>Sesso:</label>
                    <span>${client.gender || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <label>Indirizzo:</label>
                    <span>${client.address || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <label>Cliente dal:</label>
                    <span>${this.formatDate(client.registrationDate)}</span>
                </div>
                <div class="detail-item">
                    <label>Status:</label>
                    <span class="status-badge ${client.status}">
                        ${client.status === 'active' ? 'Attivo' : 'Inattivo'}
                        ${client.isVip ? ' VIP' : ''}
                    </span>
                </div>
                <div class="detail-item full-width">
                    <label>Note:</label>
                    <span>${client.notes || 'Nessuna nota'}</span>
                </div>
            </div>
        `;

        history.innerHTML = `
            <div class="client-history">
                <div class="history-summary">
                    <div class="summary-item">
                        <strong>${client.visits}</strong>
                        <span>Visite Totali</span>
                    </div>
                    <div class="summary-item">
                        <strong>€${client.totalSpent}</strong>
                        <span>Spesa Totale</span>
                    </div>
                    <div class="summary-item">
                        <strong>${this.formatDate(client.lastVisit)}</strong>
                        <span>Ultima Visita</span>
                    </div>
                </div>
                <div class="history-list">
                    <h5>Storico Appuntamenti:</h5>
                    ${client.history.map(h => `
                        <div class="history-item">
                            <div class="history-date">${this.formatDate(h.date)}</div>
                            <div class="history-service">${h.service}</div>
                            <div class="history-price">€${h.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    editClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        // Populate form with client data
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientSurname').value = client.surname;
        document.getElementById('clientEmail').value = client.email;
        document.getElementById('clientPhone').value = client.phone || '';
        document.getElementById('clientBirthdate').value = client.birthdate || '';
        document.getElementById('clientGender').value = client.gender || '';
        document.getElementById('clientAddress').value = client.address || '';
        document.getElementById('clientNotes').value = client.notes || '';
        document.getElementById('clientVip').checked = client.isVip;

        // Store editing client ID
        this.editingClientId = clientId;

        // Change modal title
        document.querySelector('#addClientModal h3').textContent = 'Modifica Cliente';

        // Show modal
        document.getElementById('addClientModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    deleteClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        if (confirm(`Sei sicuro di voler eliminare il cliente ${client.name} ${client.surname}?`)) {
            this.clients = this.clients.filter(c => c.id !== clientId);
            this.applyFilters();
            this.renderClients();
            this.updateStats();
            this.showNotification('Cliente eliminato con successo', 'success');
        }
    }

    saveClient() {
        const form = document.getElementById('addClientForm');
        const formData = new FormData(form);

        const clientData = {
            name: document.getElementById('clientName').value.trim(),
            surname: document.getElementById('clientSurname').value.trim(),
            email: document.getElementById('clientEmail').value.trim(),
            phone: document.getElementById('clientPhone').value.trim(),
            birthdate: document.getElementById('clientBirthdate').value,
            gender: document.getElementById('clientGender').value,
            address: document.getElementById('clientAddress').value.trim(),
            notes: document.getElementById('clientNotes').value.trim(),
            isVip: document.getElementById('clientVip').checked
        };

        // Validation
        if (!clientData.name || !clientData.surname || !clientData.email) {
            this.showNotification('Nome, cognome e email sono obbligatori', 'error');
            return;
        }

        if (this.editingClientId) {
            // Update existing client
            const clientIndex = this.clients.findIndex(c => c.id === this.editingClientId);
            if (clientIndex !== -1) {
                this.clients[clientIndex] = {
                    ...this.clients[clientIndex],
                    ...clientData
                };
                this.showNotification('Cliente aggiornato con successo', 'success');
            }
            this.editingClientId = null;
        } else {
            // Add new client
            const newClient = {
                id: Date.now(),
                ...clientData,
                status: 'active',
                lastVisit: null,
                totalSpent: 0,
                visits: 0,
                registrationDate: new Date().toISOString().split('T')[0],
                history: []
            };
            this.clients.push(newClient);
            this.showNotification('Cliente aggiunto con successo', 'success');
        }

        this.closeAddClientModal();
        this.applyFilters();
        this.renderClients();
        this.updateStats();
    }

    exportClients() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `clienti_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showNotification('Lista clienti esportata con successo', 'success');
        }
    }

    generateCSV() {
        const headers = [
            'Nome', 'Cognome', 'Email', 'Telefono', 'Data Nascita',
            'Sesso', 'Indirizzo', 'Status', 'VIP', 'Ultima Visita',
            'Visite Totali', 'Spesa Totale', 'Data Registrazione', 'Note'
        ];

        const rows = this.filteredClients.map(client => [
            client.name,
            client.surname,
            client.email,
            client.phone || '',
            client.birthdate || '',
            client.gender || '',
            client.address || '',
            client.status,
            client.isVip ? 'Sì' : 'No',
            client.lastVisit || '',
            client.visits,
            client.totalSpent,
            client.registrationDate,
            client.notes || ''
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `crm-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('.crm-notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'crm-notification-styles';
            styles.textContent = `
                .crm-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    padding: 16px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    max-width: 350px;
                    animation: slideInRight 0.3s ease-out;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .crm-notification.info { background: #52A373; }
                .crm-notification.error { background: #ef4444; }
                .crm-notification.success { background: #52A373; }
                .crm-notification .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                .crm-notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .crm-notification button:hover {
                    background: rgba(255,255,255,0.2);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    closeAddClientModal() {
        document.getElementById('addClientModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('addClientForm').reset();
        document.querySelector('#addClientModal h3').textContent = 'Aggiungi Nuovo Cliente';
        this.editingClientId = null;
    }

    closeClientDetailModal() {
        document.getElementById('clientDetailModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Global functions for onclick handlers
function openAddClientModal() {
    document.getElementById('addClientModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAddClientModal() {
    window.crmClients.closeAddClientModal();
}

function exportClients() {
    window.crmClients.generateCSV();
}

function closeClientDetailModal() {
    window.crmClients.closeClientDetailModal();
}

function saveClient() {
    window.crmClients.saveClient();
}

function editClient() {
    window.crmClients.closeClientDetailModal();
    // The edit functionality is handled in the viewClient method
}

// Initialize CRM when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.crmClients = new CRMClients();
});

console.log('CRM Clienti Premium script caricato');