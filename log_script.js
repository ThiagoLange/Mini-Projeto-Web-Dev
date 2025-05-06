// Arquivo: log_script.js

document.addEventListener('DOMContentLoaded', () => {
    const logForm = document.getElementById('log-form');
    const quantityInput = document.getElementById('quantity');
    const speciesSelect = document.getElementById('species');
    const logMessageDiv = document.getElementById('log-message');
    const appContainer = document.getElementById('app-container');

    function applyTheme(themeName) {
        if (!appContainer) { return; }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        const themeClassName = `theme-${themeName}`;
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(themeClassName)) {
            appContainer.classList.add(themeClassName);
        }
    }

    function loadSavedTheme() {
        try {
            const userTheme = localStorage.getItem('userTheme');
            applyTheme(userTheme);
        } catch (e) { console.error("Log: Erro ao carregar tema:", e); }
    }

    function showLogMessage(text, type = 'success') {
        if(logMessageDiv) {
            logMessageDiv.textContent = text;
            logMessageDiv.className = `message message-${type}`;
            logMessageDiv.style.display = 'block';
            setTimeout(() => {
                if(logMessageDiv) {
                     logMessageDiv.style.display = 'none';
                     logMessageDiv.textContent = '';
                     logMessageDiv.className = 'message';
                }
            }, 3000);
        }
    }
    function clearLogMessage() {
        if(logMessageDiv) {
            logMessageDiv.textContent = '';
            logMessageDiv.className = 'message';
            logMessageDiv.style.display = 'none';
        }
    }

    loadSavedTheme();

    if (logForm) {
        logForm.addEventListener('submit', async (event) => { // async para o exemplo de backend
            event.preventDefault();
            clearLogMessage();

            const quantity = parseInt(quantityInput.value, 10);
            const species = speciesSelect.value;

            if (isNaN(quantity) || quantity <= 0) {
                showLogMessage("Por favor, insira uma quantidade válida.", "error");
                return;
            }
            if (!species || species === "") {
                showLogMessage("Por favor, selecione uma espécie.", "error");
                return;
            }

            const userName = localStorage.getItem('userName');
            if (!userName) {
                showLogMessage("Usuário não identificado. Por favor, faça o cadastro/login primeiro.", "error");
                return;
            }

            // --- Salvar apenas o registro individual ---
            try {
                const logEntry = {
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
                    username: userName,
                    species: species,
                    quantity: quantity,
                    date: new Date().toISOString().split('T')[0] // Formato AAAA-MM-DD
                };

                let reforestationLogEntries = JSON.parse(localStorage.getItem('reforestationLogEntries')) || [];
                reforestationLogEntries.push(logEntry);
                localStorage.setItem('reforestationLogEntries', JSON.stringify(reforestationLogEntries));
                console.log("Novo registro de plantio adicionado à lista geral:", logEntry);

                // As chaves 'treesPlanted_*' e 'totalTreesPlanted' NÃO SÃO MAIS ATUALIZADAS DIRETAMENTE AQUI.
                // O profile_script.js calculará esses valores a partir de 'reforestationLogEntries'.

                showLogMessage(`Ação registrada: ${quantity} ${species} plantadas por ${userName}!`, 'success');
                logForm.reset();

            } catch (e) {
                console.error("Log: Erro ao salvar registro de plantio:", e);
                showLogMessage("Aviso: Erro ao salvar dados do plantio.", "error");
            }
            // --- FIM DA LÓGICA ATUALIZADA ---


            /* --- EXEMPLO DE CÓDIGO PARA ENVIAR LOG DE AÇÃO AO BACKEND (COMENTADO) ---
            // const logEntryDataForBackend = {
            //     username: userName,
            //     species: species,
            //     quantity: quantity,
            //     date: new Date().toISOString()
            // };
            // const submitButton = logForm.querySelector('button[type="submit"]');
            // if (submitButton) {
            //     submitButton.disabled = true;
            //     submitButton.textContent = 'Registrando...';
            // }
            // console.log("Tentando enviar log de ação para o backend:", logEntryDataForBackend);
            // try {
            //     const response = await fetch('/api/log_action', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(logEntryDataForBackend)
            //     });
            //     if (response.ok) {
            //         console.log("Log de ação salvo com sucesso no backend.");
            //     } else {
            //         const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status} ao registrar no servidor.` }));
            //         console.error("Erro do backend:", errorResult);
            //         showLogMessage(`Falha ao registrar no servidor: ${errorResult.message}. (Dados salvos localmente)`, "error");
            //     }
            // } catch (networkError) {
            //     console.error("Erro de rede:", networkError);
            //     showLogMessage("Erro de conexão ao registrar no servidor. (Dados salvos localmente)", "error");
            // } finally {
            //     if (submitButton) {
            //         submitButton.disabled = false;
            //         submitButton.textContent = 'Registrar Ação';
            //     }
            // }
            --- FIM DO EXEMPLO COMENTADO --- */
        });
    }
});