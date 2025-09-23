/* ===============================================
   RELAXPOINT - JAVASCRIPT STATISTICHE PROFESSIONISTA
   Gestisce Chart.js e tutte le funzionalità dashboard statistiche
   =============================================== */

console.log('Caricamento statistiche JavaScript...');

// ===============================================
// DATI SIMULATI
// ===============================================
const statsData = {
    // Dati per 7 giorni
    7: {
        revenue: {
            total: 650,
            trend: '+15.2%',
            data: [85, 92, 78, 105, 88, 102, 95],
            labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
        },
        bookings: {
            total: 12,
            trend: '+3',
            data: [2, 1, 3, 2, 2, 1, 1],
            labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
        },
        services: {
            labels: ['Massaggio Hot Stone', 'Massaggio Svedese', 'Riflessologia', 'Massaggio Sportivo'],
            data: [280, 180, 120, 70],
            bookings: [4, 2, 3, 3]
        }
    },
    // Dati per 30 giorni (default)
    30: {
        revenue: {
            total: 2340,
            trend: '+12.5%',
            data: [45, 52, 48, 61, 55, 59, 62, 58, 65, 71, 68, 72, 78, 75, 82, 85, 79, 88, 92, 89, 95, 98, 102, 105, 108, 112, 115, 118, 122, 125],
            labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
        },
        bookings: {
            total: 47,
            trend: '+8',
            data: [1, 2, 1, 3, 2, 2, 3, 2, 3, 4, 3, 3, 4, 3, 4, 4, 3, 4, 5, 4, 4, 5, 5, 5, 6, 6, 5, 6, 7, 6],
            labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`)
        },
        services: {
            labels: ['Massaggio Hot Stone', 'Massaggio Svedese', 'Riflessologia', 'Massaggio Sportivo', 'Aromaterapia'],
            data: [960, 560, 420, 400, 220],
            bookings: [12, 8, 6, 5, 3]
        }
    },
    // Dati per 90 giorni
    90: {
        revenue: {
            total: 6850,
            trend: '+18.7%',
            data: Array.from({ length: 90 }, (_, i) => Math.floor(Math.random() * 40) + 60 + (i * 0.3)),
            labels: Array.from({ length: 90 }, (_, i) => `${i + 1}`)
        },
        bookings: {
            total: 142,
            trend: '+23',
            data: Array.from({ length: 90 }, (_, i) => Math.floor(Math.random() * 4) + 1 + Math.floor(i / 30)),
            labels: Array.from({ length: 90 }, (_, i) => `${i + 1}`)
        },
        services: {
            labels: ['Massaggio Hot Stone', 'Massaggio Svedese', 'Riflessologia', 'Massaggio Sportivo', 'Aromaterapia'],
            data: [2840, 1680, 1260, 800, 570],
            bookings: [36, 24, 18, 10, 8]
        }
    },
    // Dati per 365 giorni
    365: {
        revenue: {
            total: 28450,
            trend: '+24.3%',
            data: Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 800) + 2000 + (i * 50)),
            labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
        },
        bookings: {
            total: 568,
            trend: '+87',
            data: Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 20) + 35 + (i * 2)),
            labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
        },
        services: {
            labels: ['Massaggio Hot Stone', 'Massaggio Svedese', 'Riflessologia', 'Massaggio Sportivo', 'Aromaterapia', 'Coaching'],
            data: [11200, 6800, 4200, 3200, 2100, 950],
            bookings: [140, 97, 68, 42, 30, 15]
        }
    }
};

// Dati orari fissi
const timeData = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    revenue: [120, 280, 180, 320, 260, 180, 140],
    bookings: [2, 6, 3, 8, 5, 3, 2]
};

// ===============================================
// VARIABILI GLOBALI
// ===============================================
let currentPeriod = 30;
let charts = {};

// ===============================================
// INIZIALIZZAZIONE
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM caricato, inizializzando statistiche...');

    setupPeriodFilter();
    setupExportButton();
    initializeCharts();
    updateKPIs();

    console.log('Statistiche inizializzate con successo');
    showMessage('Dashboard statistiche caricata', 'success');
});

// ===============================================
// SETUP FILTRI E CONTROLLI
// ===============================================
function setupPeriodFilter() {
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        periodFilter.addEventListener('change', function () {
            currentPeriod = parseInt(this.value);
            console.log('Periodo cambiato a:', currentPeriod, 'giorni');

            updateAllCharts();
            updateKPIs();
            updatePeriodLabels();

            showMessage(`Dati aggiornati: ultimi ${currentPeriod} giorni`, 'info');
        });
        console.log('Filtro periodo collegato');
    }
}

function setupExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            showExportModal();
        });
        console.log('Bottone export collegato');
    }
}

// ===============================================
// SISTEMA EXPORT COMPLETO
// ===============================================

function showExportModal() {
    // Rimuovi modal esistente se presente
    const existingModal = document.querySelector('.export-modal');
    if (existingModal) existingModal.remove();

    // Crea modal export
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
        <div class="export-modal-overlay">
            <div class="export-modal-content">
                <div class="export-header">
                    <h3>Esporta Statistiche</h3>
                    <button class="export-close" onclick="closeExportModal()">×</button>
                </div>
                <div class="export-body">
                    <p>Seleziona il formato di export desiderato:</p>
                    <div class="export-options">
                        <button class="export-option" onclick="exportToCSV()">
                            <div class="export-icon">📊</div>
                            <div class="export-info">
                                <div class="export-title">CSV</div>
                                <div class="export-desc">Dati tabellari per Excel</div>
                            </div>
                        </button>
                        <button class="export-option" onclick="exportToPDF()">
                            <div class="export-icon">📄</div>
                            <div class="export-info">
                                <div class="export-title">PDF Report</div>
                                <div class="export-desc">Report completo con grafici</div>
                            </div>
                        </button>
                        <button class="export-option" onclick="exportToJSON()">
                            <div class="export-icon">🔧</div>
                            <div class="export-info">
                                <div class="export-title">JSON</div>
                                <div class="export-desc">Dati raw per sviluppatori</div>
                            </div>
                        </button>
                        <button class="export-option" onclick="printReport()">
                            <div class="export-icon">🖨️</div>
                            <div class="export-info">
                                <div class="export-title">Stampa</div>
                                <div class="export-desc">Versione stampabile</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Aggiungi stili modal
    const style = document.createElement('style');
    style.textContent = `
        .export-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
        }
        .export-modal-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .export-modal-content {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        .export-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 24px 0 24px;
        }
        .export-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
        }
        .export-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #6b7280;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
        }
        .export-body {
            padding: 24px;
        }
        .export-body p {
            margin: 0 0 20px 0;
            color: #6b7280;
        }
        .export-options {
            display: grid;
            gap: 12px;
        }
        .export-option {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
        }
        .export-option:hover {
            border-color: #2d5a3d;
            background: #f9fafb;
        }
        .export-icon {
            font-size: 24px;
        }
        .export-info {
            flex: 1;
        }
        .export-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
        }
        .export-desc {
            font-size: 14px;
            color: #6b7280;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Chiudi cliccando overlay
    modal.querySelector('.export-modal-overlay').addEventListener('click', function (e) {
        if (e.target === this) closeExportModal();
    });
}

