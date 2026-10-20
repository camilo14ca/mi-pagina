console.log("Hola, Logik Pragma");

// ===== ANIMACIONES AL HACER SCROLL =====
(function () {
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Elementos que aparecen al llegar a ellos
  const lista = document.querySelectorAll(
    ".encabezado, .nosotros-texto, .foto, .tarjeta, .mas-proyectos, " +
    ".cifras, .flujo-sub, .paso, .retorno, .seccion-blanca h2, .demo, .tarjeta-form, .seccion-oscura h2, .contenedor > p"
  );

  lista.forEach(function (elemento) {
    if (elemento.closest(".hero")) return;           // el inicio ya anima solo
    if (elemento.closest(".encabezado") && !elemento.classList.contains("encabezado")) return;
    elemento.classList.add("revelar");
    const hermanos = Array.from(elemento.parentElement.children);
    const posicion = hermanos.indexOf(elemento);
    elemento.style.setProperty("--delay", (posicion % 4) * 0.12 + "s");
  });

  // Dirección del scroll: 1 = bajando, -1 = subiendo
  let direccion = 1;
  let ultimoY = window.scrollY;

  function mostrar(elemento) {
    // si sube, el elemento entra desde arriba; si baja, desde abajo
    elemento.style.setProperty("--dy", direccion > 0 ? "32px" : "-32px");
    elemento.classList.remove("visible");
    void elemento.offsetWidth;                        // reinicia la animación
    elemento.classList.add("visible");
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      const elemento = entrada.target;
      if (!entrada.isIntersecting) {
        elemento.classList.remove("visible");         // salió: queda listo para animar otra vez
      } else if (entrada.intersectionRatio >= 0.12 && !elemento.classList.contains("visible")) {
        mostrar(elemento);
      }
    });
  }, { threshold: [0, 0.12] });

  document.querySelectorAll(".revelar").forEach(function (elemento) {
    observador.observe(elemento);
  });

  // 2) Barra de progreso, sombra del menú y efecto de "hundirse" del inicio
  const barra = document.getElementById("progreso");
  const menu = document.querySelector(".menu");
  const hero = document.querySelector(".hero");
  const seccionesCurvas = document.querySelectorAll(".seccion-blanca, .seccion-clara, .seccion-oscura");
  const curvaRelleno = document.getElementById("curva-relleno");
  const curvaLinea = document.getElementById("curva-linea");
  const textosHero = hero.querySelectorAll("h1, p, .boton");
  let pendiente = false;
  let heroOculto = false;

  function reiniciarTextosHero() {
    textosHero.forEach(function (texto) {
      texto.style.animation = "none";
      void texto.offsetWidth;
      texto.style.animation = "";
    });
  }

  function actualizar() {
    pendiente = false;
    const y = window.scrollY;
    direccion = y >= ultimoY ? 1 : -1;
    ultimoY = y;
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

    // El corte azul/blanco se curva más cuanto más bajas (y se aplana al subir)
    const progreso = Math.min(1, y / (hero.offsetHeight * 0.8));
    const profundidad = 15 + 35 * progreso;           // 15 arriba -> 50 abajo
    const control = 100 - 2 * profundidad;
    const curva = "M0,100 Q720," + control + " 1440,100";
    curvaLinea.setAttribute("d", curva);
    curvaRelleno.setAttribute("d", curva + " Z");

    // Bordes ondeados de las demás secciones: se curvan más mientras pasan por la pantalla
    if (!sinMovimiento) {
      const alto = window.innerHeight;
      seccionesCurvas.forEach(function (seccion) {
        const caja = seccion.getBoundingClientRect();
        // Contacto se curva por arriba; las demás por abajo
        const borde = seccion.classList.contains("seccion-oscura") ? caja.top : caja.bottom;
        const t = Math.min(1, Math.max(0, 1 - borde / alto));
        seccion.style.setProperty("--curva", (16 + 22 * t) + "px");
      });
    }

    // Al volver arriba, el texto del inicio vuelve a entrar
    if (y > hero.offsetHeight * 0.6) {
      heroOculto = true;
    } else if (y < 10 && heroOculto && !sinMovimiento) {
      heroOculto = false;
      reiniciarTextosHero();
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

// ===== CIFRAS QUE SUBEN CONTANDO =====
(function () {
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numeros = document.querySelectorAll(".kpi-num");

  function texto(elemento, valor) {
    const prefijo = elemento.dataset.prefijo || "";
    const sufijo = elemento.dataset.sufijo || "";
    elemento.textContent = prefijo + Math.round(valor) + sufijo;
  }

  function contar(elemento) {
    const meta = Number(elemento.dataset.valor);
    if (sinMovimiento) { texto(elemento, meta); return; }
    const duracion = 1400;
    const inicio = performance.now();
    function paso(ahora) {
      const avance = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - avance, 3);          // empieza rápido y frena al final
      texto(elemento, meta * suave);
      if (avance < 1 && elemento.dataset.contando === "si") requestAnimationFrame(paso);
    }
    elemento.dataset.contando = "si";
    requestAnimationFrame(paso);
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      const elemento = entrada.target;
      if (entrada.isIntersecting && entrada.intersectionRatio >= 0.5) {
        contar(elemento);
      } else if (!entrada.isIntersecting) {
        elemento.dataset.contando = "no";
        texto(elemento, 0);                               // al salir vuelve a 0 y cuenta de nuevo
      }
    });
  }, { threshold: [0, 0.5] });

  numeros.forEach(function (n) { texto(n, 0); observador.observe(n); });
})();
