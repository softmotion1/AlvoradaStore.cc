// main.js - AlvoradaSMP Loja Minecraft
document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let currentProduct = null;
    let currentPrice = null;
    let transactionId = null;
    const discordLink = 'https://discord.gg/Uh9bXpmTtk';
    const serverIP = 'alvoradasmp.ggwp.cc';
    const minecraftVersion = '1.21.x';

    // Inicializar elementos flutuantes
    initFloatingElements();

    // Inicializar navegação entre secções
    initNavigation();

    // Inicializar sistema de compra
    initPurchaseSystem();

    // Inicializar modais
    initModals();

    // Inicializar botões especiais
    initSpecialButtons();

    // Efeito de digitação no título
    initTypewriterEffect();

    // Animar cards sequencialmente
    animateCards();

    // Atualizar status do servidor
    updateServerStatus();
    setInterval(updateServerStatus, 30000);

    // Adicionar listener para tecla ESC
    document.addEventListener('keydown', handleEscapeKey);
});

// ==================== FUNÇÕES DE INICIALIZAÇÃO ====================

function initFloatingElements() {
    const floatingElements = document.getElementById('floatingElements');
    const colors = ['#FF7E5F', '#FEB47B', '#6A85B6', '#86A8E7', '#91EAE4'];
    
    for (let i = 0; i < 20; i++) {
        const float = document.createElement('div');
        float.classList.add('float');
        
        const size = Math.random() * 60 + 20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        float.style.width = `${size}px`;
        float.style.height = `${size}px`;
        float.style.left = `${Math.random() * 100}%`;
        float.style.background = `radial-gradient(circle, ${color}20, ${color}10)`;
        float.style.animationDuration = `${Math.random() * 20 + 20}s`;
        float.style.animationDelay = `${Math.random() * 5}s`;
        
        floatingElements.appendChild(float);
    }
}

function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Esconder todas as secções
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar a secção correspondente
            const sectionId = button.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Atualizar versão do Minecraft na seção de informações
            if (sectionId === 'info') {
                updateVersionInfo();
            }
        });
    });
}

function initPurchaseSystem() {
    // Adicionar event listeners aos botões de compra
    document.querySelectorAll('.btn[data-product]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obter dados do produto
            currentProduct = this.getAttribute('data-product');
            currentPrice = this.getAttribute('data-price');
            
            // Atualizar resumo da compra
            updateOrderSummary();
            
            // Mostrar modal de compra
            showModal('purchaseModal');
            
            // Focar no primeiro campo
            setTimeout(() => {
                document.getElementById('minecraftNick').focus();
            }, 300);
        });
    });

    // Processar formulário de compra
    document.getElementById('purchaseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const minecraftNick = document.getElementById('minecraftNick').value.trim();
        const discordTag = document.getElementById('discordTag').value.trim();
        
        // Validação básica
        if (!minecraftNick || !discordTag) {
            showAlert('Por favor, preenche todos os campos.');
            return;
        }

        // Validação do Discord (opcional, aceita com ou sem #)
        if (discordTag.includes('#') && discordTag.split('#').length > 2) {
            showAlert('Formato do Discord inválido. Use: nome#1234 ou apenas nome');
            return;
        }
        
        // Gerar ID de transação
        transactionId = generateTransactionId();
        
        // Atualizar detalhes da compra no modal de sucesso
        updateSuccessDetails(minecraftNick, discordTag);
        
        // Fechar modal de compra e mostrar modal de sucesso
        hideModal('purchaseModal');
        
        setTimeout(() => {
            showModal('successModal');
        }, 300);
        
        // Criar confetes
        createConfetti();
        
        // Salvar compra no histórico
        savePurchaseToHistory(minecraftNick, discordTag);
        
        // Limpar formulário
        this.reset();
    });

    // Validação do Discord Tag em tempo real
    document.getElementById('discordTag').addEventListener('input', function() {
        const value = this.value;
        if (value.includes('#') && value.split('#').length === 2) {
            this.style.borderColor = '#4CAF50';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

function initModals() {
    // Fechar modais com botões
    document.getElementById('closeModal').addEventListener('click', () => {
        hideModal('purchaseModal');
    });

    document.getElementById('cancelPurchase').addEventListener('click', () => {
        hideModal('purchaseModal');
    });

    document.getElementById('closeSuccess').addEventListener('click', () => {
        hideModal('successModal');
    });

    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const modalId = modal.id;
                hideModal(modalId);
            }
        });
    });
}

