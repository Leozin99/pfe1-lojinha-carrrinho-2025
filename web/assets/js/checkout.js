document.addEventListener('DOMContentLoaded', function() {
    carregarResumoPedido();
    atualizarContadorCarrinho();
    
    document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);
});

async function carregarResumoPedido() {
    const carrinho = window.carrinho.getCarrinho();
    const resumoPedido = document.getElementById('resumo-pedido');
    const totalPedido = document.getElementById('total-pedido');
    
    if (carrinho.length === 0) {
        resumoPedido.innerHTML = '<p>Seu carrinho está vazio</p>';
        totalPedido.textContent = 'R$ 0,00';
        return;
    }

    try {
        const response = await fetch('assets/dados.json');
        const data = await response.json();
        const produtos = data.produtos;
        
        resumoPedido.innerHTML = '';
        let total = 0;
        
        carrinho.forEach(item => {
            const produto = produtos.find(p => p.id === item.id);
            if (produto) {
                const subtotal = produto.preco * item.quantidade;
                total += subtotal;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'd-flex justify-content-between mb-2';
                itemDiv.innerHTML = `
                    <div>
                        <h6>${produto.nome}</h6>
                        <small class="text-muted">${item.quantidade} x R$ ${produto.preco.toFixed(2)}</small>
                    </div>
                    <div>R$ ${subtotal.toFixed(2)}</div>
                `;
                resumoPedido.appendChild(itemDiv);
            }
        });
        
        totalPedido.textContent = `R$ ${total.toFixed(2)}`;
        
    } catch (error) {
        console.error('Erro ao carregar resumo:', error);
        resumoPedido.innerHTML = '<p class="text-danger">Erro ao carregar informações do pedido</p>';
    }
}

function finalizarPedido() {
    const form = document.getElementById('form-entrega');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Simular processamento do pedido
    const email = document.getElementById('email').value;
    document.getElementById('email-confirmacao').textContent = email;
    
    // Limpar carrinho
    localStorage.removeItem('carrinho');
    
    // Mostrar modal de confirmação
    const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    modal.show();
    
    // Atualizar contador
    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }
}

function atualizarContadorCarrinho() {
    const carrinho = window.carrinho.getCarrinho();
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('carrinho-contador').textContent = totalItens;
}   