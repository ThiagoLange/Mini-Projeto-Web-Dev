// Arquivo: script.js - Para a página de cadastro: index.html

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const treeRadios = document.querySelectorAll('input[name="tree"]');
    const messageDiv = document.getElementById('message');
    const appContainer = document.getElementById('app-container');

    // --- Funções Auxiliares ---

    /** Aplica tema visual temporário */
    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
        }
    }

    /** Exibe mensagem de feedback */
    function showMessage(text, type = 'success') {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = ''; // Limpa classes antigas
        messageDiv.classList.add('message', `message-${type}`);
    }

    /** Limpa a área de mensagens */
    function clearMessage() {
        if (!messageDiv) return;
        messageDiv.textContent = '';
        messageDiv.className = '';
    }

    // --- Lógica Principal da Página de Cadastro ---

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário
            clearMessage(); // Limpa mensagens antigas

            // --- Validação ---
            const username = usernameInput.value.trim();
            const password = passwordInput.value; // Apenas para validação local, não salvar!
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

            // --- Objeto de Dados (Apenas para exemplo/log, se necessário) ---
             const userDataExample = {
                 username: username,
                 // password: password, // Não salvar senha no localStorage!
                 treeAvatar: selectedTreeValue
             };
             console.log("Dados de cadastro (exemplo):", userDataExample); // Log para debug

            // Salva direto no localStorage e redireciona

            // 1. Salva dados essenciais para o frontend no localStorage SEM SENHA
             try {
                 localStorage.setItem('userTheme', selectedTreeValue);
                 localStorage.setItem('userName', username);
                 console.log(`Tema '${selectedTreeValue}' e usuário '${username}' salvos no localStorage.`);
             } catch (e) {
                 console.error("Erro crítico ao salvar dados essenciais no localStorage:", e);
                 showMessage("Erro ao salvar preferências. Não foi possível continuar.", "error");
                 return; // Interrompe se não puder salvar no localStorage
             }

            // 2. Aplicar tema (temporário nesta página)
             applyTheme(selectedTreeValue);

            // 3. Exibir mensagem de sucesso e indicar redirecionamento
             showMessage(`Cadastro de ${username} realizado! Redirecionando para o seu perfil...`, 'success');

            // 4. Limpar formulário
             form.reset();

            // 5. Agendar redirecionamento para o perfil
             const redirectDelay = 1500; // Tempo em milissegundos
             setTimeout(() => {
                 applyTheme(null); // Reseta tema visual desta página
                 window.location.href = 'profile.html'; // Redireciona
             }, redirectDelay);


            /* --- Exemplo de código para envio ao Backend ---

            // Desabilitar botão para evitar múltiplos envios
            // const submitButton = form.querySelector('button[type="submit"]');
            // submitButton.disabled = true;
            // submitButton.textContent = 'Cadastrando...';

            // Objeto de Dados para Envio ao Backend
            // const userDataToSend = {
            //     username: username,
            //     password: password, // Enviar para backend via HTTPS
            //     treeAvatar: selectedTreeValue
            // };

            try {
                // Substituir '/api/register' pela URL REAL do seu endpoint de backend
                console.log("Enviando para backend:", JSON.stringify(userDataToSend)); // Log para debug.
                const response = await fetch('/api/register', {
                    method: 'POST', // Método HTTP para criar um recurso
                    headers: {
                        'Content-Type': 'application/json', // Informa que estamos enviando JSON
                        'Accept': 'application/json' // Opcional: informa que esperamos JSON de volta
                    },
                    body: JSON.stringify(userDataToSend) // Converte o objeto JS em string JSON
                });

                // Verifica se a resposta do backend foi bem-sucedida
                if (response.ok) {
                    const result = await response.json().catch(() => ({})); // Pega JSON ou objeto vazio se não houver corpo
                    console.log("Backend respondeu com sucesso:", result);

                    // --- SUCESSO: Backend confirmou o cadastro ---
                    try {
                        // 1. Salvar dados do frontend no localStorage (NUNCA a senha!)
                        localStorage.setItem('userTheme', selectedTreeValue);
                        localStorage.setItem('userName', username);
                        console.log(`Tema '${selectedTreeValue}' e usuário '${username}' salvos no localStorage.`);

                        // 2. Aplicar tema visual temporário
                        applyTheme(selectedTreeValue);

                        // 3. Exibir mensagem de sucesso e indicar redirecionamento
                        showMessage(`Cadastro de ${username} realizado com sucesso! Redirecionando...`, 'success');

                        // 4. Limpar formulário
                        form.reset();

                        // 5. Agendar redirecionamento para o perfil
                        const redirectDelay = 1500;
                        setTimeout(() => {
                            applyTheme(null); // Reseta tema visual desta página
                            window.location.href = 'profile.html'; // Redireciona
                        }, redirectDelay);

                    } catch (e) {
                        console.error("Erro ao processar sucesso no frontend (localStorage/redirect):", e);
                        showMessage("Cadastro realizado no servidor, mas houve um erro ao atualizar a página local.", "error");
                        // Habilitar botão novamente, pois o estado do frontend está inconsistente
                        // submitButton.disabled = false;
                        // submitButton.textContent = 'Cadastrar';
                    }

                } else {
                    // --- ERRO: Backend retornou um erro ---
                    const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status}: ${response.statusText}` }));
                    console.error("Erro do Backend:", errorResult);
                    showMessage(`Falha no cadastro: ${errorResult.message || 'Erro desconhecido do servidor.'}`, 'error');
                    // Habilitar botão novamente
                    // submitButton.disabled = false;
                    // submitButton.textContent = 'Cadastrar';
                }

            } catch (error) {
                // --- ERRO: Falha de rede ou conexão ---
                console.error('Erro na requisição fetch:', error);
                showMessage('Erro de conexão ao tentar cadastrar. Verifique sua rede ou tente mais tarde.', 'error');
                // Habilitar botão novamente
                // submitButton.disabled = false;
                // submitButton.textContent = 'Cadastrar';
            }
            // --- FIM: Exemplo de código para envio ao Backend --- */

        }); // Fim do event listener 'submit'
    } else {
        console.error("Elemento #registration-form não encontrado.");
    }

});