function closeExportModal() {
    const modal = document.querySelector('.export-modal');
    if (modal) modal.remove();
}

// Export CSV
function exportToCSV() {
    console.log('Esportando CSV...');

    const data = statsData[currentPeriod];
    const periodText = getPeriodText(currentPeriod);

    let csvContent = `RelaxPoint - Statistiche Business (${periodText})\n\n`;

    // KPI Summary
    csvContent += "RIEPILOGO KPI\n";
    csvContent += "Metrica,Valore,Trend\n";
    csvContent += `Revenue Totale,€${data.revenue.total.toLocaleString()},${data.revenue.trend}\n`;
    csvContent += `Prenotazioni Totali,${data.bookings.total},${data.bookings.trend}\n`;
    csvContent += "Rating Medio,4.8,+0.2\n";
    csvContent += "Tasso Completamento,96%,+2%\n\n";

    // Revenue giornaliero
    csvContent += "REVENUE GIORNALIERO\n";
    csvContent += "Giorno,Revenue\n";
    data.revenue.labels.forEach((label, index) => {
        csvContent += `${label},€${data.revenue.data[index]}\n`;
    });
    csvContent += "\n";

    // Performance servizi
    csvContent += "PERFORMANCE SERVIZI\n";
    csvContent += "Servizio,Revenue,Prenotazioni\n";
    data.services.labels.forEach((label, index) => {
        csvContent += `${label},€${data.services.data[index]},${data.services.bookings[index]}\n`;
    });
    csvContent += "\n";

    // Analisi orari
    csvContent += "ANALISI ORARI\n";
    csvContent += "Fascia Oraria,Revenue,Prenotazioni\n";
    timeData.labels.forEach((label, index) => {
        csvContent += `${label},€${timeData.revenue[index]},${timeData.bookings[index]}\n`;
    });

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relaxpoint_statistiche_${currentPeriod}giorni_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeExportModal();
    showMessage('File CSV scaricato con successo!', 'success');
}

