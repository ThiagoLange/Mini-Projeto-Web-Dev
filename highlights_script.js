// Arquivo: highlights_script.js
// Usa dados do localStorage e inclui exemplo COMENTADO de busca de dados do backend

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const highlightsContainer = document.getElementById('highlights-container');

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
            console.error("Highlights: Erro ao carregar tema:", e);
        }
    }

    // --- Função para Determinar o Nome do Arquivo do Avatar ---
    function getAvatarFilename(treeAvatarValue) {
        switch (treeAvatarValue) {
            case 'pau-brasil': return 'pau-brasil.jpg';
            case 'castanheira': return 'castanheira.jpeg';
            case 'peroba-rosa': return 'Peroba-rosa.jpg';
            default: return 'placeholder_tree.png';
        }
    }

    // --- Função para Exibir os Destaques ---
    // Tornada async para o caso de usar o fetch do backend (comentado)
    async function displayHighlights() {
        if (!highlightsContainer) {
            console.error("Highlights: Container #highlights-container não encontrado.");
            return;
        }
        highlightsContainer.innerHTML = '<p>Carregando destaques...</p>'; // Mensagem de carregamento

        let topUsersData = [];

        // --- LÓGICA ATUAL: Carregar dados do localStorage ---
        try {
            const reforestationLogEntries = JSON.parse(localStorage.getItem('reforestationLogEntries')) || [];
            const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];

            if (reforestationLogEntries.length === 0) {
                highlightsContainer.innerHTML = '<p>Ainda não há registros de plantio para mostrar destaques.</p>';
                return;
            }

            const userTotals = reforestationLogEntries.reduce((acc, record) => {
                acc[record.username] = (acc[record.username] || 0) + record.quantity;
                return acc;
            }, {});

            const usersWithTotalsAndAvatars = Object.entries(userTotals).map(([username, totalTrees]) => {
                const userProfileInfo = userProfiles.find(profile => profile.username === username);
                return {
                    username: username,
                    totalTrees: totalTrees,
                    treeAvatar: userProfileInfo ? userProfileInfo.treeAvatar : null
                };
            });

            const sortedUsers = usersWithTotalsAndAvatars.sort((a, b) => b.totalTrees - a.totalTrees);
            topUsersData = sortedUsers.slice(0, 3);

        } catch (e) {
            console.error("Highlights: Erro ao processar dados do localStorage:", e);
            highlightsContainer.innerHTML = '<p>Erro ao carregar destaques.</p>';
            return;
        }
        // --- FIM DA LÓGICA ATUAL ---


        /* --- EXEMPLO DE COMO BUSCAR DADOS DE DESTAQUE DO BACKEND (COMENTADO) ---
        // Esta função substituiria a lógica de localStorage acima se fosse usada.
        
        async function fetchHighlightsDataFromBackend() {
            console.log("Buscando dados de destaques do backend...");
            // const highlightsButton = document.getElementById('algum-botao-de-atualizar-destaques'); // Exemplo
            // if(highlightsButton) highlightsButton.disabled = true;

            try {
                // Substitua '/api/highlights' pela URL REAL do seu endpoint
                // Este endpoint idealmente já retornaria os top N usuários com seus totais e avatares.
                const response = await fetch('/api/highlights?top=3', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        // 'Authorization': 'Bearer SEU_TOKEN_JWT_AQUI' // Se API protegida
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Espera-se que 'data' seja um array de objetos como:
                    // [{ username: "Nome", totalTrees: QTD, treeAvatar: "tipo-avatar" }, ...]
                    console.log("Dados de destaques recebidos do backend:", data);
                    return data; 
                } else {
                    const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status} ao buscar destaques.` }));
                    console.error("Erro do backend ao buscar destaques:", errorResult);
                    highlightsContainer.innerHTML = `<p>Erro ao carregar destaques do servidor: ${errorResult.message}</p>`;
                    return [];
                }
            } catch (networkError) {
                console.error("Erro de rede ao buscar destaques:", networkError);
                highlightsContainer.innerHTML = `<p>Erro de conexão ao carregar destaques. Verifique sua rede.</p>`;
                return [];
            } finally {
                // if(highlightsButton) highlightsButton.disabled = false;
            }
        }

        // Para usar o backend, você chamaria a função aqui:
        // topUsersData = await fetchHighlightsDataFromBackend();
        --- FIM DO EXEMPLO DE BACKEND --- */


        // --- Renderização dos Destaques (comum para localStorage ou backend) ---
        highlightsContainer.innerHTML = ''; // Limpa "Carregando..." ou erros anteriores
        if (topUsersData.length === 0) {
            highlightsContainer.innerHTML = '<p>Ainda não há dados de destaque suficientes.</p>';
            return;
        }

        topUsersData.forEach(user => {
            const userBlock = document.createElement('div');
            userBlock.className = 'user-highlight-block';

            const avatarFilename = getAvatarFilename(user.treeAvatar);
            const img = document.createElement('img');
            img.src = `images/${avatarFilename}`;
            img.alt = `Avatar de ${user.username}`;
            img.onerror = () => {
                img.src = 'images/placeholder_tree.png';
                img.alt = 'Avatar Padrão';
            };

            const name = document.createElement('p');
            name.textContent = user.username;
            // Opcional: Exibir contagem de árvores no destaque
            // const treeCountInfo = document.createElement('span');
            // treeCountInfo.textContent = ` (${user.totalTrees} árvores)`;
            // treeCountInfo.style.fontSize = '0.8em';
            // name.appendChild(treeCountInfo);

            userBlock.appendChild(img);
            userBlock.appendChild(name);
            highlightsContainer.appendChild(userBlock);
        });
    }

    // --- Inicialização ---
    loadSavedTheme();
    displayHighlights(); // Chama a função que agora pode (hipoteticamente) ser assíncrona

}); // Fim do DOMContentLoaded