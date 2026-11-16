// ==========================================
// 1. CONTROLO DOS FILTROS DO MENU (ESCOPO GLOBAL)
// ==========================================
let menuAtivo = null;

window.toggleMenu = function (categoria) {
  const cafeContainer = document.querySelector('.box-container');
  const sanduicheContainer = document.querySelector('.box-containersan');
  const sobremesaContainer = document.querySelector(
    '.box-containersob, .box-containersobremesa, .box-container-sobremesa, #sobremesas, #sobremesa',
  );

  const btnCafe = document.querySelector('.btncafe');
  const btnSanduiche = document.querySelector('.btnsanduiche');
  const btnSobremesa = document.querySelector('.btnsobremesa');

  function limparBotoesAtivos() {
    if (btnCafe) btnCafe.classList.remove('active');
    if (btnSanduiche) btnSanduiche.classList.remove('active');
    if (btnSobremesa) btnSobremesa.classList.remove('active');
  }

  if (menuAtivo === categoria) {
    if (cafeContainer) cafeContainer.style.display = 'none';
    if (sanduicheContainer) sanduicheContainer.style.display = 'none';
    if (sobremesaContainer) sobremesaContainer.style.display = 'none';
    limparBotoesAtivos();
    menuAtivo = null;
    return;
  }
  if (cafeContainer) cafeContainer.style.display = 'none';
  if (sanduicheContainer) sanduicheContainer.style.display = 'none';
  if (sobremesaContainer) sobremesaContainer.style.display = 'none';
  limparBotoesAtivos();

  if ((categoria === 'cafe' || categoria === 'cafes') && cafeContainer) {
    cafeContainer.style.display = 'grid';
    if (btnCafe) btnCafe.classList.add('active');
  }

  if (
    (categoria === 'sanduiches' || categoria === 'sanduiche') &&
    sanduicheContainer
  ) {
    sanduicheContainer.style.display = 'grid';
    if (btnSanduiche) btnSanduiche.classList.add('active');
  }

  if (
    (categoria === 'sobremesa' || categoria === 'sobremesas') &&
    sobremesaContainer
  ) {
    sobremesaContainer.style.display = 'grid';
    if (btnSobremesa) btnSobremesa.classList.add('active');
  }
  menuAtivo = categoria;
};

// ==========================================
// 2. FUNÇÕES DO CARRINHO E SUB-MODAIS
// ==========================================
window.abrirCarrinho = function () {
  const sidebar =
    document.getElementById('cart-sidebar') ||
    document.querySelector('.carrinhos');
  if (sidebar) {
    sidebar.classList.add('active');
  }
};

window.fecharCarrinho = function () {
  const sidebar =
    document.getElementById('cart-sidebar') ||
    document.querySelector('.carrinhos');
  if (sidebar) {
    sidebar.classList.remove('active');
  }
};

window.abrirSubModal = function (btn) {
  const modalPai = btn.closest('.janela-modal');
  const submodal = modalPai
    ? modalPai.querySelector('.submodal-variedades')
    : null;
  if (submodal) {
    submodal.removeAttribute('hidden');
    atualizarCalculadoraSubModal(submodal, modalPai);
  }
};

window.fecharSubModal = function (btn) {
  const submodal = btn.closest('.submodal-variedades');
  if (submodal) {
    submodal.setAttribute('hidden', 'true');
  }
};

