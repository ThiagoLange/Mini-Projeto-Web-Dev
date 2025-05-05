// Arquivo: profile_script.js (Modificado para incluir Logout)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const appContainer = document.getElementById('app-container');
    const profileHeading = document.getElementById('profile-heading');
    const avatarImage = document.getElementById('avatar-image');
    const treeCountSpan = document.getElementById('tree-count');
    const goToLogButton = document.getElementById('go-to-log-button');
    const logoutButton = document.getElementById('logout-button'); // <<< Seletor para o botão de logout
    // Seletores para contagem por espécie
    const countIpe = document.getElementById('count-Ipe');
    const countAngico = document.getElementById('count-Angico');
    const countAroeira = document.getElementById('count-Aroeira');
    const countJequitiba = document.getElementById('count-Jequitiba');
    const countPerobaCampo = document.getElementById('count-PerobaCampo');
    // Mapeamento (útil para limpar localStorage)
    const speciesCountElements = {
        Ipe: countIpe,
        Angico: countAngico,
        Aroeira: countAroeira,
        Jequitiba: countJequitiba,
        PerobaCampo: countPerobaCampo
        // Adicione outras espécies aqui se existirem
    };

    // --- Função para Aplicar o Tema ---
    function applyTheme(themeName) {
        // ... (código da função applyTheme - sem alterações) ...
        if (!appContainer) {
            console.error("Profile: Elemento #app-container não encontrado para aplicar tema.");
            return;
        }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        const themeClassName = `theme-${themeName}`;

        appContainer.classList.remove(...themes);

        if (themeName && themes.includes(themeClassName)) {
            appContainer.classList.add(themeClassName);
            console.log(`Profile: Tema '${themeName}' aplicado.`);
        } else {
            console.log(`Profile: Nenhum tema válido ('${themeName}') ou tema padrão.`);
        }
    }

    // --- Função para Carregar Dados do Perfil ---
    function loadProfileData() {
        // ... (código da função loadProfileData - sem alterações na lógica de carregamento) ...
        console.log("Profile: Iniciando loadProfileData...");
        try {
            // 1. Carregar dados básicos
            const userName = localStorage.getItem('userName') || "Usuário";
            const userTheme = localStorage.getItem('userTheme');

            console.log(`Profile: Dados lidos - userName: ${userName}, userTheme: ${userTheme}`);

            // 2. Aplicar Tema
            applyTheme(userTheme);

            // 3. Atualizar Nome
            if (profileHeading) profileHeading.textContent = `Perfil de ${userName}`;

            // 4. Atualizar Avatar
            if (avatarImage) {
                let avatarFilename = 'placeholder_tree.png';
                let avatarAltText = 'Avatar Padrão';
                if (userTheme === 'pau-brasil') {
                    avatarFilename = 'pau-brasil.jpg';
                    avatarAltText = 'Avatar Pau-Brasil';
                } else if (userTheme === 'castanheira') {
                    avatarFilename = 'castanheira.jpeg';
                    avatarAltText = 'Avatar Castanheira';
                } else if (userTheme === 'peroba-rosa') {
                    avatarFilename = 'Peroba-rosa.jpg';
                    avatarAltText = 'Avatar Peroba Rosa';
                }
                const imagePath = `images/${avatarFilename}`;
                avatarImage.src = imagePath;
                avatarImage.alt = avatarAltText;
                avatarImage.onerror = () => {
                    console.warn(`Profile: Falha ao carregar ${imagePath}. Usando placeholder.`);
                    avatarImage.src = 'images/placeholder_tree.png';
                    avatarImage.alt = 'Avatar Padrão';
                };
            } else {
                console.warn("Profile: Elemento #avatar-image não encontrado.");
            }

            // 5. Carregar Contagem e Calcular Total
            let calculatedTotal = 0;
            console.log("Profile: Carregando contagem por espécie e calculando total...");
            for (const species in speciesCountElements) {
                const element = speciesCountElements[species];
                if (element) {
                    const speciesKey = `treesPlanted_${species}`;
                    const count = parseInt(localStorage.getItem(speciesKey) || '0', 10);
                    element.textContent = count.toString();
                    calculatedTotal += count;
                }
            }

            // 6. Exibir Total
            if (treeCountSpan) {
                treeCountSpan.textContent = calculatedTotal.toString();
                console.log(`Profile: Total calculado a partir das espécies: ${calculatedTotal}`);
            } else {
                 console.warn("Profile: Elemento #tree-count não encontrado.");
            }

            // 7. Exibir Estágio
            const stageNameElement = document.getElementById('avatar-stage-name');
            let stageName = "Plantada";
            if (calculatedTotal >= 1500) { stageName = "Anciã"; }
            else if (calculatedTotal >= 700) { stageName = "Madura"; }
            else if (calculatedTotal >= 300) { stageName = "Jovem"; }
            else if (calculatedTotal >= 100) { stageName = "Broto"; }

            if (stageNameElement) {
                stageNameElement.textContent = `Estágio: ${stageName}`;
                console.log(`Profile: Estágio definido como: ${stageName}`);
            } else {
                console.warn("Profile: Elemento #avatar-stage-name não encontrado.");
            }

            // 8. Atualizar Bio (se houver)
            // ...

        } catch (e) {
            console.error("Profile: Erro GERAL ao carregar dados do perfil:", e);
            if (profileHeading) profileHeading.textContent = "Erro ao carregar perfil";
        }
    }

    // --- Configuração dos Event Listeners ---

    // Botão para ir registrar ação
    if (goToLogButton) {
        goToLogButton.addEventListener('click', () => {
            window.location.href = 'log_reforestation.html';
        });
    }

    // --- START: Event Listener para o Botão de Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Confirmação
            const confirmLogout = window.confirm("Tem certeza que deseja sair?");

            if (confirmLogout) {
                console.log("Profile: Iniciando processo de logout...");
                try {
                    // Limpar dados do usuário do localStorage
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userTheme');
                    // Remover contagens de espécies específicas
                    for (const speciesKey in speciesCountElements) {
                         localStorage.removeItem(`treesPlanted_${speciesKey}`);
                         console.log(` - Removido: treesPlanted_${speciesKey}`);
                    }
                    // Remover total geral se existir (por segurança)
                    localStorage.removeItem('totalTreesPlanted');

                    console.log("Profile: Dados do usuário removidos do localStorage.");

                    // Redirecionar para a página de cadastro/login
                    window.location.href = 'index.html';

                } catch (e) {
                    console.error("Profile: Erro durante o logout ao limpar localStorage:", e);
                    alert("Ocorreu um erro ao tentar sair. Tente novamente.");
                }
            } else {
                console.log("Profile: Logout cancelado pelo usuário.");
            }
        });
    } else {
        console.warn("Profile: Botão de logout (#logout-button) não encontrado.");
    }
    // --- END: Event Listener para o Botão de Logout ---


    // ... outros listeners (bio edit, etc.) ...

    // --- Inicialização ---
    loadProfileData(); // Chama a função principal ao carregar a página

}); // Fim do DOMContentLoaded