// Export PDF
function exportToPDF() {
    console.log('Esportando PDF...');

    // Crea contenuto HTML per PDF
    const data = statsData[currentPeriod];
    const periodText = getPeriodText(currentPeriod);

    const pdfContent = `
        <html>
        <head>
            <title>RelaxPoint - Report Statistiche</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 20px; }
                .header h1 { color: #2d5a3d; margin: 0; }
                .header p { color: #666; margin: 10px 0 0 0; }
                .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
                .kpi-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center; }
                .kpi-value { font-size: 32px; font-weight: bold; color: #2d5a3d; margin: 10px 0; }
                .kpi-label { color: #666; font-size: 14px; text-transform: uppercase; }
                .kpi-trend { color: #059669; font-weight: bold; }
                .section { margin: 40px 0; }
                .section h2 { color: #2d5a3d; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #f8f9fa; font-weight: bold; }
                .footer { text-align: center; margin-top: 60px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RelaxPoint - Report Statistiche Business</h1>
                <p>${periodText} • Generato il ${new Date().toLocaleDateString('it-IT')}</p>
            </div>
            
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Revenue Totale</div>
                    <div class="kpi-value">€${data.revenue.total.toLocaleString()}</div>
                    <div class="kpi-trend">${data.revenue.trend}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Prenotazioni</div>
                    <div class="kpi-value">${data.bookings.total}</div>
                    <div class="kpi-trend">${data.bookings.trend}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Rating Medio</div>
                    <div class="kpi-value">4.8</div>
                    <div class="kpi-trend">+0.2</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Completamento</div>
                    <div class="kpi-value">96%</div>
                    <div class="kpi-trend">+2%</div>
                </div>
            </div>
            
            <div class="section">
                <h2>Performance Servizi</h2>
                <table>
                    <tr><th>Servizio</th><th>Revenue</th><th>Prenotazioni</th></tr>
                    ${data.services.labels.map((label, i) => `
                        <tr>
                            <td>${label}</td>
                            <td>€${data.services.data[i].toLocaleString()}</td>
                            <td>${data.services.bookings[i]}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            
            <div class="section">
                <h2>Analisi Fasce Orarie</h2>
                <table>
                    <tr><th>Fascia Oraria</th><th>Revenue</th><th>Prenotazioni</th></tr>
                    ${timeData.labels.map((label, i) => `
                        <tr>
                            <td>${label}</td>
                            <td>€${timeData.revenue[i]}</td>
                            <td>${timeData.bookings[i]}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            
            <div class="footer">
                <p>RelaxPoint © 2024 - Report generato automaticamente dalla dashboard professionista</p>
            </div>
        </body>
        </html>
    `;

    // Apri finestra di stampa con contenuto PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.print();

    closeExportModal();
    showMessage('Report PDF aperto per la stampa', 'success');
}

// Export JSON
function exportToJSON() {
    console.log('Esportando JSON...');

    const exportData = {
        generated: new Date().toISOString(),
        period: currentPeriod,
        periodText: getPeriodText(currentPeriod),
        kpis: {
            revenue: {
                total: statsData[currentPeriod].revenue.total,
                trend: statsData[currentPeriod].revenue.trend
            },
            bookings: {
                total: statsData[currentPeriod].bookings.total,
                trend: statsData[currentPeriod].bookings.trend
            },
            rating: { total: 4.8, trend: '+0.2' },
            completion: { total: '96%', trend: '+2%' }
        },
        charts: {
            revenue: {
                labels: statsData[currentPeriod].revenue.labels,
                data: statsData[currentPeriod].revenue.data
            },
            bookings: {
                labels: statsData[currentPeriod].bookings.labels,
                data: statsData[currentPeriod].bookings.data
            },
            services: {
                labels: statsData[currentPeriod].services.labels,
                revenue: statsData[currentPeriod].services.data,
                bookings: statsData[currentPeriod].services.bookings
            },
            timeAnalysis: timeData
        }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relaxpoint_stats_${currentPeriod}days_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeExportModal();
    showMessage('File JSON scaricato con successo!', 'success');
}

// Stampa report
function printReport() {
    console.log('Aprendo stampa...');
    closeExportModal();
    window.print();
    showMessage('Finestra stampa aperta', 'info');
}

// ===============================================
// INIZIALIZZAZIONE GRAFICI
// ===============================================
function initializeCharts() {
    console.log('Inizializzando grafici Chart.js...');

    initRevenueChart();
    initServicesChart();
    initBookingsChart();
    initTimeChart();

    console.log('Tutti i grafici inizializzati');
}

// Grafico Revenue Trend
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const data = statsData[currentPeriod];

    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.revenue.labels,
            datasets: [{
                label: 'Revenue Giornaliero',
                data: data.revenue.data,
                borderColor: '#2d5a3d',
                backgroundColor: 'rgba(45, 90, 61, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2d5a3d',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        },
                        callback: function (value) {
                            return '€' + value;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    console.log('Grafico revenue inizializzato');
}

// Grafico Performance Servizi
function initServicesChart() {
    const ctx = document.getElementById('servicesChart');
    if (!ctx) return;

    const data = statsData[currentPeriod];

    charts.services = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.services.labels,
            datasets: [{
                data: data.services.data,
                backgroundColor: [
                    '#2d5a3d',
                    '#52a373',
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#8b5cf6'
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        },
                        color: '#64748b'
                    }
                }
            },
            cutout: '60%'
        }
    });

    console.log('Grafico servizi inizializzato');
}

