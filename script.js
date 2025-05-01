document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores e Funções Auxiliares (sem mudanças significativas aqui) ---
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const treeRadios = document.querySelectorAll('input[name="tree"]');
    const messageDiv = document.getElementById('message');
    const appContainer = document.getElementById('app-container');

    /** Aplica ou remove o tema visual */
    function applyTheme(themeName) {
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes); // Remove todos os temas possíveis

        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Tema aplicado: ${themeName}`);
        } else {
            console.log('Tema visual removido ou nome inválido.');
        }
    }

    /** Carrega o tema salvo no localStorage */
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('userTheme');
        applyTheme(savedTheme); // Aplica o tema salvo ou nenhum se não houver/inválido
        if (savedTheme) {
            const savedRadio = document.querySelector(`input[name="tree"][value="${savedTheme}"]`);
            if (savedRadio) {
                savedRadio.checked = true;
            }
        } else {
             console.log('Nenhum tema salvo encontrado no localStorage.');
        }
    }

     /** Exibe mensagem */
     function showMessage(text, type = 'success') {
        messageDiv.textContent = text;
        messageDiv.className = `message-${type}`;
     }

     /** Limpa mensagem */
     function clearMessage() {
        messageDiv.textContent = '';
        messageDiv.className = '';
     }

    // --- Lógica Principal ---

    // 1. Carregar tema salvo ao entrar na página
    loadSavedTheme();

    // 2. Adicionar listener para o envio do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();

        // --- Validação ---
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const selectedTreeRadio = document.querySelector('input[name="tree"]:checked');

        if (!selectedTreeRadio) {
            showMessage('Por favor, selecione uma árvore avatar.', 'error');
            return;
        }
        const selectedTreeValue = selectedTreeRadio.value;

        if (!username || !password) {
             showMessage('Por favor, preencha o usuário e a senha.', 'error');
             return;
        }

        // --- Processamento do Sucesso ---

        // Criar o objeto e JSON (como antes)
        const userData = { username, password, treeAvatar: selectedTreeValue };
        const userDataJSON = JSON.stringify(userData, null, 2);
        console.log("Objeto de Usuário (JSON):", userDataJSON);

        // 1. Salvar a escolha no localStorage (para persistência)
        try {
            localStorage.setItem('userTheme', selectedTreeValue);
            console.log(`Tema '${selectedTreeValue}' salvo no localStorage.`);
        } catch (e) {
            console.error("Erro ao salvar no localStorage:", e);
        }

        // 2. APLICAR O TEMA IMEDIATAMENTE para feedback visual
        applyTheme(selectedTreeValue);

        // 3. Exibir mensagem de sucesso (já sobre o fundo colorido)
        showMessage(`Cadastro de ${username} ok! Tema ${selectedTreeValue} aplicado temporariamente.`, 'success');

        // 4. Limpar o formulário
        form.reset(); // Faz sentido limpar logo

        // 5. AGENDAR A REMOÇÃO DO TEMA VISUAL após um tempo
        const visualThemeDuration = 1500; // Duração em milissegundos (1.5 segundos)
        console.log(`Agendando remoção do tema visual em ${visualThemeDuration}ms`);

        setTimeout(() => {
            applyTheme(null); // Remove a classe de tema, voltando ao branco/padrão
            console.log('Tema visual resetado para o padrão.');
            // Opcional: Limpar a mensagem de sucesso também após o tempo
            // clearMessage();
        }, visualThemeDuration);

        // NÃO chamar loadSavedTheme() aqui.

        // Comentário sobre envio ao backend (como antes)
        /*
         fetch('/api/register', { ... }) ...
        */
    });

}); // Fim do DOMContentLoaded