// Arquivo: report_script.js
// Configurado para buscar dados do backend.
// A simulação de API agora usa dados do localStorage para refletir o perfil.

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores ---
    const appContainer = document.getElementById('app-container');
    const searchForm = document.getElementById('report-search-form');
    const searchUserInput = document.getElementById('search-user');
    const searchSpeciesSelect = document.getElementById('search-species');
    const resultsContainer = document.getElementById('results-table-container');
    const chartCanvas = document.getElementById('planting-chart');
    let plantingChartInstance = null;
    let allReforestationData = []; // Armazenará os dados vindos do backend ou da simulação

    // --- Funções de Tema ---
    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
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

    // --- Função para Exibir Resultados da Busca na Tabela ---
    function displayResults(data) {
        resultsContainer.innerHTML = '';

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
                <td>${record.user || 'N/A'}</td>
                <td>${record.species || 'N/A'}</td>
                <td>${record.quantity || 0}</td>
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
            if (chartContainerDiv && !chartContainerDiv.querySelector('h2')) {
                const h2 = document.createElement('h2');
                h2.textContent = 'Total de Árvores Plantadas (Acumulado)';
                chartContainerDiv.insertBefore(h2, chartCanvas);
            }
            if (chartContainerDiv && !chartContainerDiv.querySelector('p.no-data-message')) {
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
            cumulativeTotal += record.quantity; // Certifique-se que quantity é um número
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
                maintainAspectRatio: false,
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

    // --- FUNÇÃO PARA BUSCAR DADOS (DO BACKEND OU SIMULADOS) ---
    async function fetchReforestationData() {
        const loadingMessageArea = resultsContainer;
        loadingMessageArea.innerHTML = '<p>Carregando dados do relatório...</p>';
        if (plantingChartInstance) {
            plantingChartInstance.destroy();
            plantingChartInstance = null;
        }
        if (chartCanvas) chartCanvas.style.display = 'none';
        const existingNoDataMessage = document.querySelector('#chart-container p.no-data-message');
        if(existingNoDataMessage) existingNoDataMessage.remove();

        try {
            // ***** INÍCIO: CÓDIGO REAL PARA CHAMADA AO BACKEND (COMENTADO) *****
            // Substitua '/api/reforestation-data' pela URL REAL do seu endpoint.
            // Descomente este bloco e comente/remova o bloco de SIMULAÇÃO abaixo.
            /*
            console.log("Tentando buscar dados do BACKEND REAL...");
            const response = await fetch('/api/reforestation-data', { // EXEMPLO DE ENDPOINT
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer SEU_TOKEN_JWT_AQUI' // Se a API for protegida
                }
            });
            */
            // ***** FIM: CÓDIGO REAL PARA CHAMADA AO BACKEND *****


            // ***** INÍCIO: SIMULAÇÃO DE CHAMADA DE API USANDO DADOS DO LOCALSTORAGE (PERFIL) *****
            // Este bloco simula uma resposta da API para que o script funcione sem um backend.
            // Ele lê os dados do localStorage, que são os mesmos exibidos no perfil.
            console.warn("Usando dados SIMULADOS do localStorage para o relatório. Comente/remova para produção com backend.");
            await new Promise(resolve => setTimeout(resolve, 500)); // Simula pequeno atraso da rede

            let simulatedDataFromProfile = [];
            const loggedUser = localStorage.getItem('userName'); // Pega o usuário "logado"

            if (loggedUser) {
                const speciesTypes = ["Ipe", "Angico", "Aroeira", "Jequitiba", "PerobaCampo"];
                let dateEntryOffset = 0; // Para variar as datas fictícias

                speciesTypes.forEach(species => {
                    const totalSpeciesCount = parseInt(localStorage.getItem(`treesPlanted_${species}`) || '0', 10);

                    if (totalSpeciesCount > 0) {
                        // Lógica para criar múltiplos registros que somem o totalSpeciesCount
                        let countRemaining = totalSpeciesCount;
                        while (countRemaining > 0) {
                            // Gera uma quantidade aleatória para esta entrada, até um máximo (ex: 15 ou o restante)
                            let quantityForThisEntry = Math.min(countRemaining, Math.floor(Math.random() * 15) + 1);
                             if (quantityForThisEntry <= 0 && countRemaining > 0) quantityForThisEntry = countRemaining; // Garante que se retire algo

                            simulatedDataFromProfile.push({
                                user: loggedUser,
                                species: species,
                                quantity: quantityForThisEntry,
                                // Gera datas fictícias retroativas simples
                                date: new Date(Date.now() - (dateEntryOffset * 3 + Math.floor(Math.random()*3)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                            });
                            countRemaining -= quantityForThisEntry;
                            dateEntryOffset++;
                        }
                    }
                });
            }

            // Fallback se não houver dados no localStorage para simular
            if (simulatedDataFromProfile.length === 0 && loggedUser) {
                 console.log(`Nenhum dado de plantio encontrado no localStorage para o usuário '${loggedUser}'. Exibindo mock padrão.`);
                 simulatedDataFromProfile.push({ user: loggedUser, species: "Exemplo Ipê", quantity: 5, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]});
                 simulatedDataFromProfile.push({ user: loggedUser, species: "Exemplo Angico", quantity: 8, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]});
            } else if (simulatedDataFromProfile.length === 0 && !loggedUser) {
                console.log("Nenhum usuário logado e nenhum dado no localStorage. Exibindo mock genérico.");
                simulatedDataFromProfile.push({ user: "Visitante Mock", species: "Ipê Genérico", quantity: 10, date: "2025-05-01" });
                simulatedDataFromProfile.push({ user: "Visitante Mock", species: "Angico Genérico", quantity: 15, date: "2025-05-05" });
            }

            const response = { // Simula o objeto de resposta do fetch
                ok: true,
                json: async () => simulatedDataFromProfile, // Usa os dados simulados
                status: 200,
                statusText: "OK (Simulated from LocalStorage)"
            };
            // ***** FIM: SIMULAÇÃO DE CHAMADA DE API *****


            if (response.ok) {
                const data = await response.json();
                console.log("Dados para o relatório (simulados do localStorage ou do backend):", data);
                allReforestationData = data.map(d => ({...d, quantity: Number(d.quantity) || 0})); // Garante que quantity é número

                if (allReforestationData.length === 0) {
                    loadingMessageArea.innerHTML = '<p>Nenhum dado de reflorestamento encontrado.</p>';
                    const chartContainerDiv = document.getElementById('chart-container');
                    // ... (lógica para limpar mensagem de "sem dados" do gráfico)
                } else {
                    displayResults(allReforestationData);
                    generateChart(allReforestationData);
                }
            } else {
                // ... (tratamento de erro do backend)
                const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status} ao buscar dados: ${response.statusText}` }));
                console.error("Erro do backend ao buscar dados do relatório:", errorResult);
                loadingMessageArea.innerHTML = `<p>Falha ao carregar dados do relatório: ${errorResult.message}</p>`;
            }
        } catch (networkError) {
            // ... (tratamento de erro de rede)
            console.error("Erro de rede ao buscar dados do relatório:", networkError);
            loadingMessageArea.innerHTML = `<p>Erro de conexão ao tentar buscar dados do relatório. Verifique sua rede.</p>`;
        }
    }

    // --- Inicialização ---
    loadSavedTheme(); // Carrega o tema do usuário
    fetchReforestationData(); // Busca os dados (simulados do localStorage ou do backend)

}); // Fim do DOMContentLoaded