function atualizarCalculadoraSubModal(submodal, modalPai) {
  if (!submodal || !modalPai) return;

  let calcBox = submodal.querySelector('.calculadora-submodal');
  if (!calcBox) {
    calcBox = document.createElement('div');
    calcBox.className = 'calculadora-submodal';

    const btnConfirmar =
      submodal.querySelector('button[onclick*="confirmarSubModal"]') ||
      submodal.querySelector('.btn-confirmar, button');
    if (btnConfirmar) {
      btnConfirmar.parentNode.insertBefore(calcBox, btnConfirmar);
    } else {
      submodal.appendChild(calcBox);
    }
  }
  const boxPai = modalPai.closest('.box, .boxsan, .boxsob');
  let precoBruto = boxPai ? boxPai.getAttribute('data-preco') : '30,00';
  if (!precoBruto && boxPai) {
    const priceEl = boxPai.querySelector('.price');
    precoBruto = priceEl ? priceEl.textContent : '30,00';
  }
  const precoBase =
    parseFloat(precoBruto.replace('R$', '').replace(',', '.').trim()) || 30.0;

  let somaAdicionais = 0;

  const checkboxesMarcados = submodal.querySelectorAll(
    'input[type="checkbox"]:checked',
  );
  checkboxesMarcados.forEach((chk) => {
    somaAdicionais += parseFloat(chk.getAttribute('data-preco')) || 0;
  });

  const radioMarcado = submodal.querySelector('input[type="radio"]:checked');
  if (radioMarcado) {
    somaAdicionais += parseFloat(radioMarcado.getAttribute('data-preco')) || 0;
  }

  const totalParcial = precoBase + somaAdicionais;
  calcBox.innerHTML = `
        <div class="calc-linha"><span>Preço Base:</span> <span class="calc-valor-base">R$ ${precoBase.toFixed(2).replace('.', ',')}</span></div>
        <div class="calc-linha"><span>Adicionais:</span> <span class="calc-valor-adicional">+ R$ ${somaAdicionais.toFixed(2).replace('.', ',')}</span></div>
        <div class="calc-linha calc-total"><span>Total Parcial:</span> <span class="calc-valor-total">R$ ${totalParcial.toFixed(2).replace('.', ',')}</span></div>
    `;
}

window.confirmarSubModal = function (btn) {
  const submodal = btn.closest('.submodal-variedades');
  const modalPai = btn.closest('.janela-modal');

  if (submodal && modalPai) {
    const paoSelecionado = submodal.querySelector(
      'input[name="grupo_pao"]:checked',
    );
    if (!paoSelecionado) {
      alert('Por favor, selecione um tipo de pão antes de continuar!');
      return;
    }

    const gruposObrigatorios = [
      'grupo_proteina',
      'grupo_queijo',
      'grupo_vegetal',
    ];
    for (let grupo of gruposObrigatorios) {
      const selecionadosNoGrupo = submodal.querySelectorAll(
        `input[name="${grupo}"]:checked`,
      );
      if (selecionadosNoGrupo.length === 0) {
        alert(
          'Por favor, selecione pelo menos uma opção em cada tópico obrigatório antes de continuar!',
        );
        return;
      }
    }
    submodal.setAttribute('hidden', 'true');

    if (typeof window.atualizarPrecoModal === 'function') {
      window.atualizarPrecoModal(modalPai);
    }
  }
};

