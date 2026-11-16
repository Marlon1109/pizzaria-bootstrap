// Preços das pizzas e bebidas (em reais)
const precos = { calabresa: 40, marguerita: 45, quatro: 52 };
const precosBebidas = { nenhuma: 0, refrigerante: 8, suco: 10, cha: 9, agua: 5 };

// Funções do exercício
const calcularTotal = (preco, qtd) => preco * qtd;
const aplicarDesconto = (valor, percentual) => valor - valor * percentual / 100;
const formatarMoeda = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const form = document.querySelector("#formPedido");
const aviso = document.querySelector("#aviso");
const campoNome = document.querySelector("#nome");
const campoPizza = document.querySelector("#pizza");
const campoQtd = document.querySelector("#qtd");
const campoBebida = document.querySelector("#bebida");
const modalPedido = document.querySelector("#modalPedido");
let pedidoConfirmado = false;

// Botões Pedir selecionam a pizza e levam ao formulário
for (const botao of document.querySelectorAll(".btn-pedir")) {
  botao.addEventListener("click", () => {
    campoPizza.value = botao.dataset.pizza;
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth" });
    campoNome.focus({ preventScroll: true });
  });
}

// Validação e confirmação do pedido
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = campoNome.value.trim();
  const pizza = campoPizza.value;
  const qtd = Number(campoQtd.value);
  const bebida = campoBebida.value;

  if (nome === "") {
    aviso.innerHTML = '<div class="alert alert-warning">Informe o nome do cliente.</div>';
    campoNome.focus();
    return;
  }
  if (!Number.isInteger(qtd) || qtd < 1) {
    aviso.innerHTML = '<div class="alert alert-warning">Informe uma quantidade válida (mínimo 1).</div>';
    campoQtd.focus();
    return;
  }

  aviso.innerHTML = "";
  const subtotal = calcularTotal(precos[pizza], qtd) + precosBebidas[bebida];
  const vip = document.querySelector("#vip").checked;
  const total = vip ? aplicarDesconto(subtotal, 10) : subtotal;

  // textContent evita inserir HTML fornecido pelo usuário
  const recibo = document.querySelector("#recibo");
  recibo.replaceChildren();
  const linhas = [
    `Cliente: ${nome}`,
    `Pedido: ${qtd} x ${campoPizza.selectedOptions[0].textContent}`,
    `Bebida: ${campoBebida.selectedOptions[0].textContent}`,
    `Subtotal: ${formatarMoeda(subtotal)}`,
    `Desconto VIP: ${vip ? "10%" : "0%"}`,
    `Total: ${formatarMoeda(total)}`
  ];
  for (const linha of linhas) {
    const paragrafo = document.createElement("p");
    paragrafo.className = "mb-2";
    paragrafo.textContent = linha;
    recibo.appendChild(paragrafo);
  }

  pedidoConfirmado = true;
  bootstrap.Modal.getOrCreateInstance(modalPedido).show();
});

// Alerta verde após fechar o recibo
modalPedido.addEventListener("hidden.bs.modal", () => {
  if (!pedidoConfirmado) return;
  aviso.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      Pedido realizado com sucesso!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>`;
  pedidoConfirmado = false;
});
