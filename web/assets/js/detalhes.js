document.addEventListener('DOMContentLoaded', function() {
    carregarProduto();
    atualizarContadorCarrinho();
    
    document.getElementById('adicionar-carrinho').addEventListener('click', function() {
        const produtoId = parseInt(this.dataset.id);
        const quantidade = parseInt(document.getElementById('produto-quantidade').value);
        
        if (quantidade < 1) {
            alert('Quantidade inválida!');
            return;
        }
        
        carrinho.adicionarAoCarrinho(produtoId, quantidade);
        
        // Mostrar feedback
        const feedback = document.getElementById('adicionado-sucesso');
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    });
});

async function carregarProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = parseInt(urlParams.get('id'));
    
    if (!produtoId) {
        alert('Produto não encontrado!');
        window.location.href = 'home.html';
        return;
    }

    try {
        const response = await fetch('assets/dados.json');
        const data = await response.json();
        const produto = data.produtos.find(p => p.id === produtoId);
        
        if (!produto) {
            throw new Error('Produto não encontrado');
        }
        
        document.getElementById('produto-nome').textContent = produto.nome;
        document.getElementById('produto-categoria').textContent = produto.categoria;
        document.getElementById('produto-preco').textContent = `R$ ${produto.preco.toFixed(2)}`;
        document.getElementById('produto-descricao').textContent = produto.descricao;
        document.getElementById('produto-imagem').src = produto.imagem;
        document.getElementById('adicionar-carrinho').dataset.id = produto.id;
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar informações do produto');
        window.location.href = 'home.html';
    }
}

function atualizarContadorCarrinho() {
    const carrinho = carrinho.getCarrinho();
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('carrinho-contador').textContent = totalItens;
}