// ==========================================
// 3. FUNÇÕES GLOBAIS PARA OS MODAIS INDIVIDUAIS
// ==========================================
window.abrirModal = function (botao) {
  const boxPai = botao.closest('.box, .boxsan, .boxsob');
  const modal = boxPai ? boxPai.querySelector('.janela-modal') : null;
  if (!modal) return;

  modal.removeAttribute('hidden');

  const textoModalEl = modal.querySelector('.texto-modal');

  let precoBruto = boxPai.getAttribute('data-preco');
  if (!precoBruto) {
    const priceEl = boxPai.querySelector('.price');
    precoBruto = priceEl ? priceEl.textContent : '30,00';
  }
  const precoBase =
    parseFloat(precoBruto.replace('R$', '').replace(',', '.').trim()) || 30.0;

  const tituloBase =
    boxPai.getAttribute('data-titulo') ||
    boxPai.querySelector('h3')?.textContent ||
    'Produto';
  const imagemSrc =
    boxPai.getAttribute('data-imagem') ||
    boxPai.querySelector('img')?.src ||
    '';

  const checkboxesModal = modal.querySelectorAll('input[type="checkbox"]');
  checkboxesModal.forEach((c) => (c.checked = false));

  const radiosModal = modal.querySelectorAll('input[type="radio"]');
  radiosModal.forEach((r) => (r.checked = false));

  const submodal = modal.querySelector('.submodal-variedades');
  if (submodal) {
    submodal.setAttribute('hidden', 'true');
    atualizarCalculadoraSubModal(submodal, modal);

    checkboxesModal.forEach((chk) => {
      chk.removeEventListener('change', chk._calcListener);
      chk._calcListener = () => atualizarCalculadoraSubModal(submodal, modal);
      chk.addEventListener('change', chk._calcListener);
    });
    radiosModal.forEach((rad) => {
      rad.removeEventListener('change', rad._calcListener);
      rad._calcListener = () => atualizarCalculadoraSubModal(submodal, modal);
      rad.addEventListener('change', rad._calcListener);
    });
  }

  if (textoModalEl && !textoModalEl.querySelector('.container-acao-modal')) {
    const containerAcao = document.createElement('div');
    containerAcao.className = 'container-acao-modal';
    containerAcao.innerHTML = `
            <div class="modal-detalhes-preco-qtd">
                <div class="preco-modal-dinamico">R$ ${precoBase.toFixed(2).replace('.', ',')}</div>
                <div class="contador">
                    <button type="button" class="modal-btn-sub">-</button>
                    <input type="number" name="quantidade_modal" class="modal-input-qtd" value="1" min="1" readonly>
                    <button type="button" class="modal-btn-add">+</button>
                </div>
            </div>
            <button type="button" class="btn-modal-add-cart">Adicionar Ao Carrinho</button>
        `;
    textoModalEl.appendChild(containerAcao);

    const btnSub = containerAcao.querySelector('.modal-btn-sub');
    const btnAdd = containerAcao.querySelector('.modal-btn-add');
    const inputQtd = containerAcao.querySelector('.modal-input-qtd');
    const precoEl = containerAcao.querySelector('.preco-modal-dinamico');
    const btnAddCart = containerAcao.querySelector('.btn-modal-add-cart');

    window.atualizarPrecoModal = function (currentModal) {
      const qtd = parseInt(inputQtd.value) || 1;
      let subtotalAdicionais = 0;

      const checkboxesMarcados = currentModal.querySelectorAll(
        '.submodal-variedades input[type="checkbox"]:checked',
      );
      checkboxesMarcados.forEach((chk) => {
        subtotalAdicionais += parseFloat(chk.getAttribute('data-preco')) || 0;
      });

      const radioMarcado = currentModal.querySelector(
        '.submodal-variedades input[type="radio"]:checked',
      );
      if (radioMarcado) {
        subtotalAdicionais +=
          parseFloat(radioMarcado.getAttribute('data-preco')) || 0;
      }

      const precoUnitarioFinal = precoBase + subtotalAdicionais;
      const totalCalculado = precoUnitarioFinal * qtd;
      precoEl.textContent = `R$ ${totalCalculado.toFixed(2).replace('.', ',')}`;
    };

    checkboxesModal.forEach((chk) => {
      chk.addEventListener('change', () => window.atualizarPrecoModal(modal));
    });

    radiosModal.forEach((rad) => {
      rad.addEventListener('change', () => window.atualizarPrecoModal(modal));
    });

    btnSub.addEventListener('click', () => {
      let val = parseInt(inputQtd.value) || 1;
      if (val > 1) {
        inputQtd.value = val - 1;
        window.atualizarPrecoModal(modal);
      }
    });

    btnAdd.addEventListener('click', () => {
      let val = parseInt(inputQtd.value) || 1;
      inputQtd.value = val + 1;
      window.atualizarPrecoModal(modal);
    });

    btnAddCart.addEventListener('click', (e) => {
      e.preventDefault();
      const quantidade = parseInt(inputQtd.value) || 1;
      if (quantidade <= 0) {
        alert(
          'Por favor, selecione pelo menos 1 unidade para adicionar ao carrinho.',
        );
        return;
      }

      let valorAdicionais = 0;

      if (submodal) {
        const paoSelecionado = submodal.querySelector(
          'input[name="grupo_pao"]:checked',
        );
        const gruposObrigatorios = [
          'grupo_proteina',
          'grupo_queijo',
          'grupo_vegetal',
        ];
        let faltaPreencher = false;

        if (!paoSelecionado) {
          faltaPreencher = true;
        } else {
          for (let grupo of gruposObrigatorios) {
            const selecionadosNoGrupo = submodal.querySelectorAll(
              `input[name="${grupo}"]:checked`,
            );
            if (selecionadosNoGrupo.length === 0) {
              faltaPreencher = true;
              break;
            }
          }
        }

        if (faltaPreencher) {
          submodal.removeAttribute('hidden');
          return;
        }

        valorAdicionais +=
          parseFloat(paoSelecionado.getAttribute('data-preco')) || 0;

        for (let grupo of gruposObrigatorios) {
          const selecionadosNoGrupo = submodal.querySelectorAll(
            `input[name="${grupo}"]:checked`,
          );
          selecionadosNoGrupo.forEach((chk) => {
            valorAdicionais += parseFloat(chk.getAttribute('data-preco')) || 0;
          });
        }
      }

      const precoUnitarioFinal = precoBase + valorAdicionais;

      if (typeof window.addItemToCart === 'function') {
        window.addItemToCart(
          tituloBase,
          precoUnitarioFinal,
          imagemSrc,
          quantidade,
        );
      }
      inputQtd.value = 1;
      window.atualizarPrecoModal(modal);
      checkboxesModal.forEach((c) => (c.checked = false));
      radiosModal.forEach((r) => (r.checked = false));
      if (submodal) submodal.setAttribute('hidden', 'true');
      modal.setAttribute('hidden', 'true');
    });
  } else {
    const inputQtd = modal.querySelector('.modal-input-qtd');
    const precoEl = modal.querySelector('.preco-modal-dinamico');
    if (inputQtd) {
      inputQtd.value = 1;
      if (precoEl) {
        precoEl.textContent = `R$ ${precoBase.toFixed(2).replace('.', ',')}`;
      }
    }
  }
};

