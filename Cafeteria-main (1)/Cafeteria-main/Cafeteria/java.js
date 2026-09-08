document.addEventListener('DOMContentLoaded', () => {

    const cafeContainer = document.querySelector('.box-container');

    const sanduicheContainer = document.querySelector('.box-containersan');

    const sobremesaContainer = document.querySelector('.box-containersob');



    // FORÇA todos os menus fechados ao carregar

    cafeContainer.style.display = 'none';

    sanduicheContainer.style.display = 'none';

    sobremesaContainer.style.display = 'none';



    let menuAtivo = null;



    window.toggleMenu = function (categoria) {



    const btnCafe = document.querySelector('.btncafe');
    const btnSanduiche = document.querySelector('.btnsanduiche');
    const btnSobremesa = document.querySelector('.btnsobremesa');

    // Função interna para limpar o destaque de todos os botões
    function limparBotoesAtivos() {
        if (btnCafe) btnCafe.classList.remove('active');
        if (btnSanduiche) btnSanduiche.classList.remove('active');
        if (btnSobremesa) btnSobremesa.classList.remove('active');
    }

    // Se clicar na mesma categoria que já está aberta, fecha tudo e limpa a cor
    if (menuAtivo === categoria) {
        if (cafeContainer) cafeContainer.style.display = 'none';
        if (sanduicheContainer) sanduicheContainer.style.display = 'none';
        if (sobremesaContainer) sobremesaContainer.style.display = 'none';
        limparBotoesAtivos();
        menuAtivo = null;
        return;
    }

    // Esconde todos os containers e limpa os destaques dos botões
    if (cafeContainer) cafeContainer.style.display = 'none';
    if (sanduicheContainer) sanduicheContainer.style.display = 'none';
    if (sobremesaContainer) sobremesaContainer.style.display = 'none';
    limparBotoesAtivos();

    // Abre a categoria escolhida e adiciona a classe .active no botão correspondente
    if (categoria === 'cafe' && cafeContainer) {
        cafeContainer.style.display = 'grid';
        if (btnCafe) btnCafe.classList.add('active');
    }

    if (categoria === 'sanduiches' && sanduicheContainer) {
        sanduicheContainer.style.display = 'grid';
        if (btnSanduiche) btnSanduiche.classList.add('active');
    }

    if (categoria === 'sobremesa' && sobremesaContainer) {
        sobremesaContainer.style.display = 'grid';
        if (btnSobremesa) btnSobremesa.classList.add('active');
    }

    menuAtivo = categoria;
};

});







const reviews = document.querySelectorAll(".boxestrela");

const nextBtn = document.getElementById("nextReview");

const prevBtn = document.getElementById("prevReview");



let reviewAtual = 0;



function mostrarReview(index) {

    reviews.forEach((review, i) => {

        review.style.display = i === index ? "block" : "none";

    });

}



nextBtn.addEventListener("click", () => {

    reviewAtual = (reviewAtual + 1) % reviews.length;

    mostrarReview(reviewAtual);

});



prevBtn.addEventListener("click", () => {

    reviewAtual = (reviewAtual - 1 + reviews.length) % reviews.length;

    mostrarReview(reviewAtual);

});



// inicializa

mostrarReview(reviewAtual);













// --- VARIÁVEIS GLOBAIS ---
let cart = []; 

// Elementos do HTML
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('cart-subtotal');
const totalElement = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartIcon = document.getElementById('cart-icon') || document.querySelector('.icons img[alt="shopping-cart"]');
const finalizeBtn = document.getElementById('finalize-btn');
const cartBadge = document.getElementById('quantidadeCarrinho');

// --- 1. ABRIR E FECHAR GAVETA ---
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        if (cartSidebar) cartSidebar.classList.add('active');
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        if (cartSidebar) cartSidebar.classList.remove('active');
    });
}

// --- 2. ADICIONAR AO CARRINHO ---
const addButtons = document.querySelectorAll('.box .btn, .boxsan .btn, .boxsob .btn');

addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
         // Procura o elemento pai (caixa do produto)
            const productBox = e.target.closest('.box, .boxsan, .boxsob');
        
        if (productBox) {
           const title = productBox.querySelector('h3').innerText;
                const priceText = productBox.querySelector('.price').innerText;
                const imgSrc = productBox.querySelector('img').src;
                
                // Limpa o preço (tira R$, espaços e troca vírgula por ponto)
                const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());

                addItemToCart(title, price, imgSrc);
        }
    });
});

function addItemToCart(title, price, image) {
    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ title, price, image, quantity: 1 });
    }

    updateCart(); // Atualiza tela e preços
}

// --- 3. ATUALIZAR TELA E PREÇOS (O Importante!) ---
function updateCart() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItensContagem = 0; // <-- 1. Adicione esta variável

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="msg-vazio-container">
                <p id="empty-card-message">SEU CARRINHO ESTÁ VAZIO!</p>
            </div>
        `;
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalItensContagem += item.quantity;

            const li = document.createElement('li');
            li.classList.add('carrinho-item');
            
            li.innerHTML = `
                <div class="imagem">
                    <img class="ftcafe" src="${item.image}" alt="${item.title}">
                </div>
                <div class="carrinhoinfo">
                    <h3>${item.title}</h3>
                     <div class="preço">
                        <div class="price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                        <div class="contador">
                            <button type="button" onclick="changeQty(${index}, -1)"><i class="bx bx-minus"></i></button>                      
                           <input type="number"
                            id="qtd-input-${index}""
                            
                            class="qtd-input"
                            value="${item.quantity}"
                            min="1"
                            onchange="setQty(${index}, this.value)">

                           <button type="button" onclick="changeQty(${index}, 1)"><i class="bx bx-plus"></i></button>
                            <button type="button" class="x" onclick="removeItem(${index})"><i class="bx bx-x"></i></button>

                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(li);
        });
    }

    // --- ATUALIZA SUB-TOTAL E TOTAL ---
        const totalFormatado = 'R$ ' + total.toFixed(2).replace('.', ',');
        
        // Escreve o valor no HTML
        if(subtotalElement) subtotalElement.innerText = totalFormatado;
        if(totalElement) totalElement.innerText = totalFormatado;
    if (cartBadge) {
        cartBadge.innerText = totalItensContagem;
    }
}

    

 // --- 4. FUNÇÕES DE CONTROLE ---
    
    // Mudar quantidade (remove se for zero)
window.changeQty = function(index, delta) {
    if (cart[index]) {
        const input = document.getElementById(`qtd-input-${index}`);
        let valorAtual = input ? parseInt(input.value) : cart[index].quantity;

        if (isNaN(valorAtual)) valorAtual = cart[index].quantity;

        const novaQtd = valorAtual + delta;

        if (novaQtd <= 0) {
            cart.splice(index, 1); // Remove o item se chegar a 0
        } else {
            cart[index].quantity = novaQtd;
        }
        
        updateCart();
    }
};

// Atualiza a quantidade digitada diretamente no input
window.setQty = function (index, value) {
    const novaQtd = parseInt(value);

    if (cart[index]) {
        if (isNaN(novaQtd) || novaQtd <= 0) {
            cart[index].quantity = 1;
        } else {
            cart[index].quantity = novaQtd;
        }
        updateCart();
    }
};

window.removeItem = function(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        updateCart();
    }
}

// Inicializa o carrinho vazio
updateCart();

    // Remover direto no X
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCart();
    }

    // --- 5. FINALIZAR ---

    if(finalizeBtn) {

        finalizeBtn.addEventListener('click', () => {

            if (cart.length === 0) {

                alert("Seu carrinho está vazio!");

            } else {

                // Pega o valor total atual para mostrar na mensagem

                const totalFinal = document.getElementById('cart-total').innerText;

                alert(`Pedido finalizado!\nTotal a pagar: ${totalFinal}\nObrigado pela preferência!`);

               

                cart = []; // Limpa carrinho

                updateCart(); // Zera valores visualmente

                cartSidebar.classList.remove('active'); // Fecha aba

            }

        });

    } 

