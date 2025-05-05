// Arquivo: log_script.js (Versão Completa Revisada - Foco no Tema)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores ---
    const logForm = document.getElementById('log-form');
    const quantityInput = document.getElementById('quantity');
    const speciesSelect = document.getElementById('species');
    const logMessageDiv = document.getElementById('log-message');
    const appContainer = document.getElementById('app-container'); // Necessário para applyTheme

    // --- Função para Aplicar o Tema ---
    // <<< ESSENCIAL: Garanta que esta função esteja completa e correta >>>
    function applyTheme(themeName) {
        if (!appContainer) {
            console.error("Log: Elemento #app-container não encontrado para aplicar tema.");
            return;
        }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        const themeClassName = `theme-${themeName}`;

        appContainer.classList.remove(...themes); // Limpa temas antigos

        if (themeName && themes.includes(themeClassName)) {
            appContainer.classList.add(themeClassName);
            console.log(`Log: Tema '${themeName}' aplicado.`);
        } else {
            console.log(`Log: Nenhum tema válido ('${themeName}') ou tema padrão.`);
        }
    }

    // --- Função para Carregar o Tema Salvo ---
    // <<< ESSENCIAL: Garanta que esta função esteja completa e correta >>>
    function loadSavedTheme() {
        try {
            const userTheme = localStorage.getItem('userTheme');
            console.log(`Log: Lendo tema do localStorage: ${userTheme}`);
            applyTheme(userTheme); // Chama a função para aplicar o tema lido
        } catch (e) {
            console.error("Log: Erro ao carregar tema do localStorage:", e);
        }
    }

    // --- Outras Funções (showLogMessage, clearLogMessage - mantenha as suas) ---
    function showLogMessage(text, type = 'success') {
        if(logMessageDiv) {
            logMessageDiv.textContent = text;
            logMessageDiv.className = `message message-${type}`; // Adiciona classes base e de tipo
        }
     }
    function clearLogMessage() {
        if(logMessageDiv) {
            logMessageDiv.textContent = '';
            logMessageDiv.className = ''; // Limpa classes
        }
    }

    // --- Lógica Principal ---
    loadSavedTheme(); // <<< CARREGA O TEMA LOGO AO INICIAR

    if (logForm) {
        logForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearLogMessage();

            // Obter valores
            const quantity = parseInt(quantityInput.value, 10);
            const species = speciesSelect.value;

            // Validar (mantenha sua validação)
            if (isNaN(quantity) || quantity <= 0 /* ... */) { /* ... */ return; }
            if (!species || species === "" /* ... */) { /* ... */ return; }

            // ATUALIZAÇÃO DAS CONTAGENS (mantenha sua lógica)
            try {
                // Total
                let currentTotal = parseInt(localStorage.getItem('totalTreesPlanted') || '0', 10);
                currentTotal += quantity;
                localStorage.setItem('totalTreesPlanted', currentTotal.toString());
                // Espécie
                const speciesKey = `treesPlanted_${species}`;
                let speciesCount = parseInt(localStorage.getItem(speciesKey) || '0', 10);
                speciesCount += quantity;
                localStorage.setItem(speciesKey, speciesCount.toString());

                console.log(`Log: Contagens atualizadas - Total=${currentTotal}, ${speciesKey}=${speciesCount}`);

            } catch (e) {
                console.error("Log: Erro ao atualizar contagens no localStorage:", e);
                showLogMessage("Aviso: Erro ao atualizar contagens.", "error");
            }

            // Feedback e Limpeza
            showLogMessage(`Ação registrada: ${quantity} ${species} plantadas!`, 'success');
            logForm.reset();

        }); // Fim do event listener 'submit'
    } else {
        console.error("Log: Elemento #log-form não encontrado.");
    }

}); // Fim do DOMContentLoaded