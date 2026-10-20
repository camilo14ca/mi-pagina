console.log("Hola, Logik Pragma");

// ===== ANIMACIONES AL HACER SCROLL =====
(function () {
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Elementos que aparecen al llegar a ellos
  const lista = document.querySelectorAll(
    ".encabezado, .nosotros-texto, .foto, .tarjeta, .mas-proyectos, " +
    ".flujo-sub, .paso, .retorno, .seccion-blanca h2, .demo, .tarjeta-form, .seccion-oscura h2, .contenedor > p"
  );

  lista.forEach(function (elemento) {
    if (elemento.closest(".hero")) return;           // el inicio ya anima solo
    if (elemento.closest(".encabezado") && !elemento.classList.contains("encabezado")) return;
    elemento.classList.add("revelar");
    const hermanos = Array.from(elemento.parentElement.children);
    const posicion = hermanos.indexOf(elemento);
    elemento.style.setProperty("--delay", (posicion % 4) * 0.12 + "s");
  });

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".revelar").forEach(function (elemento) {
    observador.observe(elemento);
  });

  // 2) Barra de progreso, sombra del menú y efecto de "hundirse" del inicio
  const barra = document.getElementById("progreso");
  const menu = document.querySelector(".menu");
  const hero = document.querySelector(".hero");
  let pendiente = false;

  function actualizar() {
    pendiente = false;
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = "scaleX(" + (total > 0 ? y / total : 0) + ")";
    menu.classList.toggle("con-sombra", y > 10);

    if (!sinMovimiento && y < hero.offsetHeight) {
      const avance = y / hero.offsetHeight;          // 0 arriba, 1 al terminar el inicio
      hero.style.setProperty("--py", y * 0.35 + "px");
      hero.style.setProperty("--cy", y * 0.3 + "px");
      hero.style.setProperty("--co", Math.max(0, 1 - avance * 1.3));
      hero.style.setProperty("--cs", 1 - avance * 0.08);
    }
  }

  window.addEventListener("scroll", function () {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizar);
    }
  }, { passive: true });

  actualizar();
  window.animacionesListas = true;
})();

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
