// Arquivo: report_script.js (Modificado para formatar data do gráfico como DD/MM/YYYY)

document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data (Coleção Fictícia) ---
    const mockReforestationData = [
        { user: "Alice", species: "Ipe", quantity: 15, date: "2025-04-10" },
        { user: "Bob", species: "Angico", quantity: 25, date: "2025-04-12" },
        { user: "Alice", species: "Aroeira", quantity: 10, date: "2025-04-15" },
        { user: "Charlie", species: "Ipe", quantity: 30, date: "2025-04-18" },
        { user: "Bob", species: "Ipe", quantity: 20, date: "2025-04-20" },
        { user: "Alice", species: "Jequitiba", quantity: 5, date: "2025-04-22" },
        { user: "Alice", species: "Ipe", quantity: 12, date: "2025-04-25" },
        { user: "Charlie", species: "PerobaCampo", quantity: 40, date: "2025-04-28" },
        { user: "Bob", species: "Angico", quantity: 18, date: "2025-05-01" },
        { user: "Alice", species: "Angico", quantity: 22, date: "2025-05-04" },
        // Adicione mais dados fictícios conforme necessário
    ];

    // --- Seletores ---
    const appContainer = document.getElementById('app-container');
    const searchForm = document.getElementById('report-search-form');
    const searchUserInput = document.getElementById('search-user');
    const searchSpeciesSelect = document.getElementById('search-species');
    const resultsContainer = document.getElementById('results-table-container');
    const chartCanvas = document.getElementById('planting-chart');
    let plantingChartInstance = null; // To hold the chart object

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

        // Cabeçalho da Tabela
        thead.innerHTML = `
            <tr>
                <th>Usuário</th>
                <th>Espécie</th>
                <th>Quantidade</th>
                <th>Data</th>
            </tr>
        `;

        // Linhas da Tabela
        const sortedDisplayData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        sortedDisplayData.forEach(record => {
            const row = tbody.insertRow();
            // Formata a data para a tabela também (DD/MM/YYYY)
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
        const noDataMessage = chartContainerDiv.querySelector('p');
        if (noDataMessage) noDataMessage.remove();


        if (!chartCanvas || !data || data.length === 0) {
            console.warn("Report: Canvas não encontrado ou sem dados para gerar gráfico.");
             if(chartContainerDiv && !chartContainerDiv.querySelector('h2')) {
                 chartContainerDiv.innerHTML = '<h2>Total de Árvores Plantadas (Acumulado)</h2>';
             }
             if(chartContainerDiv && !chartContainerDiv.querySelector('p')) {
                const p = document.createElement('p');
                p.textContent = 'Sem dados suficientes para exibir o gráfico com os filtros aplicados.';
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

        // **** MODIFICAÇÃO AQUI para formatar as labels do gráfico ****
        const labels = Object.keys(cumulativeData).map(dateKey =>
            new Date(dateKey + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            })
        );
        // **** FIM DA MODIFICAÇÃO ****
        const chartDataPoints = Object.values(cumulativeData);

        const chartConfig = {
            type: 'line',
            data: {
                labels: labels, // Labels formatadas como DD/MM/YYYY
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
                             text: 'Data (DD/MM/YYYY)' // Atualiza o título do eixo X para clareza
                        }
                    }
                }
            }
        };

        plantingChartInstance = new Chart(chartCanvas.getContext('2d'), chartConfig);
    }

    // --- Event Listener para o Formulário de Busca ---
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const searchTermUser = searchUserInput.value.trim().toLowerCase();
        const searchTermSpecies = searchSpeciesSelect.value;

        const filteredData = mockReforestationData.filter(record => {
            const userMatch = !searchTermUser || record.user.toLowerCase().includes(searchTermUser);
            const speciesMatch = !searchTermSpecies || record.species === searchTermSpecies;
            return userMatch && speciesMatch;
        });

        displayResults(filteredData); // Atualiza tabela
        generateChart(filteredData); // Atualiza gráfico com dados filtrados e labels formatadas
    });

    // --- Inicialização ---
    loadSavedTheme();
    displayResults(mockReforestationData);
    generateChart(mockReforestationData); // Gera gráfico inicial com labels formatadas

}); // Fim do DOMContentLoaded