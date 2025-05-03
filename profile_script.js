// Arquivo: profile_script.js (Simplificado para Avatar Fixo por Tipo)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const appContainer = document.getElementById('app-container');
    const profileHeading = document.getElementById('profile-heading');
    const avatarImage = document.getElementById('avatar-image');
    // Seletor avatarStageName REMOVIDO
    const treeCountSpan = document.getElementById('tree-count');
    const bioText = document.getElementById('bio-text');
    const editBioButton = document.getElementById('edit-bio-button');
    const bioDisplayArea = document.getElementById('bio-display-area');
    const bioEditForm = document.getElementById('bio-edit-form');
    const bioInput = document.getElementById('bio-input');
    const cancelBioEditButton = document.getElementById('cancel-bio-edit');
    const goToLogButton = document.getElementById('go-to-log-button');

    // --- Funções de Tema ---
    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Profile Page: Tema '${themeName}' aplicado via applyTheme.`);
        } else {
            console.log('Profile Page: Nenhum tema válido para aplicar via applyTheme.');
        }
    }

    // --- Função de Perfil ---
    // Função getTreeStage REMOVIDA

    /** Carrega e exibe todos os dados do perfil */
    function loadProfileData() {
        console.log("Iniciando loadProfileData (com avatar fixo)...");
        try {
            // 1. Carregar dados do localStorage
            const userName = localStorage.getItem('userName') || "Usuário";
            const userTheme = localStorage.getItem('userTheme'); // Lê a árvore escolhida: 'pau-brasil', etc.
            const totalTrees = parseInt(localStorage.getItem('totalTreesPlanted') || '0', 10);
            const userBio = localStorage.getItem('userBio') || "Edite sua BIO...";

            console.log(`Dados lidos - userName: ${userName}, userTheme: ${userTheme}, totalTrees: ${totalTrees}`);

            // 2. Aplicar tema geral da página (cor)
            if (userTheme) {
                applyTheme(userTheme);
            } else {
                console.warn("Nenhum 'userTheme' encontrado. Usando tema padrão.");
                applyTheme(null);
            }

            // 3. Atualizar elementos visuais (nome, contagem, bio)
            if (profileHeading) profileHeading.textContent = `Perfil de ${userName}`;
            if (treeCountSpan) treeCountSpan.textContent = totalTrees.toString(); // Contagem ainda é exibida
            if (bioText) bioText.textContent = userBio;

            // 4. Atualizar Avatar (Imagem Fixa Baseada no userTheme)
            let avatarFilename = 'placeholder_tree.png'; // Default placeholder
            let avatarAltText = 'Avatar Padrão';

            if (userTheme === 'pau-brasil') {
                avatarFilename = 'pau-brasil.jpg'; // Nome exato do arquivo
                avatarAltText = 'Avatar Pau-Brasil';
            } else if (userTheme === 'castanheira') {
                avatarFilename = 'castanheira.jpeg'; // Nome exato do arquivo
                avatarAltText = 'Avatar Castanheira';
            } else if (userTheme === 'peroba-rosa') {
                avatarFilename = 'Peroba-rosa.jpg'; // Nome exato com 'P' maiúsculo
                avatarAltText = 'Avatar Peroba-Rosa';
            } else {
                console.warn("userTheme não corresponde a nenhuma árvore conhecida para o avatar.");
            }

            if (avatarImage) {
                const imagePath = `./images/${avatarFilename}`;
                console.log(`Tentando carregar avatar fixo: ${imagePath}`);
                avatarImage.src = imagePath;
                avatarImage.alt = avatarAltText;

                // Fallback genérico se a imagem (mesmo a correta) não carregar
                avatarImage.onerror = () => {
                    console.error(`ERRO: Imagem ${imagePath} não encontrada ou falha ao carregar. Usando placeholder.`);
                    avatarImage.src = 'images/placeholder_tree.png';
                    avatarImage.alt = 'Avatar Padrão (Erro ao carregar)';
                };
            } else {
                 console.error("Elemento 'avatarImage' não encontrado no HTML.");
            }

            // Lógica para atualizar avatarStageName REMOVIDA

        } catch (e) {
            console.error("Erro GERAL ao carregar dados do perfil:", e);
            if (profileHeading) profileHeading.textContent = "Erro ao carregar perfil";
        }
    }

    // --- Configuração dos Event Listeners (sem alterações) ---
    // ... (Listeners para Editar Bio, Cancelar, Salvar Bio, Ir para Log) ...
    if (editBioButton && bioDisplayArea && bioEditForm && bioInput) { editBioButton.addEventListener('click', () => { /* ... */ }); }
    if (cancelBioEditButton && bioDisplayArea && bioEditForm) { cancelBioEditButton.addEventListener('click', () => { /* ... */ }); }
    if (bioEditForm && bioInput && bioText && bioDisplayArea) { bioEditForm.addEventListener('submit', (event) => { /* ... */ }); }
    if (goToLogButton) { goToLogButton.addEventListener('click', () => { window.location.href = 'log_reforestation.html'; }); }

    // --- Inicialização ---
    loadProfileData(); // Carrega tudo ao iniciar a página

}); // Fim do DOMContentLoaded