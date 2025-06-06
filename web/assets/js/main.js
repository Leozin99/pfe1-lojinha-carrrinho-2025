// Carrega os produtos do arquivo JSON
document.addEventListener('DOMContentLoaded', function () {
    carregarProdutos();
    atualizarContadorCarrinho();

    // Evento para abrir o modal do carrinho
    document.getElementById('carrinho-btn').addEventListener('click', function () {
        const carrinhoModal = new bootstrap.Modal(document.getElementById('carrinhoModal'));
        carrinhoModal.show();
        atualizarCarrinhoModal();
    });
});

function carregarProdutos() {
    axios.get('assets/dados.json')
        .then(response => {
            const produtos = response.data.produtos;
            const container = document.getElementById('produtos-container');

            produtos.forEach(produto => {
                const card = criarCardProduto(produto);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
}

function criarCardProduto(produto) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
        <div class="card h-100">
            <img src="assets/images/${produto.imagem}" class="card-img-top" alt="${produto.nome}">
            <div class="card-body">
                <h5 class="card-title">${produto.nome}</h5>
                <p class="card-text">${produto.descricao}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="price">R$ ${produto.preco.toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm add-to-cart" data-id="${produto.id}">Adicionar</button>
                </div>
            </div>
        </div>
    `;

    col.querySelector('.add-to-cart').addEventListener('click', () => adicionarAoCarrinho(produto.id));

    return col;
}

function adicionarAoCarrinho(produtoId) {
    axios.get('assets/dados.json')
        .then(response => {
            const produtos = response.data.produtos;
            const produto = produtos.find(p => p.id === produtoId);

            if (!produto) return;

            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            const itemExistente = carrinho.find(item => item.id === produto.id);

            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinho.push({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: 1
                });
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarContadorCarrinho();

            // Mostra feedback visual
            const btn = document.querySelector(`.add-to-cart[data-id="${produtoId}"]`);
            btn.textContent = '✔ Adicionado';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');

            setTimeout(() => {
                btn.textContent = 'Adicionar';
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
            }, 1500);
        })
        .catch(error => {
            console.error('Erro ao adicionar ao carrinho:', error);
        });
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('carrinho-contador').textContent = totalItens;
}

function atualizarCarrinhoModal() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const container = document.getElementById('carrinho-itens');
    const totalElement = document.getElementById('carrinho-total');

    container.innerHTML = '';

    if (carrinho.length === 0) {
        container.innerHTML = '<p class="text-center">Seu carrinho está vazio</p>';
        totalElement.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'carrinho-item d-flex justify-content-between align-items-center';
        itemElement.innerHTML = `
            <div>
                <h6>${item.nome}</h6>
                <small>${item.quantidade} x R$ ${item.preco.toFixed(2)}</small>
            </div>
            <div>
                <span class="fw-bold">R$ ${itemTotal.toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">×</button>
            </div>
        `;

        container.appendChild(itemElement);
    });

    totalElement.textContent = `R$ ${total.toFixed(2)}`;

    // Adiciona eventos para remover itens
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            removerDoCarrinho(id);
        });
    });
}

function removerDoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinhoModal();
    atualizarContadorCarrinho();
}
