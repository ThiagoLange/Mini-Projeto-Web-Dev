// Arquivo: report_script.js
// Modificado para buscar dados do backend e formatar data do gráfico como DD/MM/YYYY

document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data (Será substituído pela chamada ao backend) ---
    // const mockReforestationData = [
    //     { user: "Alice", species: "Ipe", quantity: 15, date: "2025-04-10" },
    //     { user: "Bob", species: "Angico", quantity: 25, date: "2025-04-12" },
    //     // ... mais dados mock
    // ];

    // --- Seletores ---
    const appContainer = document.getElementById('app-container');
    const searchForm = document.getElementById('report-search-form');
    const searchUserInput = document.getElementById('search-user');
    const searchSpeciesSelect = document.getElementById('search-species');
    const resultsContainer = document.getElementById('results-table-container');
    const chartCanvas = document.getElementById('planting-chart');
    let plantingChartInstance = null; // To hold the chart object
    let allReforestationData = []; // Para armazenar todos os dados vindos do backend

    // --- Funções de Tema ---
    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Report: Tema '${themeName}' aplicado.`);
        } else {
             console.log(`Report: Nenhum tema válido ('${themeName}') ou tema padrão.`);
        }
    }

    function loadSavedTheme() {
        try {
            const userTheme = localStorage.getItem('userTheme');
            applyTheme(userTheme);
        } catch (e) {
            console.error("Report: Erro ao carregar tema do localStorage:", e);
        }
    }

    // --- Função para Exibir Resultados da Busca ---
    function displayResults(data) {
        resultsContainer.innerHTML = ''; // Limpa resultados anteriores

        if (!data || data.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhum registro encontrado para os critérios informados.</p>';
            return;
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = `
            <tr>
                <th>Usuário</th>
                <th>Espécie</th>
                <th>Quantidade</th>
                <th>Data</th>
            </tr>
        `;

        const sortedDisplayData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        sortedDisplayData.forEach(record => {
            const row = tbody.insertRow();
            const displayDate = new Date(record.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
            row.innerHTML = `
                <td>${record.user}</td>
                <td>${record.species}</td>
                <td>${record.quantity}</td>
                <td>${displayDate}</td>
                 `;
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        resultsContainer.appendChild(table);
    }

    // --- Função para Gerar o Gráfico de Linha (Acumulado) ---
    function generateChart(data) {
         if (plantingChartInstance) {
            plantingChartInstance.destroy();
            plantingChartInstance = null;
        }

        const chartContainerDiv = document.getElementById('chart-container');
        const noDataMessage = chartContainerDiv.querySelector('p.no-data-message');
        if (noDataMessage) noDataMessage.remove();


        if (!chartCanvas || !data || data.length === 0) {
            console.warn("Report: Canvas não encontrado ou sem dados para gerar gráfico.");
             if(chartContainerDiv && !chartContainerDiv.querySelector('h2')) {
                 const h2 = document.createElement('h2');
                 h2.textContent = 'Total de Árvores Plantadas (Acumulado)';
                 chartContainerDiv.insertBefore(h2, chartCanvas);
             }
             if(chartContainerDiv && !chartContainerDiv.querySelector('p.no-data-message')) {
                const p = document.createElement('p');
                p.textContent = 'Sem dados suficientes para exibir o gráfico com os filtros aplicados.';
                p.className = 'no-data-message';
                chartContainerDiv.appendChild(p);
             }
             if (chartCanvas) chartCanvas.style.display = 'none';
            return;
        }

        if (chartCanvas) chartCanvas.style.display = 'block';

        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

        const cumulativeData = {};
        let cumulativeTotal = 0;
        sortedData.forEach(record => {
            cumulativeTotal += record.quantity;
            const dateKey = record.date;
            cumulativeData[dateKey] = cumulativeTotal;
        });

        const labels = Object.keys(cumulativeData).map(dateKey =>
            new Date(dateKey + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            })
        );
        const chartDataPoints = Object.values(cumulativeData);

        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Acumulado de Árvores (Filtrado)',
                    data: chartDataPoints,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Crucial para respeitar altura do container CSS
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolução do Plantio (Conforme Filtro Aplicado)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                             display: true,
                             text: 'Quantidade Acumulada'
                        }
                    },
                    x: {
                         title: {
                             display: true,
                             text: 'Data (DD/MM/YYYY)'
                        }
                    }
                }
            }
        };

        if (chartCanvas.getContext('2d')) {
            plantingChartInstance = new Chart(chartCanvas.getContext('2d'), chartConfig);
        } else {
            console.error("Report: Contexto 2D do canvas não pôde ser obtido.");
        }
    }

    // --- Event Listener para o Formulário de Busca ---
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const searchTermUser = searchUserInput.value.trim().toLowerCase();
            const searchTermSpecies = searchSpeciesSelect.value;

            const filteredData = allReforestationData.filter(record => {
                const userMatch = !searchTermUser || (record.user && record.user.toLowerCase().includes(searchTermUser));
                const speciesMatch = !searchTermSpecies || record.species === searchTermSpecies;
                return userMatch && speciesMatch;
            });

            displayResults(filteredData);
            generateChart(filteredData);
        });
    } else {
        console.error("Report: Formulário de busca #report-search-form não encontrado.");
    }

    /* --- CÓDIGO PARA BUSCAR DADOS DO BACKEND ---
    // Esta função será chamada para obter os dados de reflorestamento.
    // Substitua '/api/reforestation-data' pela URL REAL do seu endpoint de backend.

    async function fetchReforestationDataFromBackend() {
        const loadingMessageArea = resultsContainer; 
        loadingMessageArea.innerHTML = '<p>Carregando dados do relatório...</p>';

        try {
            // const response = await fetch('/api/reforestation-data', { // EXEMPLO DE ENDPOINT
            //     method: 'GET', 
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // 'Authorization': 'Bearer SEU_TOKEN_JWT_AQUI' // Se a API for protegida
            //     }
            // });

            // ---- INÍCIO: Simulação de chamada de API para TESTE LOCAL ----
            console.warn("Usando dados MOCK para simulação de API. Comente/remova para produção.");
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            const mockBackendResponse = [ 
                { user: "Alice", species: "Ipe", quantity: 15, date: "2025-04-10" },
                { user: "Bob", species: "Angico", quantity: 25, date: "2025-04-12" },
                { user: "Alice", species: "Aroeira", quantity: 10, date: "2025-04-15" },
                { user: "Charlie", species: "Ipe", quantity: 30, date: "2025-04-18" },
                { user: "Bob", species: "Ipe", quantity: 20, date: "2025-04-20" },
                { user: "Alice", species: "Jequitiba", quantity: 5, date: "2025-04-22" },
                { user: "Alice", species: "Ipe", quantity: 12, date: "2025-04-25" },
                { user: "David", species: "PerobaCampo", quantity: 40, date: "2025-04-28" },
                { user: "Bob", species: "Angico", quantity: 18, date: "2025-05-01" },
                { user: "Eve", species: "Angico", quantity: 22, date: "2025-05-04" },
                { user: "Frank", species: "Ipe", quantity: 50, date: "2025-05-05" },
                { user: "Grace", species: "Aroeira", quantity: 35, date: "2025-05-07" }
            ];
            const response = { 
                ok: true,
                json: async () => mockBackendResponse,
                status: 200,
                statusText: "OK (Mocked)"
            };
            // ---- FIM: Simulação de chamada de API ----


            if (response.ok) {
                const data = await response.json();
                console.log("Dados recebidos do backend (ou mock):", data);
                allReforestationData = data; 
                
                if (data.length === 0) {
                    loadingMessageArea.innerHTML = '<p>Nenhum dado de reflorestamento encontrado no servidor.</p>';
                    const chartContainerDiv = document.getElementById('chart-container');
                    if (plantingChartInstance) plantingChartInstance.destroy();
                    if (chartCanvas) chartCanvas.style.display = 'none';
                    const noDataGraphMsg = chartContainerDiv.querySelector('p.no-data-message');
                    if (noDataGraphMsg) noDataGraphMsg.remove();
                    if(chartContainerDiv && !chartContainerDiv.querySelector('p.no-data-message')) {
                        const p = document.createElement('p');
                        p.textContent = 'Sem dados para exibir o gráfico.';
                        p.className = 'no-data-message';
                        chartContainerDiv.appendChild(p);
                    }
                } else {
                    displayResults(allReforestationData); 
                    generateChart(allReforestationData); 
                }
            } else {
                const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status} ao buscar dados: ${response.statusText}` }));
                console.error("Erro do backend ao buscar dados do relatório:", errorResult);
                loadingMessageArea.innerHTML = `<p>Falha ao carregar dados do relatório: ${errorResult.message}</p>`;
            }
        } catch (networkError) {
            console.error("Erro de rede ao buscar dados do relatório:", networkError);
            loadingMessageArea.innerHTML = `<p>Erro de conexão ao tentar buscar dados do relatório. Verifique sua rede.</p>`;
        }
    }
    --- FIM DO CÓDIGO PARA BUSCAR DADOS DO BACKEND --- */

    // --- Inicialização ---
    loadSavedTheme();

    // DESCOMENTE a linha abaixo para ativar a busca de dados do backend:
    // fetchReforestationDataFromBackend(); 

    if (typeof fetchReforestationDataFromBackend === 'undefined' || !fetchReforestationDataFromBackend) {
        console.warn("Report: 'fetchReforestationDataFromBackend' não está definido ou não foi chamado. Usando dados mock estáticos para exibição inicial.");
        allReforestationData = [ 
                { user: "Alice (mock)", species: "Ipe", quantity: 15, date: "2025-04-10" },
                { user: "Bob (mock)", species: "Angico", quantity: 25, date: "2025-04-12" },
                { user: "Alice (mock)", species: "Aroeira", quantity: 10, date: "2025-04-15" },
        ];
        if (allReforestationData.length > 0) {
            displayResults(allReforestationData);
            generateChart(allReforestationData);
        } else {
            resultsContainer.innerHTML = '<p>Nenhum dado de demonstração para exibir. Configure a busca ao backend.</p>';
            const chartContainerDiv = document.getElementById('chart-container');
            if (chartCanvas) chartCanvas.style.display = 'none';
             if(chartContainerDiv && !chartContainerDiv.querySelector('p.no-data-message')) {
                const p = document.createElement('p');
                p.textContent = 'Sem dados para exibir o gráfico.';
                p.className = 'no-data-message';
                chartContainerDiv.appendChild(p);
             }
        }
    } else {
         fetchReforestationDataFromBackend(); 
    }

}); // Fim do DOMContentLoaded