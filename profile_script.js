// Arquivo: profile_script.js
// Inclui funcionalidade da Bio e exemplo COMENTADO de envio ao backend

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos (existentes) ---
    const appContainer = document.getElementById('app-container');
    const profileHeading = document.getElementById('profile-heading');
    const avatarImage = document.getElementById('avatar-image');
    const treeCountSpan = document.getElementById('tree-count');
    const goToLogButton = document.getElementById('go-to-log-button');
    const logoutButton = document.getElementById('logout-button');
    const countIpe = document.getElementById('count-Ipe');
    const countAngico = document.getElementById('count-Angico');
    const countAroeira = document.getElementById('count-Aroeira');
    const countJequitiba = document.getElementById('count-Jequitiba');
    const countPerobaCampo = document.getElementById('count-PerobaCampo');
    const speciesCountElements = {
        Ipe: countIpe, Angico: countAngico, Aroeira: countAroeira,
        Jequitiba: countJequitiba, PerobaCampo: countPerobaCampo
    };

    // --- Seletores para a BIO ---
    const bioDisplayArea = document.getElementById('bio-display-area');
    const bioTextDisplay = document.getElementById('bio-text-display');
    const bioEditArea = document.getElementById('bio-edit-area');
    const bioTextarea = document.getElementById('bio-textarea');
    const editBioButton = document.getElementById('edit-bio-button');
    const saveBioButton = document.getElementById('save-bio-button');
    const cancelEditBioButton = document.getElementById('cancel-edit-bio-button');
    const bioMessageDiv = document.getElementById('bio-message');

    // --- Função para Aplicar o Tema ---
    function applyTheme(themeName) {
        if (!appContainer) {
            console.error("Profile: Elemento #app-container não encontrado para aplicar tema.");
            return;
        }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        const themeClassName = `theme-${themeName}`;
        appContainer.classList.remove(...themes);
        if (themeName && themes.includes(themeClassName)) {
            appContainer.classList.add(themeClassName);
            console.log(`Profile: Tema '${themeName}' aplicado.`);
        } else {
            console.log(`Profile: Nenhum tema válido ('${themeName}') ou tema padrão.`);
        }
    }

    // --- Função para exibir mensagens da Bio ---
    function showBioMessage(text, type = 'success') {
        if(bioMessageDiv) {
            bioMessageDiv.textContent = text;
            bioMessageDiv.className = `message message-${type}`; // Reusa classes de mensagem
            bioMessageDiv.style.display = 'block';
            setTimeout(() => {
                if(bioMessageDiv) { // Verifica novamente se ainda existe
                    bioMessageDiv.style.display = 'none';
                    bioMessageDiv.textContent = '';
                    bioMessageDiv.className = 'message';
                }
            }, 3000); // Mensagem desaparece após 3 segundos
        }
    }

    // --- Função para Carregar Dados do Perfil (incluindo Bio) ---
    function loadProfileData() {
        console.log("Profile: Iniciando loadProfileData...");
        try {
            const userName = localStorage.getItem('userName') || "Usuário";
            const userTheme = localStorage.getItem('userTheme');
            applyTheme(userTheme);
            if (profileHeading) profileHeading.textContent = `Perfil de ${userName}`;

            if (avatarImage) {
                let avatarFilename = 'placeholder_tree.png';
                let avatarAltText = 'Avatar Padrão';
                if (userTheme === 'pau-brasil') {
                    avatarFilename = 'pau-brasil.jpg';
                    avatarAltText = 'Avatar Pau-Brasil';
                } else if (userTheme === 'castanheira') {
                    avatarFilename = 'castanheira.jpeg';
                    avatarAltText = 'Avatar Castanheira';
                } else if (userTheme === 'peroba-rosa') {
                    avatarFilename = 'Peroba-rosa.jpg';
                    avatarAltText = 'Avatar Peroba Rosa';
                }
                const imagePath = `images/${avatarFilename}`;
                avatarImage.src = imagePath;
                avatarImage.alt = avatarAltText;
                avatarImage.onerror = () => {
                    console.warn(`Profile: Falha ao carregar ${imagePath}. Usando placeholder.`);
                    avatarImage.src = 'images/placeholder_tree.png';
                    avatarImage.alt = 'Avatar Padrão';
                };
            } else {
                console.warn("Profile: Elemento #avatar-image não encontrado.");
            }

            let calculatedTotal = 0;
            for (const species in speciesCountElements) {
                const element = speciesCountElements[species];
                if (element) {
                    const speciesKey = `treesPlanted_${species}`;
                    const count = parseInt(localStorage.getItem(speciesKey) || '0', 10);
                    element.textContent = count.toString();
                    calculatedTotal += count;
                }
            }

            if (treeCountSpan) {
                treeCountSpan.textContent = calculatedTotal.toString();
            } else {
                 console.warn("Profile: Elemento #tree-count não encontrado.");
            }

            const stageNameElement = document.getElementById('avatar-stage-name');
            let stageName = "Plantada";
            if (calculatedTotal >= 1500) { stageName = "Anciã"; }
            else if (calculatedTotal >= 700) { stageName = "Madura"; }
            else if (calculatedTotal >= 300) { stageName = "Jovem"; }
            else if (calculatedTotal >= 100) { stageName = "Broto"; }

            if (stageNameElement) {
                stageNameElement.textContent = `Estágio: ${stageName}`;
            } else {
                console.warn("Profile: Elemento #avatar-stage-name não encontrado.");
            }

            // Carregar Bio
            const savedBio = localStorage.getItem('userBio');
            if (savedBio) {
                if(bioTextDisplay) bioTextDisplay.textContent = savedBio;
                if(bioTextarea) bioTextarea.value = savedBio;
            } else {
                if(bioTextDisplay) bioTextDisplay.textContent = "Sua bio ainda não foi definida. Clique em editar para adicionar uma!";
                if(bioTextarea) bioTextarea.value = "";
            }

        } catch (e) {
            console.error("Profile: Erro GERAL ao carregar dados do perfil:", e);
            if (profileHeading) profileHeading.textContent = "Erro ao carregar perfil";
        }
    }

    // --- Lógica da Bio ---
    if (editBioButton && bioDisplayArea && bioEditArea) {
        editBioButton.addEventListener('click', () => {
            bioDisplayArea.classList.add('hidden');
            bioEditArea.classList.remove('hidden');
            editBioButton.classList.add('hidden');
            bioTextarea.value = localStorage.getItem('userBio') || ""; // Garante que o textarea tem o valor mais recente
            bioTextarea.focus();
        });
    }

    if (cancelEditBioButton && bioDisplayArea && bioEditArea && editBioButton) {
        cancelEditBioButton.addEventListener('click', () => {
            bioDisplayArea.classList.remove('hidden');
            bioEditArea.classList.add('hidden');
            editBioButton.classList.remove('hidden');
        });
    }

    if (saveBioButton && bioTextarea && bioDisplayArea && bioEditArea && editBioButton) {
        saveBioButton.addEventListener('click', () => {
            const newBio = bioTextarea.value.trim();
            try {
                localStorage.setItem('userBio', newBio);
                bioTextDisplay.textContent = newBio || "Sua bio ainda não foi definida. Clique em editar para adicionar uma!";
                
                bioDisplayArea.classList.remove('hidden');
                bioEditArea.classList.add('hidden');
                editBioButton.classList.remove('hidden');
                showBioMessage("Bio salva com sucesso!", "success");

                // Se a bio fosse salva no backend, a chamada seria aqui, ANTES de atualizar a UI
                // ou no callback de sucesso do fetch.
                // Ex: saveProfileDataToBackend({ bio: newBio }); // (Função de exemplo comentada abaixo)

            } catch (e) {
                console.error("Erro ao salvar bio no localStorage:", e);
                showBioMessage("Erro ao salvar bio.", "error");
            }
        });
    }


    // --- Configuração dos Event Listeners (existentes) ---
    if (goToLogButton) {
        goToLogButton.addEventListener('click', () => {
            window.location.href = 'log_reforestation.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            const confirmLogout = window.confirm("Tem certeza que deseja sair?");
            if (confirmLogout) {
                console.log("Profile: Iniciando processo de logout...");
                try {
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userTheme');
                    localStorage.removeItem('userBio'); // Limpar a bio também ao sair
                    for (const speciesKey in speciesCountElements) {
                         localStorage.removeItem(`treesPlanted_${speciesKey}`);
                    }
                    localStorage.removeItem('totalTreesPlanted'); // Segurança
                    console.log("Profile: Dados do usuário removidos do localStorage.");
                    window.location.href = 'index.html';
                } catch (e) {
                    console.error("Profile: Erro durante o logout ao limpar localStorage:", e);
                    alert("Ocorreu um erro ao tentar sair. Tente novamente.");
                }
            } else {
                console.log("Profile: Logout cancelado pelo usuário.");
            }
        });
    } else {
        console.warn("Profile: Botão de logout (#logout-button) não encontrado.");
    }

    // --- Inicialização ---
    loadProfileData();


    /* --- EXEMPLO DE CÓDIGO PARA ENVIAR ATUALIZAÇÕES DO PERFIL (INCLUINDO BIO) AO BACKEND (COMENTADO) ---
    
    // Esta função poderia ser chamada, por exemplo, após o usuário salvar a bio ou outras informações
    // que precisam ser persistidas no servidor.

    async function saveProfileDataToBackend(dataToSave) {
        // dataToSave seria um objeto como { bio: "Nova bio...", username: "novoNome", ... }
        
        // Suponha que você tenha um botão "Salvar Todas as Alterações no Servidor"
        // ou que o botão "Salvar Bio" também dispare essa função.

        // const saveToServerButton = document.getElementById('save-to-server-button'); // Botão hipotético
        // if (saveToServerButton) saveToServerButton.disabled = true;

        console.log("Tentando enviar dados do perfil ao backend:", dataToSave);

        try {
            // Substitua '/api/profile/update' pela URL REAL do seu endpoint
            // O método pode ser PUT para substituir todo o perfil do usuário,
            // ou PATCH para atualizações parciais. POST também pode ser usado.
            const response = await fetch('/api/profile/update', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer SEU_TOKEN_JWT_AQUI' // Se API protegida
                },
                body: JSON.stringify(dataToSave)
            });

            if (response.ok) {
                const result = await response.json().catch(() => ({})); // Backend pode retornar o perfil atualizado
                console.log("Perfil atualizado com sucesso no backend:", result);
                showBioMessage("Dados do perfil salvos no servidor!", "success"); // Reutilizando showBioMessage
                
                // Se o backend retornar dados atualizados (ex: username, bio),
                // você pode querer atualizar o localStorage e a UI novamente.
                // Ex:
                // if (result.username) localStorage.setItem('userName', result.username);
                // if (result.bio) localStorage.setItem('userBio', result.bio);
                // loadProfileData(); // Para refletir quaisquer mudanças retornadas pelo backend
            } else {
                const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status} ao salvar perfil no servidor.` }));
                console.error("Erro do backend ao atualizar perfil:", errorResult);
                showBioMessage(`Falha ao salvar no servidor: ${errorResult.message}`, "error");
            }
        } catch (networkError) {
            console.error("Erro de rede ao atualizar perfil no servidor:", networkError);
            showBioMessage("Erro de conexão ao tentar salvar dados no servidor.", "error");
        } finally {
            // if (saveToServerButton) saveToServerButton.disabled = false;
        }
    }

    // Exemplo de como você poderia chamar a função acima se tivesse um botão "Salvar Bio no Servidor"
    // Isso iria DENTRO do event listener do seu botão "Salvar Bio" existente, após o localStorage.setItem
    // if (saveBioButton) {
    //     saveBioButton.addEventListener('click', () => {
    //         // ... (lógica existente para salvar bio no localStorage) ...
    //         const newBio = bioTextarea.value.trim();
    //         if(localStorage.getItem('userBio') === newBio) { // Confirma que foi salvo localmente
    //             // Chama a função para enviar ao backend, por exemplo, apenas a bio
    //             saveProfileDataToBackend({ bio: newBio, username: localStorage.getItem('userName') }); 
    //             // Você pode querer enviar mais dados do perfil junto, ou o backend pode inferir o usuário pelo token.
    //         }
    //     });
    // }

    --- FIM DO EXEMPLO COMENTADO PARA BACKEND --- */

}); // Fim do DOMContentLoaded