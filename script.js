console.log("Hola, Logik Pragma");

// ===== DEMO DE INVENTARIO =====
const STOCK_MINIMO = 3;
let stock = 10;

const textoStock = document.getElementById("stock");
const aviso = document.getElementById("aviso");
const botonVender = document.getElementById("vender");
const botonReponer = document.getElementById("reponer");

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

// ===== FORMULARIO -> WHATSAPP =====
const campoNombre = document.getElementById("nombre");
const campoNecesidad = document.getElementById("necesidad");
const botonEnviar = document.getElementById("enviar");

botonEnviar.addEventListener("click", function () {
  const nombre = campoNombre.value.trim();
  const necesidad = campoNecesidad.value.trim();

  if (nombre === "" || necesidad === "") {
    alert("Por favor escribe tu nombre y lo que necesitas.");
    return;
  }

  const mensaje = "Hola, soy " + nombre + ". Necesito: " + necesidad;
  const enlace = "https://wa.me/573212474073?text=" + encodeURIComponent(mensaje);

  window.open(enlace, "_blank");
});

// ===== MENÚ EN CELULAR =====
const botonMenu = document.getElementById("menu-boton");
const menuNav = document.getElementById("menu-nav");

botonMenu.addEventListener("click", function () {
  const abierto = menuNav.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", abierto);
  botonMenu.textContent = abierto ? "✕" : "☰";
});

menuNav.addEventListener("click", function (evento) {
  if (evento.target.tagName === "A") {
    menuNav.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.textContent = "☰";
  }
});

// ===== TARJETAS QUE SE VOLTEAN (en celular, al tocar) =====
const tarjetas = document.querySelectorAll(".tarjeta");
tarjetas.forEach(function (tarjeta) {
  tarjeta.addEventListener("click", function (evento) {
    if (!window.matchMedia("(hover: none)").matches) return; // en PC lo hace el CSS
    if (evento.target.tagName === "A") return; // dejar que "Cotiza ya" funcione
    tarjeta.classList.toggle("volteada");
  });
});
