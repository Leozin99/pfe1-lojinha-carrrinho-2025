// Gerenciamento do Carrinho
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('carrinhoModal')) {
        document.getElementById('carrinhoModal').addEventListener('show.bs.modal', exibirCarrinhoModal);
    }
});

function getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }
}

function adicionarAoCarrinho(produtoId, quantidade = 1) {
    const carrinho = getCarrinho();
    const produtoExistente = carrinho.find(item => item.id === produtoId);

    if (produtoExistente) {
        produtoExistente.quantidade += quantidade;
    } else {
        carrinho.push({ id: produtoId, quantidade });
    }

    salvarCarrinho(carrinho);
    return carrinho;
}

function removerDoCarrinho(produtoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho(carrinho);
    return carrinho;
}

function atualizarQuantidadeNoCarrinho(produtoId, novaQuantidade) {
    const carrinho = getCarrinho();
    const produto = carrinho.find(item => item.id === produtoId);

    if (produto) {
        produto.quantidade = novaQuantidade;
        salvarCarrinho(carrinho);
    }
    return carrinho;
}

async function exibirCarrinhoModal() {
    const carrinho = getCarrinho();
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoLista = document.getElementById('carrinho-lista');
    const carrinhoTotal = document.getElementById('carrinho-total');

    if (carrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
        carrinhoItens.style.display = 'none';
        return;
    }

    carrinhoVazio.style.display = 'none';
    carrinhoItens.style.display = 'block';

    try {
        const response = await fetch('assets/dados.json');
        const data = await response.json();
        const produtos = data.produtos;

        carrinhoLista.innerHTML = '';
        let total = 0;

        carrinho.forEach(item => {
            const produto = produtos.find(p => p.id === item.id);
            if (produto) {
                const subtotal = produto.preco * item.quantidade;
                total += subtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${produto.imagem}" class="img-thumbnail me-3" width="60" alt="${produto.nome}">
                            <div>
                                <h6 class="mb-0">${produto.nome}</h6>
                                <small class="text-muted">${produto.categoria}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <input type="number" class="form-control form-control-sm quantidade-input" 
                               value="${item.quantidade}" min="1" data-id="${produto.id}">
                    </td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger remover-btn" data-id="${produto.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                carrinhoLista.appendChild(row);
            }
        });

        carrinhoTotal.textContent = total.toFixed(2);

        // Event listeners
        document.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('change', function() {
                const produtoId = parseInt(this.dataset.id);
                const novaQuantidade = parseInt(this.value);
                if (novaQuantidade > 0) {
                    atualizarQuantidadeNoCarrinho(produtoId, novaQuantidade);
                } else {
                    removerDoCarrinho(produtoId);
                    exibirCarrinhoModal();
                }
            });
        });

        document.querySelectorAll('.remover-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                removerDoCarrinho(parseInt(this.dataset.id));
                exibirCarrinhoModal();
            });
        });

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Exportar funções para uso em outras páginas
window.carrinho = {
    getCarrinho,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidadeNoCarrinho,
    exibirCarrinhoModal
};