// Grafico Volume Prenotazioni
function initBookingsChart() {
    const ctx = document.getElementById('bookingsChart');
    if (!ctx) return;

    const data = statsData[currentPeriod];

    charts.bookings = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.bookings.labels,
            datasets: [{
                label: 'Prenotazioni',
                data: data.bookings.data,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        },
                        stepSize: 1
                    }
                }
            }
        }
    });

    console.log('Grafico prenotazioni inizializzato');
}

// Grafico Analisi Orari
function initTimeChart() {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;

    charts.time = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: timeData.labels,
            datasets: [{
                label: 'Revenue per Orario',
                data: timeData.revenue,
                backgroundColor: 'rgba(45, 90, 61, 0.8)',
                borderColor: '#2d5a3d',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        },
                        callback: function (value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });

    console.log('Grafico orari inizializzato');
}

// ===============================================
// AGGIORNAMENTO DATI
// ===============================================
function updateAllCharts() {
    console.log('Aggiornando tutti i grafici per periodo:', currentPeriod);

    const data = statsData[currentPeriod];

    // Aggiorna Revenue Chart
    if (charts.revenue) {
        charts.revenue.data.labels = data.revenue.labels;
        charts.revenue.data.datasets[0].data = data.revenue.data;
        charts.revenue.update('smooth');
    }

    // Aggiorna Services Chart
    if (charts.services) {
        charts.services.data.labels = data.services.labels;
        charts.services.data.datasets[0].data = data.services.data;
        charts.services.update('smooth');
    }

    // Aggiorna Bookings Chart
    if (charts.bookings) {
        charts.bookings.data.labels = data.bookings.labels;
        charts.bookings.data.datasets[0].data = data.bookings.data;
        charts.bookings.update('smooth');
    }

    console.log('Grafici aggiornati');
}

function updateKPIs() {
    console.log('Aggiornando KPI per periodo:', currentPeriod);

    const data = statsData[currentPeriod];

    // Revenue
    updateElement('totalRevenue', '€' + data.revenue.total.toLocaleString());
    updateElement('revenueTrend', data.revenue.trend);

    // Bookings
    updateElement('totalBookings', data.bookings.total);
    updateElement('bookingsTrend', data.bookings.trend);

    // Rating (fisso)
    updateElement('avgRating', '4.8');
    updateElement('ratingTrend', '+0.2');

    // Completion (fisso)
    updateElement('completionRate', '96%');
    updateElement('completionTrend', '+2%');

    console.log('KPI aggiornati');
}

function updatePeriodLabels() {
    const periodText = getPeriodText(currentPeriod);

    updateElement('revenuePeriod', periodText);
    updateElement('bookingsPeriod', periodText);
    updateElement('summaryPeriod', periodText);

    console.log('Label periodo aggiornate');
}

function getPeriodText(days) {
    switch (days) {
        case 7: return 'Ultimi 7 giorni';
        case 30: return 'Ultimi 30 giorni';
        case 90: return 'Ultimi 90 giorni';
        case 365: return 'Ultimo anno';
        default: return `Ultimi ${days} giorni`;
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// ===============================================
// SISTEMA MESSAGGI
// ===============================================
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

console.log('Statistiche JavaScript caricato completamente');