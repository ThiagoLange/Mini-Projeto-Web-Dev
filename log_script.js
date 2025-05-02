// Arquivo: log_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const logForm = document.getElementById('log-form');
    const quantityInput = document.getElementById('quantity');
    const speciesSelect = document.getElementById('species');
    const logMessageDiv = document.getElementById('log-message');
    // Essencial para aplicar o tema herdado do cadastro:
    const appContainer = document.getElementById('app-container');

    // --- Funções de Tema (Necessárias nesta página para aplicar o tema) ---

    /**
     * Aplica a classe CSS de tema ao container principal.
     * @param {string | null} themeName - O nome do tema (ex: 'pau-brasil') ou null para remover.
     */
    function applyTheme(themeName) {
        // Garante que o container exista antes de tentar manipular classes
        if (!appContainer) {
            console.error("Elemento #app-container não encontrado nesta página.");
            return;
        }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        // Remove qualquer classe de tema anterior para evitar conflitos
        appContainer.classList.remove(...themes);

        // Adiciona a classe de tema correta se um nome válido for fornecido
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Log Page: Tema '${themeName}' aplicado.`);
        } else if (themeName) {
            console.warn(`Log Page: Nome de tema inválido recebido: ${themeName}`);
        } else {
             console.log('Log Page: Nenhum tema para aplicar (ou tema removido).');
        }
    }

    /**
     * Lê o tema salvo no localStorage (definido na página de cadastro)
     * e o aplica a esta página.
     */
    function loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('userTheme'); // Lê a preferência
            if (savedTheme) {
                console.log(`Log Page: Tema encontrado no localStorage: ${savedTheme}`);
                applyTheme(savedTheme); // Aplica o estilo correspondente
            } else {
                console.log('Log Page: Nenhum tema de usuário salvo encontrado. Usando estilo padrão.');
                applyTheme(null); // Garante visual padrão se nenhum tema for encontrado
            }
        } catch (e) {
            console.error("Log Page: Erro ao acessar localStorage ou aplicar tema:", e);
            applyTheme(null); // Aplica visual padrão em caso de erro
        }
    }

    // --- Funções de Mensagem ---

    /**
     * Exibe uma mensagem de feedback na área designada.
     * @param {string} text - O texto da mensagem.
     * @param {'success' | 'error'} type - O tipo de mensagem para estilização.
     */
    function showLogMessage(text, type = 'success') {
        if (!logMessageDiv) return; // Verifica se a div de mensagem existe
        logMessageDiv.textContent = text;
        logMessageDiv.className = ''; // Limpa classes CSS anteriores
        // Adiciona a classe base e a classe de tipo (ex: 'message-success')
        logMessageDiv.classList.add('message', `message-${type}`);
    }

    /** Limpa a área de mensagens. */
    function clearLogMessage() {
         if (!logMessageDiv) return;
        logMessageDiv.textContent = '';
        logMessageDiv.className = ''; // Remove classes de estilo
    }

    // --- Lógica Principal da Página de Log ---

    // 1. CARREGAR O TEMA DO USUÁRIO imediatamente ao carregar a página
    loadSavedTheme();

    // 2. Configurar o listener para o envio do formulário de log
    // Verifica se o formulário existe antes de adicionar o listener
    if (logForm) {
        logForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão que recarregaria a página
            clearLogMessage(); // Limpa mensagens anteriores

            // Obter valores dos campos do formulário
            const quantity = parseInt(quantityInput.value, 10); // Converte para número
            const species = speciesSelect.value;

            // Validar os dados de entrada
            if (isNaN(quantity) || quantity <= 0) {
                showLogMessage('Por favor, insira uma quantidade válida (maior que zero).', 'error');
                quantityInput.focus(); // Coloca o foco no campo inválido
                return; // Interrompe o processo se a quantidade for inválida
            }

            if (!species || species === "") { // Verifica se uma espécie foi selecionada
                showLogMessage('Por favor, selecione a espécie da árvore.', 'error');
                speciesSelect.focus(); // Coloca o foco no campo inválido
                return; // Interrompe o processo se a espécie não foi selecionada
            }

            // Preparar o objeto de dados para o log (JSON)
            const userId = null; // Placeholder para ID do usuário (será definido pelo backend)
            const logEntry = {
                userId: userId, // Inclui o campo userId, mesmo que nulo por enquanto
                quantity: quantity,
                species: species,
                // Adiciona um timestamp para saber quando o registro foi feito no frontend
                timestamp: new Date().toISOString() // Formato padrão ISO 8601 (ex: "2025-05-01T15:49:52.123Z")
            };

            // Converter o objeto para uma string JSON formatada
            const logEntryJSON = JSON.stringify(logEntry, null, 2); // O '2' indenta para facilitar a leitura

            // Exibir o JSON no console para depuração/verificação
            console.log("Novo Registro de Reflorestamento (JSON):");
            console.log(logEntryJSON);

            // Exibir mensagem de sucesso para o usuário
            showLogMessage(`Ação registrada com sucesso: ${quantity} árvore(s) da espécie ${species}.`, 'success');

            // Limpar os campos do formulário para um novo registro
            logForm.reset();

        }); // Fim do event listener 'submit'
    } else {
        console.error("Elemento #log-form não encontrado nesta página.");
    }

}); // Fim do DOMContentLoaded