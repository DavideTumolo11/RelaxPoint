/* ===============================================
   RELAXPOINT - DASHBOARD ADMIN JAVASCRIPT
   Gestione completa pannello amministrativo
   =============================================== */

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = {
            name: 'Amministratore',
            email: 'admin@relaxpoint.it',
            lastLogin: new Date().toLocaleString('it-IT'),
            permissions: ['all']
        };
        this.mockData = this.generateMockData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStatistics();
        this.loadInitialData();
        this.setupAutoRefresh();
        this.showSection(this.currentSection);
        console.log('Admin Dashboard inizializzata');
    }

    generateMockData() {
        return {
            stats: {
                users: 1247,
                professionals: 156,
                todayBookings: 47,
                monthlyRevenue: 125420,
                pendingVerifications: 12,
                activeReports: 5,
                systemErrors: 2,
                emailQueue: 23
            },
            users: this.generateUsers(50),
            professionals: this.generateProfessionals(20),
            bookings: this.generateBookings(30),
            reports: this.generateReports(15),
            logs: this.generateLogs(100)
        };
    }

    generateUsers(count) {
        const users = [];
        const names = ['Mario Rossi', 'Giulia Verdi', 'Luca Bianchi', 'Sara Ferrari', 'Marco Romano'];
        const statuses = ['active', 'pending', 'inactive', 'blocked'];

        for (let i = 0; i < count; i++) {
            users.push({
                id: 1000 + i,
                name: names[Math.floor(Math.random() * names.length)],
                email: `user${i}@example.com`,
                registrationDate: this.randomDate(),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                lastLogin: this.randomDate(),
                bookings: Math.floor(Math.random() * 20),
                verified: Math.random() > 0.3
            });
        }
        return users;
    }

    generateProfessionals(count) {
        const professionals = [];
        const names = ['Dr. Anna Bianchi', 'Marco Wellness', 'Sofia Yoga', 'Luca Fitness'];
        const services = ['Yoga', 'Massaggi', 'Fitness', 'Wellness', 'Fisioterapia'];
        const statuses = ['active', 'pending', 'suspended', 'verification'];

        for (let i = 0; i < count; i++) {
            professionals.push({
                id: 2000 + i,
                name: names[Math.floor(Math.random() * names.length)],
                email: `prof${i}@example.com`,
                service: services[Math.floor(Math.random() * services.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                registrationDate: this.randomDate(),
                rating: (Math.random() * 2 + 3).toFixed(1),
                totalBookings: Math.floor(Math.random() * 100),
                documentsSubmitted: Math.random() > 0.5,
                monthlyEarnings: Math.floor(Math.random() * 5000 + 1000)
            });
        }
        return professionals;
    }

    generateBookings(count) {
        const bookings = [];
        const services = ['Massaggio Rilassante', 'Yoga Session', 'Personal Training', 'Consulenza Wellness'];
        const statuses = ['completed', 'pending', 'cancelled', 'confirmed'];

        for (let i = 0; i < count; i++) {
            bookings.push({
                id: 3000 + i,
                clientName: `Cliente ${i + 1}`,
                professionalName: `Professionista ${i % 5 + 1}`,
                service: services[Math.floor(Math.random() * services.length)],
                date: this.randomDate(),
                time: `${Math.floor(Math.random() * 12 + 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                amount: Math.floor(Math.random() * 100 + 30),
                paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending'
            });
        }
        return bookings;
    }

    generateReports(count) {
        const reports = [];
        const types = ['bug', 'content', 'user', 'payment', 'technical'];
        const priorities = ['low', 'medium', 'high', 'critical'];
        const statuses = ['new', 'investigating', 'resolved', 'closed'];

        for (let i = 0; i < count; i++) {
            reports.push({
                id: 4000 + i,
                type: types[Math.floor(Math.random() * types.length)],
                title: `Report #${4000 + i}: Issue description`,
                description: 'Detailed description of the reported issue...',
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                reportedBy: `user${Math.floor(Math.random() * 1000)}@example.com`,
                dateReported: this.randomDate(),
                assignedTo: Math.random() > 0.5 ? 'admin@relaxpoint.it' : null
            });
        }
        return reports;
    }

    generateLogs(count) {
        const logs = [];
        const types = ['error', 'warning', 'info', 'success'];
        const actions = ['Login', 'Logout', 'Registration', 'Booking', 'Payment', 'Email sent', 'Error occurred'];

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            logs.push({
                id: 5000 + i,
                type: type,
                action: actions[Math.floor(Math.random() * actions.length)],
                message: `[${type.toUpperCase()}] ${actions[Math.floor(Math.random() * actions.length)]} - Additional details...`,
                timestamp: this.randomDate(),
                userId: Math.floor(Math.random() * 1000),
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
            });
        }
        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    randomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Search functionality
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('search-input')) {
                this.handleSearch(e.target.value, e.target.dataset.table);
            }
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e.target);
        });
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) navItem.classList.add('active');

        // Show section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        const section = document.getElementById(`${sectionName}-section`);
        if (section) {
            section.classList.add('active');
            this.currentSection = sectionName;
            this.loadSectionData(sectionName);
        }
    }

    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.updateStatistics();
                this.loadRecentActivities();
                break;
            case 'users':
                this.loadUsersTable();
                break;
            case 'professionals':
                this.loadProfessionalsTable();
                break;
            case 'bookings':
                this.loadBookingsTable();
                break;
            case 'verification':
                this.loadVerificationQueue();
                break;
            case 'reports':
                this.loadReportsTable();
                break;
            case 'system':
                this.loadSystemInfo();
                break;
            case 'logs':
                this.loadSystemLogs();
                break;
        }
    }

    updateStatistics() {
        const stats = this.mockData.stats;

        // Update main stats
        document.getElementById('total-users').textContent = stats.users.toLocaleString();
        document.getElementById('total-professionals').textContent = stats.professionals.toLocaleString();
        document.getElementById('today-bookings').textContent = stats.todayBookings.toLocaleString();
        document.getElementById('monthly-revenue').textContent = `€${stats.monthlyRevenue.toLocaleString()}`;

        // Update additional stats if elements exist
        const pendingElement = document.getElementById('pending-verifications');
        if (pendingElement) pendingElement.textContent = stats.pendingVerifications.toLocaleString();

        const reportsElement = document.getElementById('active-reports');
        if (reportsElement) reportsElement.textContent = stats.activeReports.toLocaleString();
    }

    loadUsersTable() {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.mockData.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.registrationDate.toLocaleDateString('it-IT')}</td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${this.getStatusLabel(user.status)}
                    </span>
                </td>
                <td>${user.bookings}</td>
                <td>
                    <div class="d-flex gap-10">
                        <button class="btn-edit" onclick="adminDashboard.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="adminDashboard.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        ${user.status === 'pending' ? `
                            <button class="btn-approve" onclick="adminDashboard.approveUser(${user.id})">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadProfessionalsTable() {
        const tbody = document.getElementById('professionals-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.mockData.professionals.map(prof => `
            <tr>
                <td>${prof.id}</td>
                <td>${prof.name}</td>
                <td>${prof.email}</td>
                <td>${prof.service}</td>
                <td>
                    <span class="status-badge status-${prof.status}">
                        ${this.getStatusLabel(prof.status)}
                    </span>
                </td>
                <td>⭐ ${prof.rating}</td>
                <td>€${prof.monthlyEarnings}</td>
                <td>
                    <div class="d-flex gap-10">
                        <button class="btn-edit" onclick="adminDashboard.editProfessional(${prof.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-primary" onclick="adminDashboard.viewProfile(${prof.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${prof.status === 'pending' ? `
                            <button class="btn-approve" onclick="adminDashboard.approveProfessional(${prof.id})">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadVerificationQueue() {
        const container = document.getElementById('verification-queue');
        if (!container) return;

        const pendingProfessionals = this.mockData.professionals.filter(p => p.status === 'pending' || p.status === 'verification');

        container.innerHTML = pendingProfessionals.map(prof => `
            <div class="verification-item" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 15px 0;">
                <div class="d-flex justify-between align-center mb-15">
                    <h4 class="mb-0">${prof.name}</h4>
                    <span class="status-badge status-${prof.status}">${this.getStatusLabel(prof.status)}</span>
                </div>
                <p class="mb-10"><strong>Email:</strong> ${prof.email}</p>
                <p class="mb-10"><strong>Servizio:</strong> ${prof.service}</p>
                <p class="mb-10"><strong>Registrazione:</strong> ${prof.registrationDate.toLocaleDateString('it-IT')}</p>
                <p class="mb-15"><strong>Documenti:</strong> ${prof.documentsSubmitted ? '✅ Inviati' : '❌ Mancanti'}</p>

                <div class="d-flex gap-10">
                    <button class="btn-success" onclick="adminDashboard.approveVerification(${prof.id})">
                        <i class="fas fa-check"></i> Approva
                    </button>
                    <button class="btn-warning" onclick="adminDashboard.requestMoreInfo(${prof.id})">
                        <i class="fas fa-exclamation-triangle"></i> Richiedi Info
                    </button>
                    <button class="btn-danger" onclick="adminDashboard.rejectVerification(${prof.id})">
                        <i class="fas fa-times"></i> Rifiuta
                    </button>
                    <button class="btn-primary" onclick="adminDashboard.viewDocuments(${prof.id})">
                        <i class="fas fa-file-alt"></i> Vedi Documenti
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadBookingsTable() {
        const tbody = document.getElementById('bookings-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.mockData.bookings.map(booking => `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.clientName}</td>
                <td>${booking.professionalName}</td>
                <td>${booking.service}</td>
                <td>${booking.date.toLocaleDateString('it-IT')} ${booking.time}</td>
                <td>
                    <span class="status-badge status-${booking.status}">
                        ${this.getStatusLabel(booking.status)}
                    </span>
                </td>
                <td>€${booking.amount}</td>
                <td>
                    <div class="d-flex gap-10">
                        <button class="btn-primary" onclick="adminDashboard.viewBooking(${booking.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${booking.status === 'pending' ? `
                            <button class="btn-success" onclick="adminDashboard.confirmBooking(${booking.id})">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        ${booking.paymentStatus === 'pending' ? `
                            <button class="btn-warning" onclick="adminDashboard.checkPayment(${booking.id})">
                                <i class="fas fa-credit-card"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadReportsTable() {
        const tbody = document.getElementById('reports-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.mockData.reports.map(report => `
            <tr>
                <td>${report.id}</td>
                <td>${report.title}</td>
                <td>
                    <span class="status-badge status-${report.type}" style="background: ${this.getTypeColor(report.type)}; color: white;">
                        ${report.type.toUpperCase()}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${report.priority}" style="background: ${this.getPriorityColor(report.priority)}; color: white;">
                        ${report.priority.toUpperCase()}
                    </span>
                </td>
                <td>${report.reportedBy}</td>
                <td>${report.dateReported.toLocaleDateString('it-IT')}</td>
                <td>
                    <div class="d-flex gap-10">
                        <button class="btn-primary" onclick="adminDashboard.viewReport(${report.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-success" onclick="adminDashboard.resolveReport(${report.id})">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Funzioni per gestire prenotazioni
    viewBooking(bookingId) {
        const booking = this.mockData.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const modal = document.getElementById('generic-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        title.textContent = `Prenotazione #${bookingId}`;
        body.innerHTML = `
            <div class="form-group">
                <label><strong>Cliente:</strong></label>
                <p>${booking.clientName}</p>
            </div>
            <div class="form-group">
                <label><strong>Professionista:</strong></label>
                <p>${booking.professionalName}</p>
            </div>
            <div class="form-group">
                <label><strong>Servizio:</strong></label>
                <p>${booking.service}</p>
            </div>
            <div class="form-group">
                <label><strong>Data e Ora:</strong></label>
                <p>${booking.date.toLocaleDateString('it-IT')} alle ${booking.time}</p>
            </div>
            <div class="form-group">
                <label><strong>Importo:</strong></label>
                <p>€${booking.amount}</p>
            </div>
            <div class="form-group">
                <label><strong>Stato:</strong></label>
                <span class="status-badge status-${booking.status}">${this.getStatusLabel(booking.status)}</span>
            </div>
            <div class="form-group">
                <label><strong>Pagamento:</strong></label>
                <span class="status-badge status-${booking.paymentStatus}">${booking.paymentStatus === 'paid' ? 'Pagato' : 'In attesa'}</span>
            </div>

            <div class="d-flex gap-10 justify-between mt-20">
                <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Chiudi</button>
                <button type="button" class="btn-warning" onclick="adminDashboard.contactClient(${bookingId})">Contatta Cliente</button>
                <button type="button" class="btn-primary" onclick="adminDashboard.contactProfessional(${bookingId})">Contatta Professionista</button>
            </div>
        `;

        modal.classList.add('active');
    }

    confirmBooking(bookingId) {
        console.log('Confirm booking:', bookingId);
        this.showNotification('Prenotazione confermata! Notifiche inviate.', 'success');
        setTimeout(() => this.loadBookingsTable(), 1000);
    }

    checkPayment(bookingId) {
        console.log('Check payment for booking:', bookingId);
        this.showNotification('Verifica pagamento in corso...', 'info');
        setTimeout(() => {
            this.showNotification('Pagamento verificato e confermato!', 'success');
            this.loadBookingsTable();
        }, 2000);
    }

    contactClient(bookingId) {
        console.log('Contact client for booking:', bookingId);
        this.showNotification('Email inviata al cliente', 'success');
        this.closeModal();
    }

    contactProfessional(bookingId) {
        console.log('Contact professional for booking:', bookingId);
        this.showNotification('Email inviata al professionista', 'success');
        this.closeModal();
    }

    loadSystemLogs() {
        const container = document.getElementById('logs-container');
        if (!container) return;

        container.innerHTML = this.mockData.logs.slice(0, 50).map(log => `
            <div class="log-entry log-${log.type}">
                <strong>[${log.timestamp.toLocaleString('it-IT')}]</strong>
                ${log.message}
                <br><small>User: ${log.userId} | IP: ${log.ipAddress}</small>
            </div>
        `).join('');
    }

    // Action Methods
    editUser(userId) {
        console.log('Edit user:', userId);
        this.showNotification('Funzionalità di modifica utente (richiede backend)', 'info');
    }

    deleteUser(userId) {
        if (confirm('Sei sicuro di voler eliminare questo utente?')) {
            console.log('Delete user:', userId);
            this.showNotification('Utente eliminato (simulato)', 'success');
        }
    }

    approveUser(userId) {
        console.log('Approve user:', userId);
        this.showNotification('Utente approvato (simulato)', 'success');
        this.loadUsersTable();
    }

    approveVerification(profId) {
        console.log('Approve verification:', profId);
        this.showNotification('Verifica approvata! Email di conferma inviata', 'success');
        setTimeout(() => this.loadVerificationQueue(), 1000);
    }

    requestMoreInfo(profId) {
        const info = prompt('Quali informazioni aggiuntive richiedi?');
        if (info) {
            console.log('Request more info for:', profId, info);
            this.showNotification('Richiesta inviata al professionista', 'info');
        }
    }

    rejectVerification(profId) {
        const reason = prompt('Motivo del rifiuto:');
        if (reason) {
            console.log('Reject verification:', profId, reason);
            this.showNotification('Verifica rifiutata. Email inviata con i motivi', 'warning');
            setTimeout(() => this.loadVerificationQueue(), 1000);
        }
    }

    viewDocuments(profId) {
        console.log('View documents for:', profId);
        this.showNotification('Apertura documenti (richiede backend)', 'info');
    }

    // Utility Methods
    getStatusLabel(status) {
        const labels = {
            'active': 'Attivo',
            'pending': 'In attesa',
            'inactive': 'Inattivo',
            'blocked': 'Bloccato',
            'suspended': 'Sospeso',
            'verification': 'Verifica'
        };
        return labels[status] || status;
    }

    getTypeColor(type) {
        const colors = {
            'bug': '#ef4444',
            'content': '#3b82f6',
            'user': '#10b981',
            'payment': '#f59e0b',
            'technical': '#8b5cf6'
        };
        return colors[type] || '#6b7280';
    }

    getPriorityColor(priority) {
        const colors = {
            'low': '#10b981',
            'medium': '#f59e0b',
            'high': '#ef4444',
            'critical': '#7c2d12'
        };
        return colors[priority] || '#6b7280';
    }

    handleSearch(query, table) {
        console.log('Search:', query, 'in table:', table);

        if (!query.trim()) {
            this.loadSectionData(this.currentSection);
            return;
        }

        // Filtra i dati in base alla ricerca
        const filteredData = this.filterData(query.toLowerCase(), table);
        this.updateTable(table, filteredData);
    }

    filterData(query, table) {
        switch(table) {
            case 'users':
                return this.mockData.users.filter(user =>
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.id.toString().includes(query)
                );
            case 'professionals':
                return this.mockData.professionals.filter(prof =>
                    prof.name.toLowerCase().includes(query) ||
                    prof.email.toLowerCase().includes(query) ||
                    prof.service.toLowerCase().includes(query)
                );
            default:
                return [];
        }
    }

    updateTable(table, data) {
        if (table === 'users') {
            const tbody = document.getElementById('users-tbody');
            if (tbody) {
                tbody.innerHTML = data.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.registrationDate.toLocaleDateString('it-IT')}</td>
                        <td>
                            <span class="status-badge status-${user.status}">
                                ${this.getStatusLabel(user.status)}
                            </span>
                        </td>
                        <td>${user.bookings}</td>
                        <td>
                            <div class="d-flex gap-10">
                                <button class="btn-edit" onclick="adminDashboard.editUser(${user.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" onclick="adminDashboard.deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                                ${user.status === 'pending' ? `
                                    <button class="btn-approve" onclick="adminDashboard.approveUser(${user.id})">
                                        <i class="fas fa-check"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    // Nuove funzioni per i pulsanti
    addNewUser() {
        const modal = document.getElementById('generic-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        title.textContent = 'Aggiungi Nuovo Utente';
        body.innerHTML = `
            <form id="new-user-form">
                <div class="form-group">
                    <label for="user-name">Nome Completo</label>
                    <input type="text" id="user-name" required>
                </div>
                <div class="form-group">
                    <label for="user-email">Email</label>
                    <input type="email" id="user-email" required>
                </div>
                <div class="form-group">
                    <label for="user-phone">Telefono</label>
                    <input type="tel" id="user-phone">
                </div>
                <div class="form-group">
                    <label for="user-status">Stato Iniziale</label>
                    <select id="user-status">
                        <option value="pending">In attesa</option>
                        <option value="active">Attivo</option>
                        <option value="inactive">Inattivo</option>
                    </select>
                </div>
                <div class="d-flex gap-10 justify-between mt-20">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Annulla</button>
                    <button type="submit" class="btn-primary">Crea Utente</button>
                </div>
            </form>
        `;

        modal.classList.add('active');
    }

    addNewProfessional() {
        const modal = document.getElementById('generic-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        title.textContent = 'Aggiungi Nuovo Professionista';
        body.innerHTML = `
            <form id="new-professional-form">
                <div class="form-group">
                    <label for="prof-name">Nome Completo</label>
                    <input type="text" id="prof-name" required>
                </div>
                <div class="form-group">
                    <label for="prof-email">Email</label>
                    <input type="email" id="prof-email" required>
                </div>
                <div class="form-group">
                    <label for="prof-service">Categoria Servizio</label>
                    <select id="prof-service" required>
                        <option value="">Seleziona categoria</option>
                        <option value="Yoga">Yoga & Meditazione</option>
                        <option value="Massaggi">Massaggi & Trattamenti</option>
                        <option value="Fitness">Fitness & Allenamento</option>
                        <option value="Wellness">Wellness Coach</option>
                        <option value="Fisioterapia">Fisioterapia & Osteopatia</option>
                        <option value="Beauty">Beauty & Estetica</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="prof-phone">Telefono</label>
                    <input type="tel" id="prof-phone" required>
                </div>
                <div class="d-flex gap-10 justify-between mt-20">
                    <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Annulla</button>
                    <button type="submit" class="btn-primary">Crea Professionista</button>
                </div>
            </form>
        `;

        modal.classList.add('active');
    }

    exportCSV(type) {
        let data, filename;

        switch(type) {
            case 'users':
                data = this.mockData.users;
                filename = 'utenti_relaxpoint.csv';
                break;
            case 'professionals':
                data = this.mockData.professionals;
                filename = 'professionisti_relaxpoint.csv';
                break;
            case 'bookings':
                data = this.mockData.bookings;
                filename = 'prenotazioni_relaxpoint.csv';
                break;
            case 'logs':
                data = this.mockData.logs.slice(0, 1000); // Ultimi 1000 log
                filename = 'log_sistema_relaxpoint.csv';
                break;
            default:
                this.showNotification('Tipo export non supportato', 'warning');
                return;
        }

        // Crea CSV
        const csvContent = this.generateCSV(data, type);
        this.downloadCSV(csvContent, filename);
        this.showNotification(`Export ${type} completato!`, 'success');
    }

    generateCSV(data, type) {
        if (!data.length) return '';

        let headers, rows;

        switch(type) {
            case 'users':
                headers = ['ID', 'Nome', 'Email', 'Registrazione', 'Stato', 'Prenotazioni', 'Verificato'];
                rows = data.map(user => [
                    user.id,
                    `"${user.name}"`,
                    user.email,
                    user.registrationDate.toLocaleDateString('it-IT'),
                    user.status,
                    user.bookings,
                    user.verified ? 'Si' : 'No'
                ]);
                break;

            case 'professionals':
                headers = ['ID', 'Nome', 'Email', 'Servizio', 'Stato', 'Rating', 'Guadagno Mensile'];
                rows = data.map(prof => [
                    prof.id,
                    `"${prof.name}"`,
                    prof.email,
                    prof.service,
                    prof.status,
                    prof.rating,
                    prof.monthlyEarnings
                ]);
                break;

            case 'bookings':
                headers = ['ID', 'Cliente', 'Professionista', 'Servizio', 'Data', 'Stato', 'Importo'];
                rows = data.map(booking => [
                    booking.id,
                    `"${booking.clientName}"`,
                    `"${booking.professionalName}"`,
                    `"${booking.service}"`,
                    booking.date.toLocaleDateString('it-IT'),
                    booking.status,
                    booking.amount
                ]);
                break;

            case 'logs':
                headers = ['ID', 'Tipo', 'Azione', 'Messaggio', 'Timestamp', 'User ID', 'IP'];
                rows = data.map(log => [
                    log.id,
                    log.type,
                    `"${log.action}"`,
                    `"${log.message}"`,
                    log.timestamp.toLocaleString('it-IT'),
                    log.userId,
                    log.ipAddress
                ]);
                break;
        }

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    applyFilters(section) {
        const filterContainer = document.querySelector(`#${section}-section .filters-container`);
        if (!filterContainer) return;

        // Raccogli i valori dei filtri
        const filters = {};
        filterContainer.querySelectorAll('select').forEach(select => {
            if (select.value) {
                const label = select.previousElementSibling.textContent.toLowerCase();
                filters[label] = select.value;
            }
        });

        console.log('Filtri applicati:', filters);
        this.showNotification(`Filtri applicati a ${section}`, 'success');

        // TODO: Implementa logica di filtro reale
        // Per ora ricarica i dati
        this.loadSectionData(section);
    }

    viewReport(reportId) {
        const report = this.mockData.reports.find(r => r.id === reportId);
        if (!report) return;

        const modal = document.getElementById('generic-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');

        title.textContent = `Segnalazione #${reportId}`;
        body.innerHTML = `
            <div class="alert alert-${report.priority === 'critical' ? 'danger' : report.priority === 'high' ? 'warning' : 'info'}">
                <strong>Priorità: ${report.priority.toUpperCase()}</strong> | Tipo: ${report.type.toUpperCase()}
            </div>

            <div class="form-group">
                <label><strong>Titolo:</strong></label>
                <p>${report.title}</p>
            </div>

            <div class="form-group">
                <label><strong>Descrizione:</strong></label>
                <p>${report.description}</p>
            </div>

            <div class="form-group">
                <label><strong>Segnalato da:</strong></label>
                <p>${report.reportedBy}</p>
            </div>

            <div class="form-group">
                <label><strong>Data:</strong></label>
                <p>${report.dateReported.toLocaleString('it-IT')}</p>
            </div>

            <div class="form-group">
                <label><strong>Stato attuale:</strong></label>
                <span class="status-badge status-${report.status}">${report.status}</span>
            </div>

            <hr>

            <div class="form-group">
                <label for="response-text">Risposta/Note:</label>
                <textarea id="response-text" rows="4" placeholder="Aggiungi note o risposta..."></textarea>
            </div>

            <div class="d-flex gap-10 justify-between mt-20">
                <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Chiudi</button>
                <button type="button" class="btn-success" onclick="adminDashboard.resolveReport(${reportId})">Risolvi</button>
                <button type="button" class="btn-primary" onclick="adminDashboard.updateReport(${reportId})">Aggiorna</button>
            </div>
        `;

        modal.classList.add('active');
    }

    resolveReport(reportId) {
        console.log('Resolve report:', reportId);
        this.showNotification('Segnalazione risolta!', 'success');
        this.closeModal();
        setTimeout(() => this.loadReportsTable(), 1000);
    }

    updateReport(reportId) {
        const responseText = document.getElementById('response-text')?.value;
        console.log('Update report:', reportId, 'Response:', responseText);
        this.showNotification('Segnalazione aggiornata!', 'info');
        this.closeModal();
    }

    handleFormSubmission(form) {
        const formId = form.id;

        switch(formId) {
            case 'new-user-form':
                this.createUser(form);
                break;
            case 'new-professional-form':
                this.createProfessional(form);
                break;
            default:
                console.log('Form submitted:', form);
                this.showNotification('Form inviato (richiede backend)', 'info');
        }
    }

    createUser(form) {
        const formData = new FormData(form);
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            phone: document.getElementById('user-phone').value,
            status: document.getElementById('user-status').value
        };

        console.log('Creating user:', userData);
        this.showNotification('Nuovo utente creato con successo!', 'success');
        this.closeModal();

        // Simula aggiunta ai dati mock
        const newUser = {
            id: Math.max(...this.mockData.users.map(u => u.id)) + 1,
            ...userData,
            registrationDate: new Date(),
            lastLogin: new Date(),
            bookings: 0,
            verified: false
        };
        this.mockData.users.unshift(newUser);
        this.mockData.stats.users++;

        // Ricarica tabella
        setTimeout(() => {
            this.loadUsersTable();
            this.updateStatistics();
        }, 500);
    }

    createProfessional(form) {
        const profData = {
            name: document.getElementById('prof-name').value,
            email: document.getElementById('prof-email').value,
            service: document.getElementById('prof-service').value,
            phone: document.getElementById('prof-phone').value
        };

        console.log('Creating professional:', profData);
        this.showNotification('Nuovo professionista creato! Inviate istruzioni per documentazione.', 'success');
        this.closeModal();

        // Simula aggiunta
        const newProf = {
            id: Math.max(...this.mockData.professionals.map(p => p.id)) + 1,
            ...profData,
            status: 'pending',
            registrationDate: new Date(),
            rating: '0.0',
            totalBookings: 0,
            documentsSubmitted: false,
            monthlyEarnings: 0
        };
        this.mockData.professionals.unshift(newProf);
        this.mockData.stats.professionals++;
        this.mockData.stats.pendingVerifications++;

        setTimeout(() => {
            this.loadProfessionalsTable();
            this.updateStatistics();
        }, 500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : type === 'danger' ? 'times' : 'info-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    closeModal() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    setupAutoRefresh() {
        // Refresh statistics every 30 seconds
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.updateStatistics();
            }
        }, 30000);

        // Refresh logs every 10 seconds
        setInterval(() => {
            if (this.currentSection === 'logs') {
                this.loadSystemLogs();
            }
        }, 10000);
    }

    loadInitialData() {
        // Simula caricamento dati iniziali
        console.log('Caricamento dati iniziali completato');
    }

    loadRecentActivities() {
        const container = document.getElementById('recent-activities');
        if (!container) return;

        const activities = [
            { type: 'success', message: 'Nuovo utente registrato: Mario Rossi', time: '2 min fa' },
            { type: 'info', message: 'Prenotazione confermata #3045', time: '5 min fa' },
            { type: 'warning', message: 'Documento in attesa di verifica', time: '12 min fa' },
            { type: 'error', message: 'Errore pagamento #2341', time: '25 min fa' },
            { type: 'success', message: 'Professionista approvato: Dr. Anna Bianchi', time: '1h fa' }
        ];

        container.innerHTML = activities.map(activity => `
            <div class="log-entry log-${activity.type}" style="margin: 10px 0;">
                <strong>${activity.message}</strong>
                <br><small>${activity.time}</small>
            </div>
        `).join('');
    }
}

// Global functions for HTML onclick events
function showSection(section) {
    window.adminDashboard.showSection(section);
}

// Funzioni globali per pulsanti HTML
function addNewUser() {
    window.adminDashboard.addNewUser();
}

function addNewProfessional() {
    window.adminDashboard.addNewProfessional();
}

function exportCSV(type) {
    window.adminDashboard.exportCSV(type);
}

function applyFilters(section) {
    window.adminDashboard.applyFilters(section);
}

function viewReport(reportId) {
    window.adminDashboard.viewReport(reportId);
}

function resolveReport(reportId) {
    window.adminDashboard.resolveReport(reportId);
}

function backupDatabase() {
    window.adminDashboard.showNotification('Backup database avviato...', 'info');
    setTimeout(() => {
        window.adminDashboard.showNotification('Backup completato con successo!', 'success');
    }, 3000);
}

function restartServices() {
    if (confirm('Sei sicuro di voler riavviare i servizi? Potrebbero esserci brevi interruzioni.')) {
        window.adminDashboard.showNotification('Riavvio servizi in corso...', 'warning');
        setTimeout(() => {
            window.adminDashboard.showNotification('Servizi riavviati con successo!', 'success');
        }, 5000);
    }
}

function generatePerformanceReport() {
    window.adminDashboard.showNotification('Generazione report performance...', 'info');
    setTimeout(() => {
        window.adminDashboard.showNotification('Report generato e inviato via email!', 'success');
    }, 2000);
}

function enableMaintenanceMode() {
    if (confirm('ATTENZIONE: Modalità manutenzione bloccherà l\'accesso al sito per tutti gli utenti. Continuare?')) {
        window.adminDashboard.showNotification('Modalità manutenzione ATTIVA. Sito offline per gli utenti.', 'warning');
    }
}

function exportLogs() {
    window.adminDashboard.exportCSV('logs');
}

function filterBookingsByStatus(status) {
    console.log('Filter bookings by:', status);
    if (status === 'problems') {
        window.adminDashboard.showNotification('Visualizzando prenotazioni con problemi...', 'warning');
    } else if (status === 'pending') {
        window.adminDashboard.showNotification('Visualizzando prenotazioni da confermare...', 'info');
    }
    // TODO: Implementa filtro reale quando c'è il backend
    setTimeout(() => window.adminDashboard.loadBookingsTable(), 500);
}

function filterReportsByPriority(priority) {
    console.log('Filter reports by priority:', priority);
    if (priority === 'critical') {
        window.adminDashboard.showNotification('Visualizzando segnalazioni critiche...', 'danger');
    } else if (priority === 'high') {
        window.adminDashboard.showNotification('Visualizzando segnalazioni ad alta priorità...', 'warning');
    }
    // TODO: Implementa filtro reale quando c'è il backend
    setTimeout(() => window.adminDashboard.loadReportsTable(), 500);
}

function editContent() {
    const section = document.querySelector('#content-section select').value;
    const modal = document.getElementById('generic-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = `Modifica: ${section}`;
    body.innerHTML = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>Modalità Demo:</strong> In produzione qui ci sarà l'editor WYSIWYG completo per modificare i contenuti.
        </div>

        <div class="form-group">
            <label for="content-title">Titolo Sezione</label>
            <input type="text" id="content-title" value="${section}" />
        </div>

        <div class="form-group">
            <label for="content-text">Contenuto HTML</label>
            <textarea id="content-text" rows="10" placeholder="Inserisci il contenuto HTML...">
<h2>Contenuto di esempio per ${section}</h2>
<p>Qui puoi modificare testi, immagini e layout della sezione selezionata.</p>
<p><strong>Funzionalità future:</strong></p>
<ul>
    <li>Editor WYSIWYG completo</li>
    <li>Upload immagini drag & drop</li>
    <li>Preview in tempo reale</li>
    <li>Ottimizzazione SEO automatica</li>
</ul>
            </textarea>
        </div>

        <div class="form-group">
            <label for="content-seo">Meta Description (SEO)</label>
            <input type="text" id="content-seo" placeholder="Descrizione per motori di ricerca..." maxlength="160" />
        </div>

        <div class="d-flex gap-10 justify-between mt-20">
            <button type="button" class="btn-secondary" onclick="adminDashboard.closeModal()">Annulla</button>
            <button type="button" class="btn-warning" onclick="previewContent()">Anteprima</button>
            <button type="button" class="btn-primary" onclick="saveContent()">Salva Modifiche</button>
        </div>
    `;

    modal.classList.add('active');
}

function previewContent() {
    window.adminDashboard.showNotification('Anteprima contenuti (richiede CMS integrato)', 'info');
}

function saveContent() {
    const title = document.getElementById('content-title')?.value;
    const content = document.getElementById('content-text')?.value;
    const seo = document.getElementById('content-seo')?.value;

    console.log('Save content:', { title, content, seo });
    window.adminDashboard.showNotification('Contenuti salvati con successo!', 'success');
    window.adminDashboard.closeModal();
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});