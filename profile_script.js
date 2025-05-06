// Arquivo: profile_script.js
// Carrega avatar priorizando userProfiles, com fallback para userTheme da sessão.
// Calcula totais do usuário a partir de reforestationLogEntries.
// Bio por usuário. Inclui exemplo de backend comentado.

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores de Elementos ---
    const appContainer = document.getElementById('app-container');
    const profileHeading = document.getElementById('profile-heading');
    const avatarImage = document.getElementById('avatar-image');
    const treeCountSpan = document.getElementById('tree-count');
    const goToLogButton = document.getElementById('go-to-log-button');
    const logoutButton = document.getElementById('logout-button');
    const speciesDisplayElements = {
        Ipe: document.getElementById('count-Ipe'),
        Angico: document.getElementById('count-Angico'),
        Aroeira: document.getElementById('count-Aroeira'),
        Jequitiba: document.getElementById('count-Jequitiba'),
        PerobaCampo: document.getElementById('count-PerobaCampo')
    };
    const bioDisplayArea = document.getElementById('bio-display-area');
    const bioTextDisplay = document.getElementById('bio-text-display');
    const bioEditArea = document.getElementById('bio-edit-area');
    const bioTextarea = document.getElementById('bio-textarea');
    const editBioButton = document.getElementById('edit-bio-button');
    const saveBioButton = document.getElementById('save-bio-button');
    const cancelEditBioButton = document.getElementById('cancel-edit-bio-button');
    const bioMessageDiv = document.getElementById('bio-message');
    const stageNameElement = document.getElementById('avatar-stage-name');

    // --- Função para Aplicar o Tema da PÁGINA ---
    function applyPageTheme(themeName) {
        if (!appContainer) { console.error("Profile: #app-container não encontrado para tema."); return; }
        const themes = ['theme-pau-brasil', 'theme-castanheira', 'theme-peroba-rosa'];
        appContainer.classList.remove(...themes); // Limpa temas antigos
        const themeClassName = `theme-${themeName}`;
        if (themeName && themes.includes(themeClassName)) {
            appContainer.classList.add(themeClassName);
            console.log(`Profile Page: Tema '${themeName}' aplicado ao container.`);
        } else {
            console.log(`Profile Page: Nenhum tema válido ('${themeName}') ou tema padrão para o container.`);
        }
    }

    // --- Função para exibir mensagens da Bio ---
    function showBioMessage(text, type = 'success') {
        if (bioMessageDiv) {
            bioMessageDiv.textContent = text;
            bioMessageDiv.className = `message message-${type}`;
            bioMessageDiv.style.display = 'block';
            setTimeout(() => {
                if (bioMessageDiv) {
                    bioMessageDiv.style.display = 'none';
                    bioMessageDiv.textContent = '';
                    bioMessageDiv.className = 'message';
                }
            }, 3000);
        }
    }

    // --- Função para Carregar Dados do Perfil ---
    function loadProfileData() {
        console.log("Profile: Iniciando loadProfileData (bio por usuário, avatar revisado)...");
        try {
            const currentUserName = localStorage.getItem('userName');
            const sessionUserTheme = localStorage.getItem('userTheme'); // Tema escolhido neste "login"

            if (!currentUserName) {
                console.warn("Nenhum usuário logado. Exibindo perfil genérico/vazio.");
                if (profileHeading) profileHeading.textContent = "Perfil (Faça login)";
                if (treeCountSpan) treeCountSpan.textContent = '0';
                Object.values(speciesDisplayElements).forEach(el => { if (el) el.textContent = '0'; });
                if (stageNameElement) stageNameElement.textContent = 'Estágio: N/A';
                if (bioTextDisplay) bioTextDisplay.textContent = "Faça login para ver seu perfil.";
                if (avatarImage) {
                    avatarImage.src = 'images/placeholder_tree.png';
                    avatarImage.alt = 'Avatar Padrão';
                }
                applyPageTheme(null); // Aplica tema padrão/limpo
                if (goToLogButton) goToLogButton.style.display = 'none';
                if (editBioButton) editBioButton.style.display = 'none';
                if (logoutButton) logoutButton.style.display = 'none';
                if (bioEditArea) bioEditArea.classList.add('hidden');
                if (bioDisplayArea) bioDisplayArea.classList.remove('hidden');
                return;
            } else {
                if (goToLogButton) goToLogButton.style.display = 'inline-block';
                if (editBioButton) editBioButton.style.display = 'inline-block';
                if (logoutButton) logoutButton.style.display = 'inline-block';
            }

            if (profileHeading) profileHeading.textContent = `Perfil de ${currentUserName}`;

            // Determinar o tema/avatar a ser usado para a página E para a imagem do avatar
            let themeForPageAndAvatar;
            const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
            const currentUserProfileEntry = userProfiles.find(p => p.username === currentUserName);

            if (currentUserProfileEntry && currentUserProfileEntry.treeAvatar) {
                themeForPageAndAvatar = currentUserProfileEntry.treeAvatar;
                console.log(`Profile: Usando avatar de userProfiles para ${currentUserName}: ${themeForPageAndAvatar}`);
            } else {
                themeForPageAndAvatar = sessionUserTheme;
                console.log(`Profile: Usando avatar da sessão (userTheme) para ${currentUserName}: ${themeForPageAndAvatar}`);
            }

            applyPageTheme(themeForPageAndAvatar); // Aplica o tema geral da página

            // Carregar Imagem do Avatar
            if (avatarImage) {
                let avatarFilename = 'placeholder_tree.png';
                let avatarAltText = 'Avatar Padrão';
                console.log(`Profile: Definindo imagem do avatar com base no tema/avatar: '${themeForPageAndAvatar}'`);

                if (themeForPageAndAvatar === 'pau-brasil') {
                    avatarFilename = 'pau-brasil.jpg'; avatarAltText = 'Avatar Pau-Brasil';
                } else if (themeForPageAndAvatar === 'castanheira') {
                    avatarFilename = 'castanheira.jpeg'; avatarAltText = 'Avatar Castanheira';
                } else if (themeForPageAndAvatar === 'peroba-rosa') {
                    avatarFilename = 'Peroba-rosa.jpg'; avatarAltText = 'Avatar Peroba Rosa';
                } else {
                    console.warn(`Profile: Valor de tema/avatar '${themeForPageAndAvatar}' não reconhecido para imagem. Usando placeholder.`);
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

            // Calcular contagens do usuário a partir de reforestationLogEntries
            const reforestationLogEntries = JSON.parse(localStorage.getItem('reforestationLogEntries')) || [];
            let userTotalTrees = 0;
            const userSpeciesTotals = {};
            reforestationLogEntries.forEach(entry => {
                if (entry.username === currentUserName) {
                    userTotalTrees += entry.quantity;
                    userSpeciesTotals[entry.species] = (userSpeciesTotals[entry.species] || 0) + entry.quantity;
                }
            });
            if (treeCountSpan) treeCountSpan.textContent = userTotalTrees.toString();
            for (const species in speciesDisplayElements) {
                const element = speciesDisplayElements[species];
                if (element) {
                    element.textContent = (userSpeciesTotals[species] || 0).toString();
                }
            }

            // Atualizar Estágio
            let stageName = "Plantada";
            if (userTotalTrees >= 1500) { stageName = "Anciã"; }
            else if (userTotalTrees >= 700) { stageName = "Madura"; }
            else if (userTotalTrees >= 300) { stageName = "Jovem"; }
            else if (userTotalTrees >= 100) { stageName = "Broto"; }
            if (stageNameElement) stageNameElement.textContent = `Estágio: ${stageName}`;

            // Carregar Bio específica do usuário
            const userBioKey = `userBio_${currentUserName}`;
            const savedBio = localStorage.getItem(userBioKey);
            if (bioTextDisplay) {
                bioTextDisplay.textContent = savedBio || "Sua bio ainda não foi definida. Clique em editar para adicionar uma!";
            }
            if (bioTextarea) {
                bioTextarea.value = savedBio || "";
            }

        } catch (e) {
            console.error("Profile: Erro GERAL ao carregar dados do perfil:", e);
            if (profileHeading) profileHeading.textContent = "Erro ao carregar perfil";
        }
    }

    // --- Lógica da Bio ---
    if (editBioButton) {
        editBioButton.addEventListener('click', () => {
            const currentUserName = localStorage.getItem('userName');
            if (!currentUserName) {
                showBioMessage("Faça login para editar a bio.", "error");
                return;
            }
            if (bioDisplayArea && bioEditArea && bioTextarea) {
                bioDisplayArea.classList.add('hidden');
                bioEditArea.classList.remove('hidden');
                editBioButton.classList.add('hidden');
                const userBioKey = `userBio_${currentUserName}`;
                bioTextarea.value = localStorage.getItem(userBioKey) || "";
                bioTextarea.focus();
            } else {
                console.warn("Elementos da área da bio não encontrados para edição.");
            }
        });
    } else {
        console.warn("Botão 'editBioButton' não encontrado.");
    }

    if (cancelEditBioButton) {
        cancelEditBioButton.addEventListener('click', () => {
            if (bioDisplayArea && bioEditArea && editBioButton) {
                bioDisplayArea.classList.remove('hidden');
                bioEditArea.classList.add('hidden');
                editBioButton.classList.remove('hidden');
            } else {
                console.warn("Elementos da área da bio não encontrados para cancelar edição.");
            }
        });
    } else {
        console.warn("Botão 'cancelEditBioButton' não encontrado.");
    }

    if (saveBioButton) {
        saveBioButton.addEventListener('click', () => {
            const currentUserName = localStorage.getItem('userName');
            if (!currentUserName) {
                showBioMessage("Faça login para salvar a bio.", "error");
                return;
            }
            if (bioTextarea && bioTextDisplay && bioDisplayArea && bioEditArea && editBioButton) {
                const newBio = bioTextarea.value.trim();
                try {
                    const userBioKey = `userBio_${currentUserName}`;
                    localStorage.setItem(userBioKey, newBio);
                    bioTextDisplay.textContent = newBio || "Sua bio ainda não foi definida. Clique em editar para adicionar uma!";
                    
                    bioDisplayArea.classList.remove('hidden');
                    bioEditArea.classList.add('hidden');
                    editBioButton.classList.remove('hidden');
                    showBioMessage("Bio salva com sucesso!", "success");

                    // Exemplo de chamada para backend (COMENTADO):
                    // if (currentUserName) {
                    //    saveProfileDataToBackend({ username: currentUserName, bio: newBio, theme: localStorage.getItem('userTheme') });
                    // }

                } catch (e) {
                    console.error("Erro ao salvar bio no localStorage:", e);
                    showBioMessage("Erro ao salvar bio.", "error");
                }
            } else {
                 console.warn("Elementos da área da bio não encontrados para salvar.");
            }
        });
    } else {
        console.warn("Botão 'saveBioButton' não encontrado.");
    }

    // --- Configuração dos Event Listeners (existentes) ---
    if (goToLogButton) {
        goToLogButton.addEventListener('click', () => {
            // Verifica se o usuário está "logado" antes de redirecionar
            if (localStorage.getItem('userName')) {
                window.location.href = 'log_reforestation.html';
            } else {
                alert("Por favor, faça login ou cadastre-se primeiro para registrar uma ação.");
                // Opcional: redirecionar para index.html
                // window.location.href = 'index.html';
            }
        });
    } else {
        console.warn("Botão 'goToLogButton' não encontrado.");
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            const confirmLogout = window.confirm("Tem certeza que deseja sair?");
            if (confirmLogout) {
                try {
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userTheme');
                    // Não remove userBio_NOMEUSUARIO, pois ela deve persistir para o usuário.
                    // Remove a chave 'userBio' genérica antiga, se existir, por limpeza.
                    localStorage.removeItem('userBio'); 

                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('treesPlanted_') || key === 'totalTreesPlanted') {
                            localStorage.removeItem(key);
                        }
                    });
                    console.log("Profile: Logout realizado, dados de sessão limpos.");
                    window.location.href = 'index.html';
                } catch (e) {
                    console.error("Erro durante o logout:", e);
                    alert("Ocorreu um erro ao tentar sair.");
                }
            }
        });
    } else {
        console.warn("Botão 'logoutButton' não encontrado.");
    }

    // --- Inicialização ---
    loadProfileData();


    /* --- EXEMPLO DE CÓDIGO PARA ENVIAR ATUALIZAÇÕES DO PERFIL AO BACKEND (COMENTADO) ---
    async function saveProfileDataToBackend(dataToSave) {
        // dataToSave seria um objeto como { username: "usuárioLogado", bio: "Nova bio...", theme: "novoTema" }
        // O 'username' é crucial para o backend saber qual perfil atualizar.
        if (!dataToSave.username) {
            console.error("Username é necessário para salvar dados do perfil no backend.");
            showBioMessage("Erro interno: não foi possível identificar o usuário para salvar no servidor.", "error");
            return;
        }
        console.log("Tentando enviar dados do perfil ao backend:", dataToSave);
        // const saveButton = document.getElementById('algum-botao-salvar-no-servidor'); // Botão hipotético
        // if(saveButton) saveButton.disabled = true;
        try {
            // SUBSTITUA '/api/profile/update' ou `/api/users/${dataToSave.username}` pela URL REAL
            const response = await fetch(`/api/users/${dataToSave.username}`, { // Exemplo com username na URL
                method: 'PUT', // Ou 'POST' ou 'PATCH', dependendo da sua API
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer SEU_TOKEN_JWT_AQUI' // Se API protegida
                },
                // Envie apenas os campos que podem ser alterados ou que o backend espera
                body: JSON.stringify({ bio: dataToSave.bio, theme: dataToSave.theme }) 
            });
            if (response.ok) {
                const result = await response.json().catch(() => ({}));
                console.log("Perfil atualizado com sucesso no backend:", result);
                showBioMessage("Dados do perfil salvos no servidor!", "success");
                
                // Opcional: atualizar localStorage/UI com dados retornados pelo backend.
                // if(result.bio) localStorage.setItem(`userBio_${dataToSave.username}`, result.bio);
                // if(result.theme) {
                //    localStorage.setItem('userTheme', result.theme); // Atualiza tema da sessão
                //    // E também atualizar em userProfiles
                //    let userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
                //    const userIdx = userProfiles.findIndex(p => p.username === dataToSave.username);
                //    if (userIdx > -1) {
                //        userProfiles[userIdx].treeAvatar = result.theme;
                //        localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
                //    }
                // }
                // loadProfileData(); // Para refletir quaisquer mudanças
            } else {
                const errorResult = await response.json().catch(() => ({ message: `Erro ${response.status} ao salvar no servidor.` }));
                console.error("Erro do backend ao atualizar perfil:", errorResult);
                showBioMessage(`Falha ao salvar no servidor: ${errorResult.message}`, "error");
            }
        } catch (networkError) {
            console.error("Erro de rede ao atualizar perfil no servidor:", networkError);
            showBioMessage("Erro de conexão ao tentar salvar dados no servidor.", "error");
        } finally {
            // if(saveButton) saveButton.disabled = false;
        }
    }
    --- FIM DO EXEMPLO COMENTADO PARA BACKEND --- */

});