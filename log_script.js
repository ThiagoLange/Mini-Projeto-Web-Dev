// Arquivo: log_script.js (Para a página de log: log_reforestation.html)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const logForm = document.getElementById('log-form');
    const quantityInput = document.getElementById('quantity');
    const speciesSelect = document.getElementById('species');
    const logMessageDiv = document.getElementById('log-message');
    // Essencial para aplicar o tema herdado do cadastro:
    const appContainer = document.getElementById('app-container');

    // --- Funções de Tema (Necessárias para aplicar o tema herdado) ---

    /** Aplica a classe CSS de tema ao container principal. */
    function applyTheme(themeName) {
        if (!appContainer) { console.error("Log Page: Elemento #app-container não encontrado."); return; }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Log Page: Tema '${themeName}' aplicado.`);
        } else if (themeName) {
            console.warn(`Log Page: Nome de tema inválido recebido: ${themeName}`);
        } else {
            console.log('Log Page: Nenhum tema para aplicar.');
        }
    }

    /** Lê o tema salvo no localStorage e o aplica a esta página. */
    function loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('userTheme'); // Lê a preferência salva pelo cadastro
            if (savedTheme) {
                console.log(`Log Page: Tema encontrado no localStorage: ${savedTheme}`);
                applyTheme(savedTheme); // Aplica o estilo correspondente
            } else {
                console.log('Log Page: Nenhum tema de usuário salvo encontrado. Usando estilo padrão.');
                applyTheme(null);
            }
        } catch (e) {
            console.error("Log Page: Erro ao acessar localStorage ou aplicar tema:", e);
            applyTheme(null);
        }
    }

    // --- Funções de Mensagem ---
    function showLogMessage(text, type = 'success') {
        if (!logMessageDiv) return;
        logMessageDiv.textContent = text;
        logMessageDiv.className = '';
        logMessageDiv.classList.add('message', `message-${type}`);
    }

    function clearLogMessage() {
        if (!logMessageDiv) return;
        logMessageDiv.textContent = '';
        logMessageDiv.className = '';
    }

    // --- Lógica Principal da Página de Log ---

    // 1. CARREGAR O TEMA DO USUÁRIO imediatamente ao carregar a página
    loadSavedTheme();

    // 2. Configurar o listener para o envio do formulário de log
    if (logForm) {
        logForm.addEventListener('submit', (event) => {
            event.preventDefault();
            clearLogMessage();

            // Obter valores dos campos
            const quantity = parseInt(quantityInput.value, 10);
            const species = speciesSelect.value;

            // Validar os dados
            if (isNaN(quantity) || quantity <= 0) {
                showLogMessage('Por favor, insira uma quantidade válida (maior que zero).', 'error');
                quantityInput.focus();
                return;
            }
            if (!species || species === "") {
                showLogMessage('Por favor, selecione a espécie da árvore.', 'error');
                speciesSelect.focus();
                return;
            }

            // ATUALIZAR A CONTAGEM TOTAL DE ÁRVORES PLANTADAS
            try {
                let currentTotal = parseInt(localStorage.getItem('totalTreesPlanted') || '0', 10);
                // Verifica se o valor lido é realmente um número, senão zera
                if (isNaN(currentTotal)) {
                    console.warn("Valor inválido encontrado em 'totalTreesPlanted', resetando para 0.");
                    currentTotal = 0;
                 }
                currentTotal += quantity; // Adiciona a quantidade recém-plantada
                localStorage.setItem('totalTreesPlanted', currentTotal.toString()); // Salva de volta como string
                console.log(`Contagem total de árvores atualizada no localStorage: ${currentTotal}`);
            } catch (e) {
                console.error("Erro ao atualizar contagem de árvores no localStorage:", e);
                // Informa o usuário, mas não impede o registro do log individual
                showLogMessage("Aviso: Ocorreu um erro ao atualizar a contagem total de árvores.", "error");
            }

            // Preparar o objeto de log individual
            const userId = null; // Placeholder
            const logEntry = {
                userId: userId,
                quantity: quantity,
                species: species,
                timestamp: new Date().toISOString()
            };
            const logEntryJSON = JSON.stringify(logEntry, null, 2);
            console.log("Novo Registro de Reflorestamento (JSON individual):");
            console.log(logEntryJSON);

            // Exibir mensagem de sucesso para ESTE registro
            showLogMessage(`Ação registrada com sucesso: ${quantity} árvore(s) da espécie ${species}.`, 'success');

            // Limpar o formulário
            logForm.reset();

            // --- Envio para Backend (Exemplo Comentado) ---
            /*
            fetch('/api/log-reforestation', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: logEntryJSON })
                .then(...)
                .catch(...);
            */
            // --- Fim do Exemplo ---

        }); // Fim do event listener 'submit'
    } else {
        console.error("Log Page: Elemento #log-form não encontrado.");
    }

}); // Fim do DOMContentLoaded