window.fecharModal = function (botao) {
  const modal = botao.closest('.janela-modal');
  if (modal) {
    modal.setAttribute('hidden', 'true');
  }
};

// ==========================================
// 4. INICIALIZAÇÃO DO DOM (CARRINHO, CARROSSEL E REGRAS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const cafeContainer = document.querySelector('.box-container');
  const sanduicheContainer = document.querySelector('.box-containersan');
  const sobremesaContainer = document.querySelector(
    '.box-containersob, .box-containersobremesa, .box-container-sobremesa, #sobremesas, #sobremesa',
  );
  if (cafeContainer) cafeContainer.style.display = 'none';
  if (sanduicheContainer) sanduicheContainer.style.display = 'none';
  if (sobremesaContainer) sobremesaContainer.style.display = 'none';

  const temperaturasSelecionadas = {};

  // Deteta cliques nos botões de temperatura (Quente / Gelado) apenas para cafés
  document.addEventListener('click', (e) => {
    const tempBtn = e.target.closest('button, .temp-btn, span, label, a');
    if (!tempBtn) return;

    const texto = (tempBtn.textContent || tempBtn.value || '')
      .trim()
      .toLowerCase();
    if (texto.includes('quente') || texto.includes('gelado')) {
      const productBox = tempBtn.closest('.box, .product-card');
      if (productBox) {
        // Garante que não é sanduíche ou sobremesa
        if (
          !productBox.classList.contains('boxsan') &&
          !productBox.classList.contains('boxsob')
        ) {
          const tituloProd =
            productBox.getAttribute('data-titulo') ||
            productBox.getAttribute('data-name') ||
            productBox.querySelector('h3, .product-title')?.innerText?.trim() ||
            'produto';
          if (texto.includes('gelado')) {
            temperaturasSelecionadas[tituloProd] = 'Gelado';
          } else if (texto.includes('quente')) {
            temperaturasSelecionadas[tituloProd] = 'Quente';
          }
        }
      }
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target;
    if (
      target.type === 'checkbox' &&
      target.closest('.opcao-temperatura-container')
    ) {
      const container = target.closest('.opcao-temperatura-container');
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      if (target.checked) {
        checkboxes.forEach((cb) => {
          if (cb !== target) cb.checked = false;
        });
      }
    }
  });

  // Regra de exclusividade para a opção "Sem"
  document.addEventListener('change', (e) => {
    const target = e.target;
    if (
      target.type === 'checkbox' &&
      !target.closest('.opcao-temperatura-container')
    ) {
      const labelText =
        target.closest('label')?.textContent?.trim().toLowerCase() || '';
      const grupoContainer = target.closest(
        '.submodal-variedades, .box-containersan, .janela-modal',
      );

      if (!grupoContainer) return;

      if (labelText.includes('sem')) {
        if (target.checked) {
          const nameGrupo = target.getAttribute('name');
          const checkboxesDoGrupo = grupoContainer.querySelectorAll(
            `input[name="${nameGrupo}"]`,
          );
          checkboxesDoGrupo.forEach((cb) => {
            if (cb !== target) cb.checked = false;
          });
        }
      } else {
        const nameGrupo = target.getAttribute('name');
        if (nameGrupo) {
          const checkboxesDoGrupo = grupoContainer.querySelectorAll(
            `input[name="${nameGrupo}"]`,
          );
          checkboxesDoGrupo.forEach((cb) => {
            const cbText =
              cb.closest('label')?.textContent?.trim().toLowerCase() || '';
            if (cbText.includes('sem') && target.checked) {
              cb.checked = false;
            }
          });
        }
      }
    }
  });

  // Carrossel de avaliações
  const boxesEstrela = document.querySelectorAll('.boxestrela');
  let indiceAtual = 0;

  function mostrarSlide(indice) {
    if (boxesEstrela.length === 0) return;

    boxesEstrela.forEach((box, i) => {
      if (i === indice) {
        box.style.display = 'block';
        box.style.visibility = 'visible';
        box.style.margin = '0 auto';
      } else {
        box.style.display = 'none';
      }
    });
  }

  if (boxesEstrela.length > 0) {
    mostrarSlide(indiceAtual);

    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        indiceAtual =
          (indiceAtual - 1 + boxesEstrela.length) % boxesEstrela.length;
        mostrarSlide(indiceAtual);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        indiceAtual =
          (indiceAtual + 1 + boxesEstrela.length) % boxesEstrela.length;
        mostrarSlide(indiceAtual);
      });
    }
  }

  // Gestão do Carrinho e LocalStorage
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('anchor_coffee_cart')) || [];
  } catch (e) {
    cart = [];
    localStorage.removeItem('anchor_coffee_cart');
  }

  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItemsContainer = document.getElementById('cart-items');
  const subtotalElement = document.getElementById('cart-subtotal');
  const totalElement = document.getElementById('cart-total');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartIcon =
    document.getElementById('cart-icon') ||
    document.querySelector('.icons img[alt="shopping-cart"]') ||
    document.querySelector('.car-container');
  const finalizeBtn = document.getElementById('finalize-btn');
  const cartBadge = document.getElementById('quantidadeCarrinho');

  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      window.abrirCarrinho();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      window.fecharCarrinho();
    });
  }

  // ADICIONAR AO CARRINHO: Aplica temperatura apenas para cafés. Sanduíches ficam limpos.
  window.addItemToCart = function (
    title,
    price,
    image,
    quantity = 1,
    temperatura = '',
  ) {
    const qtdNum = Number(quantity);
    if (
      !Number.isSafeInteger(qtdNum) ||
      qtdNum < 1 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return false;
    }

    // Procura se o elemento ativo pertence a um sanduíche
    const activeBox = document.activeElement
      ? document.activeElement.closest('.boxsan')
      : null;
    const isSanduiche = activeBox !== null;

    let chaveUnica = title;
    let tituloExibicao = title;

    if (!isSanduiche) {
      const tempEscolhida =
        temperatura || temperaturasSelecionadas[title] || 'QUENTE';
      const tempFormatada = tempEscolhida.toUpperCase();
      chaveUnica = `${title} (${tempFormatada})`;
      tituloExibicao = `${title} (${tempFormatada})`;
    }

    const existingItem = cart.find((item) => item.uniqueKey === chaveUnica);

    if (existingItem) {
      existingItem.quantity += qtdNum;
    } else {
      cart.push({
        uniqueKey: chaveUnica,
        title: tituloExibicao,
        price,
        image,
        quantity: qtdNum,
      });
    }
    updateCart();
    return true;
  };

  function updateCart() {
    try {
      localStorage.setItem('anchor_coffee_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Erro ao guardar no localStorage', e);
    }

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    let total = 0;
    let totalItensContagem = 0;

    if (cart.length === 0) {
      // Injeta a mensagem de vazio e fecha o carrinho ao clicar em "Escolher Produtos"
      cartItemsContainer.innerHTML = `
        <div class="msg-vazio-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; text-align: center; gap: 1.5rem; margin: auto; padding: 2rem 0;">
            <p id="empty-card-mensagem" class="text-vazio" style="font-size: 2rem; color: var(--main-color, #d3ad7f); text-align: center; margin: 0;">Seu carrinho está vazio</p>
            <a href="#menu" class="btn-vazio" onclick="window.fecharCarrinho()" style="background-color: var(--main-color, #d3ad7f); color: #fff; padding: 1rem 3rem; font-size: 1.8rem; border-radius: 4px; text-decoration: none; display: inline-block;">
                <span class="btnspan-vazio">Escolher Produtos</span>
            </a>
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
                        <input type="number" name="qtd_carrinho_${index}" class="qtd-input" value="${item.quantity}" min="1" onchange="setQty(${index}, this.value)">
                        <button type="button" onclick="changeQty(${index}, 1)"><i class="bx bx-plus"></i></button>
                        <button type="button" class="x" onclick="removeItem(${index})"><i class="bx bx-x"></i></button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(li);
      });
    }
    const totalFormatado = 'R$ ' + total.toFixed(2).replace('.', ',');
    if (subtotalElement) subtotalElement.innerText = totalFormatado;
    if (totalElement) totalElement.innerText = totalFormatado;
    if (cartBadge) cartBadge.innerText = totalItensContagem;
  }

  // Torna updateCart acessível globalmente caso necessário
  window.updateCartUI = updateCart;

  // Captura o clique no botão principal de adicionar ao produto
  document.addEventListener('click', (e) => {
    const directBtn = e.target.closest(
      '.box .btn, .boxsan .btn, .boxsob .btn, .btn-add',
    );
    if (!directBtn) return;

    const productBox = directBtn.closest(
      '.box, .boxsan, .boxsob, .product-card',
    );
    if (!productBox) return;

    const modal = productBox.querySelector('.janela-modal');
    if (modal) {
      e.preventDefault();
      window.abrirModal(directBtn);
      return;
    }
    const titleBase =
      productBox.getAttribute('data-titulo') ||
      productBox.getAttribute('data-name') ||
      productBox.querySelector('h3, .product-title')?.innerText?.trim() ||
      'Produto';

    let precoBruto = productBox.getAttribute('data-preco');
    if (!precoBruto) {
      const priceEl = productBox.querySelector('.price, .product-price');
      precoBruto = priceEl ? priceEl.textContent : '30,00';
    }
    const price =
      parseFloat(precoBruto.replace('R$', '').replace(',', '.').trim()) || 30.0;

    const imgSrc =
      productBox.getAttribute('data-imagem') ||
      productBox.querySelector('img')?.src ||
      '';

    const temperaturaSelecionada =
      temperaturasSelecionadas[titleBase] || 'Quente';

    addItemToCart(titleBase, price, imgSrc, 1, temperaturaSelecionada);
  });

  window.changeQty = function (index, delta) {
    if (cart[index]) {
      const novaQtd = cart[index].quantity + delta;
      if (novaQtd <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = novaQtd;
      }
      updateCart();
    }
  };
  window.setQty = function (index, value) {
    const novaQtd = parseInt(value);
    if (cart[index]) {
      cart[index].quantity = isNaN(novaQtd) || novaQtd <= 0 ? 1 : novaQtd;
      updateCart();
    }
  };

  window.removeItem = function (index) {
    if (cart[index]) {
      cart.splice(index, 1);
      updateCart();
    }
  };

  updateCart();

  if (finalizeBtn) {
    finalizeBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('O seu carrinho está vazio!');
      } else {
        const totalFinal =
          document.getElementById('cart-total')?.innerText || 'R$ 0,00';
        alert(
          `Pedido finalizado!\nTotal a pagar: ${totalFinal}\nObrigado pela preferência!`,
        );
        cart = [];
        updateCart();
        window.fecharCarrinho();
      }
    });
  }
});
