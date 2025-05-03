// Arquivo: script.js (Para a página de cadastro: index.html)

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const treeRadios = document.querySelectorAll('input[name="tree"]');
    const messageDiv = document.getElementById('message');
    const appContainer = document.getElementById('app-container');

    // --- Funções Auxiliares ---

    /**
     * Aplica a classe CSS de tema ao container principal.
     * Usada para a exibição TEMPORÁRIA durante o submit.
     * @param {string | null} themeName - O nome do tema ou null para remover.
     */
    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes); // Limpa temas anteriores

        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Cadastro Page: Tema temporário '${themeName}' aplicado.`);
        } else {
            console.log('Cadastro Page: Tema visual removido ou nome inválido.');
        }
    }

    /** Exibe mensagem de feedback */
    function showMessage(text, type = 'success') {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = '';
        messageDiv.classList.add('message', `message-${type}`);
    }

    /** Limpa a área de mensagens */
    function clearMessage() {
        if (!messageDiv) return;
        messageDiv.textContent = '';
        messageDiv.className = '';
    }

    // --- Lógica Principal da Página de Cadastro ---

    // 1. NÃO carregar tema salvo ao entrar na página de cadastro.
    console.log("Página de cadastro carregada com tema padrão.");

    // 2. Configurar o listener para o envio do formulário de cadastro
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão
            clearMessage(); // Limpa mensagens antigas

            // --- Validação ---
            const username = usernameInput.value.trim();
            const password = passwordInput.value; // Lembrete: Inseguro em produção!
            const selectedTreeRadio = document.querySelector('input[name="tree"]:checked');

            if (!selectedTreeRadio) {
                showMessage('Por favor, selecione uma árvore avatar.', 'error');
                return;
            }
            const selectedTreeValue = selectedTreeRadio.value; // ex: 'pau-brasil'

            if (!username || !password) {
                showMessage('Por favor, preencha o usuário e a senha.', 'error');
                return;
            }

            // --- Processamento do Sucesso ---

            // Criar o objeto de usuário (para eventual envio ao backend)
            const userData = {
                username: username,
                password: password, // Apenas para demonstração da estrutura JSON
                treeAvatar: selectedTreeValue
            };
            const userDataJSON = JSON.stringify(userData, null, 2);
            console.log("Objeto de Usuário (JSON):", userDataJSON);

            // 1. SALVAR dados essenciais no localStorage para outras páginas
            try {
                localStorage.setItem('userTheme', selectedTreeValue); // Salva a árvore/tema escolhido
                localStorage.setItem('userName', username);         // Salva o nome do usuário
                console.log(`Tema '${selectedTreeValue}' e usuário '${username}' salvos no localStorage.`);
            } catch (e) {
                console.error("Erro crítico ao salvar dados essenciais no localStorage:", e);
                showMessage("Erro ao salvar preferências. Não foi possível continuar.", "error");
                return;
            }

            // 2. APLICAR O TEMA VISUALMENTE (de forma temporária)
            applyTheme(selectedTreeValue);

            // 3. Exibir mensagem de sucesso e indicar redirecionamento para o PERFIL
            showMessage(`Cadastro de ${username} realizado! Redirecionando para o seu perfil...`, 'success');

            // 4. Limpar o formulário (campos e seleção da árvore)
            form.reset();

            // 5. AGENDAR A REMOÇÃO DO TEMA VISUAL E O REDIRECIONAMENTO PARA O PERFIL
            const redirectDelay = 1500; // Tempo em milissegundos
            console.log(`Agendando reset visual e redirecionamento para profile.html em ${redirectDelay}ms`); // Mensagem do console atualizada

            setTimeout(() => {
                // 5a. Resetar o tema visual desta página para o padrão
                applyTheme(null);
                console.log('Tema visual da página de cadastro resetado.');

                // 5b. Redirecionar para a página de PERFIL <<< ALTERADO AQUI >>>
                window.location.href = 'profile.html';

            }, redirectDelay);

            // --- Envio para Backend (Exemplo Comentado) ---
            /* fetch(...) */
            // --- Fim do Exemplo ---

        }); // Fim do event listener 'submit'
    } else {
        console.error("Elemento #registration-form não encontrado.");
    }

}); // Fim do DOMContentLoaded