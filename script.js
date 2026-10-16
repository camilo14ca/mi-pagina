console.log("Hola, Logik Pragma");

let stock = 10;

const textoStock = document.getElementById("stock");
const aviso = document.getElementById("aviso");
const botonVender = document.getElementById("vender");
const botonReponer = document.getElementById("reponer");
const STOCK_MINIMO = 3;

function mostrarStock() {
  if (stock === 0) {
    textoStock.textContent = "Agotado";
  } else {
    textoStock.textContent = stock;
  }

  if (stock <= STOCK_MINIMO) {
    aviso.textContent = "Stock bajo, quedan solo " + stock;
  } else {
    aviso.textContent = "";
  }
}

botonVender.addEventListener("click", function () {
  if (stock > 0) {
    stock = stock - 1;
    mostrarStock();
  }
});

botonReponer.addEventListener("click", function () {
  stock = stock + 1;
  mostrarStock();
});

mostrarStock();

const campoNombre = document.getElementById("nombre");
const campoNecesidad = document.getElementById("necesidad");
const botonEnviar = document.getElementById("enviar");

botonEnviar.addEventListener("click", function () {
  const nombre = campoNombre.value;
  const necesidad = campoNecesidad.value;

  const mensaje = "Hola, soy " + nombre + ". Necesito: " + necesidad;
  const enlace = "https://wa.me/573212474073?text=" + encodeURIComponent(mensaje);

  window.open(enlace, "_blank");
});