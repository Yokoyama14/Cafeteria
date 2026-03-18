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

        // se clicar no mesmo, fecha tudo
        if (menuAtivo === categoria) {
            cafeContainer.style.display = 'none';
            sanduicheContainer.style.display = 'none';
            sobremesaContainer.style.display = 'none';
            menuAtivo = null;
            return;
        }

        // fecha tudo antes de abrir
        cafeContainer.style.display = 'none';
        sanduicheContainer.style.display = 'none';
        sobremesaContainer.style.display = 'none';

        if (categoria === 'cafe') {
            cafeContainer.style.display = 'grid';
        }

        if (categoria === 'sanduiches') {
            sanduicheContainer.style.display = 'grid';
        }

        if (categoria === 'sobremesa') {
            sobremesaContainer.style.display = 'grid';
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
    
    // AQUI ESTÃO OS ELEMENTOS QUE VAMOS ATUALIZAR
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    const closeCartBtn = document.getElementById('close-cart-btn');
    // Tenta pegar o ícone pelo ID ou pela classe (garantia de funcionamento)
    const cartIcon = document.getElementById('cart-icon') || document.querySelector('.icons img[alt="shopping-cart"]');
    const finalizeBtn = document.getElementById('finalize-btn');

    // --- 1. ABRIR E FECHAR ---
    if(cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }

    if(closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
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
        alert("Produto adicionado ao carrinho!");
    }

    // --- 3. ATUALIZAR TELA E PREÇOS (O Importante!) ---
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        // Gera a lista visual e calcula o total
        cart.forEach((item, index) => {
            total += item.price * item.quantity;

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
                            <button onclick="changeQty(${index}, -1)"><i class="bx bx-minus"></i></button>                        
                            <span>${item.quantity}</span>
                            <button onclick="changeQty(${index}, 1)"><i class="bx bx-plus"></i></button> 
                            <button class="x" onclick="removeItem(${index})"><i class="bx bx-x"></i></button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(li);
        });

        // --- ATUALIZA SUB-TOTAL E TOTAL ---
        const totalFormatado = 'R$ ' + total.toFixed(2).replace('.', ',');
        
        // Escreve o valor no HTML
        if(subtotalElement) subtotalElement.innerText = totalFormatado;
        if(totalElement) totalElement.innerText = totalFormatado;
    }

    // --- 4. FUNÇÕES DE CONTROLE ---
    
    // Mudar quantidade (remove se for zero)
    window.changeQty = function(index, change) {
        if (cart[index].quantity === 1 && change === -1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity += change;
        }
        updateCart();
    }

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