function initSpecialButtons() {
    // Botão para copiar IP
    document.querySelectorAll('.copy-ip-btn').forEach(btn => {
        btn.addEventListener('click', copyIP);
    });

    // Botão para conectar ao servidor
    const joinBtn = document.querySelector('button[onclick="joinServer()"]');
    if (joinBtn) {
        joinBtn.addEventListener('click', joinServer);
    }

    // Botões do Discord
    document.querySelectorAll('.discord-btn[href]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.getAttribute('href').startsWith('http')) {
                e.preventDefault();
            }
        });
    });
}

function initTypewriterEffect() {
    const title = document.querySelector('.logo h1');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
}

function animateCards() {
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animation = 'fadeUp 0.6s ease-out forwards';
        card.style.opacity = '0';
    });
}

// ==================== FUNÇÕES DE UTILIDADE ====================

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showAlert(message) {
    alert(message);
}

function updateOrderSummary() {
    const summaryElement = document.getElementById('orderSummary');
    const formattedPrice = parseFloat(currentPrice).toLocaleString('pt-PT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    summaryElement.innerHTML = `
        <div class="summary-item">
            <span>Produto:</span>
            <span>${currentProduct}</span>
        </div>
        <div class="summary-item">
            <span>Preço:</span>
            <span>€ ${formattedPrice}</span>
        </div>
        <div class="summary-item">
            <span>Total a pagar:</span>
            <span>€ ${formattedPrice}</span>
        </div>
    `;
}

function generateTransactionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '#';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function updateSuccessDetails(minecraftNick, discordTag) {
    const detailsElement = document.getElementById('orderDetails');
    const formattedPrice = parseFloat(currentPrice).toLocaleString('pt-PT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    detailsElement.innerHTML = `
        <p><strong>Produto:</strong> ${currentProduct}</p>
        <p><strong>Preço:</strong> € ${formattedPrice}</p>
        <p><strong>Nick Minecraft:</strong> ${minecraftNick}</p>
        <p><strong>Discord:</strong> ${discordTag}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
        <p><strong>Discord do Servidor:</strong> ${discordLink}</p>
    `;
    
    document.getElementById('transactionId').textContent = transactionId;
}

function copyIP() {
    const ip = 'alvoradasmp.ggwp.cc';
    navigator.clipboard.writeText(ip).then(() => {
        // Mostrar feedback
        const originalText = event.target.innerHTML;
        event.target.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        event.target.style.background = '#4CAF50';
        
        setTimeout(() => {
            event.target.innerHTML = originalText;
            event.target.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar IP:', err);
        showAlert('Erro ao copiar IP. Podes copiar manualmente: ' + ip);
    });
}

function joinServer() {
    const ip = 'alvoradasmp.ggwp.cc';
    navigator.clipboard.writeText(ip).then(() => {
        showAlert(
            'IP copiado para a área de transferência!\n\n' + 
            'IP: ' + ip + '\n\n' +
            'Agora abre o Minecraft e:\n' +
            '1. Vai a "Multiplayer"\n' +
            '2. Clica em "Add Server"\n' +
            '3. Cola o IP\n' +
            '4. Clica em "Join Server"\n\n' +
            'Versões suportadas: ' + minecraftVersion
        );
    }).catch(err => {
        console.error('Erro ao copiar IP:', err);
        showAlert(
            'IP do servidor: ' + ip + '\n\n' +
            'Copia este IP e cola no teu Minecraft!\n\n' +
            'Versões suportadas: ' + minecraftVersion
        );
    });
}

function createConfetti() {
    const confettiCount = 50;
    const confettiContainer = document.querySelector('.floating-elements');
    const colors = ['#FF7E5F', '#FEB47B', '#6A85B6', '#86A8E7', '#91EAE4'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('float');
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.background = color;
        confetti.style.borderRadius = '2px';
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = '0s';
        confetti.style.animationName = 'floatAnim';
        confetti.style.animationIterationCount = '1';
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function savePurchaseToHistory(minecraftNick, discordTag) {
    try {
        const purchases = JSON.parse(localStorage.getItem('alvorada_purchases') || '[]');
        const purchase = {
            id: transactionId,
            product: currentProduct,
            price: currentPrice,
            minecraftNick: minecraftNick,
            discordTag: discordTag,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        purchases.push(purchase);
        localStorage.setItem('alvorada_purchases', JSON.stringify(purchases));
        console.log('Compra guardada no histórico:', purchase);
    } catch (error) {
        console.error('Erro ao guardar compra no histórico:', error);
    }
}

function updateServerStatus() {
    const players = Math.floor(Math.random() * 30) + 20;
    const statusElement = document.querySelector('.server-status span:nth-child(2)');
    if (statusElement) {
        statusElement.textContent = `Online • ${players} jogadores`;
    }
}

function updateVersionInfo() {
    // Atualizar informações de versão na seção de informações
    const versionElements = document.querySelectorAll('.highlight');
    versionElements.forEach(el => {
        if (el.textContent.includes('1.16') || el.textContent.includes('1.20')) {
            el.textContent = minecraftVersion;
        }
    });
    
    // Atualizar texto de versões suportadas
    const versionTexts = document.querySelectorAll('p:contains("Versões")');
    versionTexts.forEach(el => {
        if (el.textContent.includes('1.16') || el.textContent.includes('1.20')) {
            el.textContent = el.textContent.replace(/1\.16.*1\.20/, minecraftVersion);
            el.textContent = el.textContent.replace(/1\.16 - 1\.20/, minecraftVersion);
        }
    });
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
}

// ==================== FUNÇÕES PÚBLICAS PARA USO NO HTML ====================

// Funções que podem ser chamadas diretamente do HTML
window.copyIP = copyIP;
window.joinServer = joinServer;

// Função para mostrar o histórico de compras (opcional)
function showPurchaseHistory() {
    try {
        const purchases = JSON.parse(localStorage.getItem('alvorada_purchases') || '[]');
        if (purchases.length === 0) {
            showAlert('Ainda não fizeste nenhuma compra.');
            return;
        }
        
        let historyText = 'Histórico de Compras:\n\n';
        purchases.forEach((purchase, index) => {
            historyText += `${index + 1}. ${purchase.product} (${purchase.id})\n`;
            historyText += `   Nick: ${purchase.minecraftNick}\n`;
            historyText += `   Data: ${new Date(purchase.date).toLocaleDateString('pt-PT')}\n`;
            historyText += `   Status: ${purchase.status}\n\n`;
        });
        
        showAlert(historyText);
    } catch (error) {
        console.error('Erro ao ler histórico:', error);
        showAlert('Erro ao carregar histórico de compras.');
    }
}

// Função para limpar o histórico (opcional, para debug)
function clearPurchaseHistory() {
    if (confirm('Tens a certeza que queres limpar todo o histórico de compras?')) {
        localStorage.removeItem('alvorada_purchases');
        showAlert('Histórico de compras limpo.');
    }
}

// Função para verificar se há compras pendentes
function checkPendingPurchases() {
    try {
        const purchases = JSON.parse(localStorage.getItem('alvorada_purchases') || '[]');
        const pending = purchases.filter(p => p.status === 'pending');
        
        if (pending.length > 0) {
            const plural = pending.length > 1 ? 's' : '';
            showAlert(
                `Tens ${pending.length} compra${plural} pendente${plural}.\n` +
                `Vai ao Discord para finalizar${plural}!\n\n` +
                `Discord: ${discordLink}`
            );
        }
    } catch (error) {
        console.error('Erro ao verificar compras pendentes:', error);
    }
}

// Inicializar verificação de compras pendentes quando a página carrega
window.addEventListener('load', function() {
    setTimeout(checkPendingPurchases, 2000);
});