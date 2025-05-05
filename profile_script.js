// Arquivo: profile_script.js (Versão Completa Revisada)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const appContainer = document.getElementById('app-container');
    const profileHeading = document.getElementById('profile-heading');
    const avatarImage = document.getElementById('avatar-image');
    const treeCountSpan = document.getElementById('tree-count'); // Onde o TOTAL é exibido
    const goToLogButton = document.getElementById('go-to-log-button');
    // Seletores para contagem por espécie
    const countIpe = document.getElementById('count-Ipe');
    const countAngico = document.getElementById('count-Angico');
    const countAroeira = document.getElementById('count-Aroeira');
    const countJequitiba = document.getElementById('count-Jequitiba');
    const countPerobaCampo = document.getElementById('count-PerobaCampo');
    // Mapeamento (útil)
    const speciesCountElements = {
        Ipe: countIpe,
        Angico: countAngico,
        Aroeira: countAroeira,
        Jequitiba: countJequitiba,
        PerobaCampo: countPerobaCampo
    };
    // ... outros seletores que você possa ter (bio, etc.) ...

    // --- Função para Aplicar o Tema ---
    function applyTheme(themeName) {
        if (!appContainer) {
            console.error("Profile: Elemento #app-container não encontrado para aplicar tema.");
            return;
        }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        const themeClassName = `theme-${themeName}`;

        appContainer.classList.remove(...themes); // Limpa temas antigos

        if (themeName && themes.includes(themeClassName)) {
            appContainer.classList.add(themeClassName);
            console.log(`Profile: Tema '${themeName}' aplicado.`);
        } else {
            console.log(`Profile: Nenhum tema válido ('${themeName}') ou tema padrão.`);
        }
    }

    // --- Função para Carregar Dados do Perfil ---
    function loadProfileData() {
        console.log("Profile: Iniciando loadProfileData...");
        try {
            // 1. Carregar dados básicos do localStorage
            const userName = localStorage.getItem('userName') || "Usuário";
            const userTheme = localStorage.getItem('userTheme');
            // const userBio = localStorage.getItem('userBio') || "Edite sua BIO..."; // Se tiver bio

            console.log(`Profile: Dados lidos - userName: ${userName}, userTheme: ${userTheme}`);

            // 2. APLICAR O TEMA
            applyTheme(userTheme);

            // 3. Atualizar Nome do Usuário
            if (profileHeading) profileHeading.textContent = `Perfil de ${userName}`;

            // 4. ATUALIZAR AVATAR
            if (avatarImage) {
                let avatarFilename = 'placeholder_tree.png'; // Default
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
                console.log(`Profile: Tentando carregar avatar: ${imagePath}`);
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

            // 5. Carregar Contagem por Espécie e CALCULAR TOTAL
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

            // 6. Exibir o TOTAL CALCULADO
            if (treeCountSpan) {
                treeCountSpan.textContent = calculatedTotal.toString();
                console.log(`Profile: Total calculado a partir das espécies: ${calculatedTotal}`);
            } else {
                 console.warn("Profile: Elemento #tree-count não encontrado.");
            }

            // --- START: Código Adicionado para determinar e exibir o estágio ---
            const stageNameElement = document.getElementById('avatar-stage-name');
            let stageName = "Plantada"; // Estágio Padrão (0-99 árvores)

            if (calculatedTotal >= 1500) {
                stageName = "Anciã";
            } else if (calculatedTotal >= 700) {
                stageName = "Madura";
            } else if (calculatedTotal >= 300) {
                stageName = "Jovem";
            } else if (calculatedTotal >= 100) {
                stageName = "Broto";
            }
            // Não precisa de 'else' para 'Plantada' pois é o padrão inicial

            if (stageNameElement) {
                stageNameElement.textContent = `Estágio: ${stageName}`; // Define o texto no elemento HTML
                console.log(`Profile: Estágio definido como: ${stageName}`);
            } else {
                console.warn("Profile: Elemento #avatar-stage-name não encontrado.");
            }
            // --- END: Código Adicionado ---


            // 7. Atualizar Bio (se houver)
            // const bioTextElement = document.getElementById('bio-text');
            // if (bioTextElement) bioTextElement.textContent = userBio;

        } catch (e) {
            console.error("Profile: Erro GERAL ao carregar dados do perfil:", e);
            if (profileHeading) profileHeading.textContent = "Erro ao carregar perfil";
        }
    }

    // --- Configuração dos Event Listeners ---
    if (goToLogButton) {
        goToLogButton.addEventListener('click', () => {
            window.location.href = 'log_reforestation.html'; // Navega para a página de log
        });
    }
    // ... outros listeners (bio edit, etc.)

    // --- Inicialização ---
    loadProfileData(); // Chama a função principal ao carregar a página

}); // Fim do DOMContentLoaded