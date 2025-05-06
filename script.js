// Arquivo: script.js
// Gerencia cadastro/login, userProfiles, e define userTheme para a sessão.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');
    const appContainer = document.getElementById('app-container');

    function applyTheme(themeName) {
        if (!appContainer) return;
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(`theme-${themeName}`)) {
            appContainer.classList.add(`theme-${themeName}`);
        }
    }

    function showMessage(text, type = 'success') {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = '';
        messageDiv.classList.add('message', `message-${type}`);
    }

    function clearMessage() {
        if (!messageDiv) return;
        messageDiv.textContent = '';
        messageDiv.className = '';
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            clearMessage();

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

            try {
                // 1. Salvar/Atualizar lista de perfis de todos os usuários
                let userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
                const existingUserIndex = userProfiles.findIndex(profile => profile.username === username);

                if (existingUserIndex > -1) {
                    userProfiles[existingUserIndex].treeAvatar = selectedTreeValue; // Atualiza o avatar
                    console.log(`Perfil de '${username}' atualizado com novo avatar: ${selectedTreeValue}`);
                } else {
                    userProfiles.push({ username: username, treeAvatar: selectedTreeValue });
                    console.log(`Novo perfil para '${username}' adicionado com avatar: ${selectedTreeValue}`);
                }
                localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

                // 2. Configurar "sessão" do usuário atual
                localStorage.setItem('userTheme', selectedTreeValue); // Salva o tema/avatar da SESSÃO ATUAL
                localStorage.setItem('userName', username);

                // Limpar bio ao "logar" para simular uma "nova sessão" para a bio.
                localStorage.removeItem('userBio'); // A bio no profile_script é carregada/salva como userBio_NOMEUSUARIO
                console.log("'userBio' (genérica) limpa para a nova sessão, se existia.");


                console.log(`Tema da sessão '${selectedTreeValue}' e usuário '${username}' definidos.`);
            } catch (e) {
                console.error("Erro ao salvar dados no localStorage:", e);
                showMessage("Erro ao salvar preferências. Não foi possível continuar.", "error");
                return;
            }

            applyTheme(selectedTreeValue); // Aplica tema visualmente nesta página
            showMessage(`Cadastro/Login de ${username} realizado! Redirecionando...`, 'success');
            form.reset();

            const redirectDelay = 1500;
            setTimeout(() => {
                applyTheme(null); // Reseta tema visual desta página
                window.location.href = 'profile.html';
            }, redirectDelay);

            /* --- Exemplo de código para envio para o Backend ---
            
            // const submitButton = form.querySelector('button[type="submit"]');
            // if(submitButton) {
            //     submitButton.disabled = true;
            //     submitButton.textContent = 'Cadastrando...';
            // }
            // const userDataToSend = {
            //     username: username,
            //     password: password,
            //     treeAvatar: selectedTreeValue
            // };
            // (async () => { // Função anônima async para usar await aqui dentro se necessário
            //     try {
            //         const response = await fetch('/api/register', {
            //             method: 'POST',
            //             headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            //             body: JSON.stringify(userDataToSend)
            //         });
            //         if (response.ok) {
            //             // ... Lógica de sucesso do backend ...
            //             // Mover a lógica de localStorage.setItem e redirect para cá
            //         } else {
            //             // ... Lógica de erro do backend ...
            //             // if(submitButton) {
            //             //     submitButton.disabled = false;
            //             //     submitButton.textContent = 'Cadastrar';
            //             // }
            //         }
            //     } catch (error) {
            //         // ... Lógica de erro de rede ...
            //         // if(submitButton) {
            //         //     submitButton.disabled = false;
            //         //     submitButton.textContent = 'Cadastrar';
            //         // }
            //     }
            // })();
            */
        });
    }
});