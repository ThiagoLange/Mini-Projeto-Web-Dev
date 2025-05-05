// Arquivo: highlights_script.js
// Modificado para calcular os destaques a partir dos dados detalhados (como 'report.html')

document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data Fonte 1: Registros Detalhados de Plantio ---
    // (Mesma base de dados usada em report_script.js para consistência)
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
        { user: "Grace", species: "Ipe", quantity: 100, date: "2025-05-05" }, // Dados Grace
        { user: "Charlie", species: "Angico", quantity: 50, date: "2025-05-06" },// Dados Charlie
        { user: "Grace", species: "Aroeira", quantity: 155, date: "2025-05-07" },// Dados Grace
        { user: "David", species: "PerobaCampo", quantity: 45, date: "2025-05-08" },// Dados David
        { user: "Frank", species: "Jequitiba", quantity: 15, date: "2025-05-09" }, // Dados Frank
        { user: "Eve", species: "Pau-brasil", quantity: 195, date: "2025-05-10" },  // Dados Eve (avatar pau-brasil)
    ];

    // --- Mock Data Fonte 2: Mapeamento Usuário -> Avatar ---
    // (Necessário porque mockReforestationData não tem o avatar)
    const mockUserAvatars = [
        { username: "Alice", treeAvatar: "pau-brasil" },
        { username: "Bob", treeAvatar: "castanheira" },
        { username: "Charlie", treeAvatar: "peroba-rosa" },
        { username: "David", treeAvatar: "castanheira" },
        { username: "Eve", treeAvatar: "pau-brasil" }, // Exemplo Eve
        { username: "Frank", treeAvatar: "peroba-rosa" },
        { username: "Grace", treeAvatar: "castanheira" }, // Exemplo Grace
    ];

    // --- Seletores ---
    const appContainer = document.getElementById('app-container');
    const highlightsContainer = document.getElementById('highlights-container');

    // --- Funções de Tema ---
    function applyTheme(themeName) {
        // ... (código da função applyTheme - sem alterações) ...
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Highlights: Tema '${themeName}' aplicado.`);
        } else {
             console.log(`Highlights: Nenhum tema válido ('${themeName}') ou tema padrão.`);
        }
    }

    function loadSavedTheme() {
        // ... (código da função loadSavedTheme - sem alterações) ...
        try {
            const userTheme = localStorage.getItem('userTheme');
            applyTheme(userTheme);
        } catch (e) {
            console.error("Highlights: Erro ao carregar tema do localStorage:", e);
        }
    }

    // --- Função para Determinar o Nome do Arquivo do Avatar ---
    function getAvatarFilename(treeAvatarValue) {
        // ... (código da função getAvatarFilename - sem alterações) ...
        switch (treeAvatarValue) {
            case 'pau-brasil': return 'pau-brasil.jpg';
            case 'castanheira': return 'castanheira.jpeg';
            case 'peroba-rosa': return 'Peroba-rosa.jpg';
            default: return 'placeholder_tree.png';
        }
    }

    // --- Função para Exibir os Destaques (Lógica Modificada) ---
    function displayHighlights() {
        if (!highlightsContainer) {
            console.error("Highlights: Container #highlights-container não encontrado.");
            return;
        }
        highlightsContainer.innerHTML = ''; // Limpa conteúdo anterior

        // 1. Agregar totais por usuário a partir dos dados detalhados
        const userTotals = mockReforestationData.reduce((acc, record) => {
            const user = record.user;
            const quantity = record.quantity;
            acc[user] = (acc[user] || 0) + quantity; // Soma a quantidade ao total do usuário
            return acc;
        }, {}); // Começa com um objeto vazio {}

        // userTotals agora é algo como: { Alice: 49, Bob: 43, Charlie: 70, Grace: 255, ... }

        // 2. Converter o objeto de totais em um array de objetos para ordenar
        const usersWithTotals = Object.entries(userTotals).map(([username, totalTrees]) => ({
            username: username,
            totalTrees: totalTrees
        }));
        // usersWithTotals agora é: [{ username: 'Alice', totalTrees: 49 }, { username: 'Bob', totalTrees: 43 }, ...]

        // 3. Ordenar usuários pelo total de árvores (decrescente)
        const sortedUsers = usersWithTotals.sort((a, b) => b.totalTrees - a.totalTrees);

        // 4. Pegar os top 3
        const topUsers = sortedUsers.slice(0, 3);

        if (topUsers.length === 0) {
            highlightsContainer.innerHTML = '<p>Ainda não há dados de destaque.</p>';
            return;
        }

        // 5. Criar e adicionar o bloco HTML para cada usuário no top 3
        topUsers.forEach(user => {
            // Encontra o avatar do usuário na lista mockUserAvatars
            const userInfo = mockUserAvatars.find(u => u.username === user.username);
            const userAvatarType = userInfo ? userInfo.treeAvatar : null; // Obtém o tipo de avatar ou null se não encontrar

            const userBlock = document.createElement('div');
            userBlock.className = 'user-highlight-block';

            // Avatar
            const avatarFilename = getAvatarFilename(userAvatarType); // Usa o tipo de avatar encontrado
            const img = document.createElement('img');
            img.src = `images/${avatarFilename}`;
            img.alt = `Avatar de ${user.username}`;
            img.onerror = () => {
                console.warn(`Highlights: Falha ao carregar images/${avatarFilename}. Usando placeholder.`);
                img.src = 'images/placeholder_tree.png';
                img.alt = 'Avatar Padrão';
            };

            // Nome do Usuário
            const name = document.createElement('p');
            name.textContent = user.username;
            // Opcional: Exibir total de árvores para debug ou informação
            // const totalText = document.createElement('span');
            // totalText.textContent = ` (${user.totalTrees} árvores)`;
            // totalText.style.fontSize = '0.8em';
            // name.appendChild(totalText);


            userBlock.appendChild(img);
            userBlock.appendChild(name);
            highlightsContainer.appendChild(userBlock);
        });
    }

    // --- Inicialização ---
    loadSavedTheme();
    displayHighlights(); // Calcula e exibe os destaques baseados nos dados detalhados

}); // Fim do DOMContentLoaded