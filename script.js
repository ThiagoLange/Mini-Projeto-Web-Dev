document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores e Funções Auxiliares ---
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const treeRadios = document.querySelectorAll('input[name="tree"]');
    const messageDiv = document.getElementById('message');
    const appContainer = document.getElementById('app-container');

    // A função applyTheme ainda é necessária para a exibição temporária durante o submit
    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);

        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
            console.log(`Tema ${themeName} aplicado.`);
        } else {
            console.log('Tema visual removido ou nome inválido.');
        }
    }

    // Funções showMessage e clearMessage (sem alterações)
    function showMessage(text, type = 'success') {
        messageDiv.textContent = text;
        messageDiv.className = '';
        messageDiv.classList.add(`message-${type}`);
    }
    function clearMessage() {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }

    // --- Lógica Principal da Página de Cadastro ---

    console.log("Página de cadastro carregada com tema padrão.");


    // 2. Adicionar listener para o envio do formulário (lógica interna permanece a mesma)
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();

        // Validação...
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const selectedTreeRadio = document.querySelector('input[name="tree"]:checked');

        if (!selectedTreeRadio) {
            showMessage('Por favor, selecione uma árvore avatar.', 'error'); return;
        }
        const selectedTreeValue = selectedTreeRadio.value;
        if (!username || !password) {
            showMessage('Por favor, preencha o usuário e a senha.', 'error'); return;
        }

        // Processamento do Sucesso...
        const userData = { username, password, treeAvatar: selectedTreeValue };
        const userDataJSON = JSON.stringify(userData, null, 2);
        console.log("Objeto de Usuário (JSON):", userDataJSON);

        // Salvar no localStorage (AINDA NECESSÁRIO para a próxima página)
        try {
            localStorage.setItem('userTheme', selectedTreeValue);
            console.log(`Tema '${selectedTreeValue}' salvo no localStorage.`);
        } catch (e) { console.error("Erro ao salvar no localStorage:", e); }

        // Aplicar tema TEMPORARIAMENTE
        applyTheme(selectedTreeValue);

        // Exibir mensagem de sucesso
        showMessage(`Cadastro de ${username} realizado! Redirecionando...`, 'success');

        // Limpar formulário
        form.reset();

        // Agendar reset visual e redirecionamento
        const redirectDelay = 1500;
        setTimeout(() => {
            applyTheme(null); // Limpa tema visual ANTES de redirecionar
            window.location.href = 'reflorestamento.html'; // Redireciona
        }, redirectDelay);
    });

}); // Fim do DOMContentLoaded