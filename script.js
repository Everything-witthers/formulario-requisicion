let listaProductos = [];
const productos = [];

// NUEVA URL del Apps Script
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbyZpM544UgkXCuWAyn1fTCxT45EYO33dE1iaihFTNXi1XSefaArV5ybiy_HS8C5Nc6CGA/exec";

// Cargar catálogo desde la hoja de Google Sheets
fetch(URL_SCRIPT)
  .then(res => res.json())
  .then(data => {
    listaProductos = data.map(p => ({
      sku: p.sku,
      nombre: p.nombre,
      unidad: p.unidad
    }));
    mostrarCatalogo();
  });

// Buscador principal
document.getElementById("buscador").addEventListener("input", function () {
  const texto = this.value.trim().toLowerCase();
  const encontrado = listaProductos.find(p =>
    p.nombre.toLowerCase().includes(texto) || p.sku.toLowerCase().includes(texto)
  );
  if (encontrado) {
    document.getElementById("sku").value = encontrado.sku;
    document.getElementById("producto").value = encontrado.nombre;
    document.getElementById("unidad").value = encontrado.unidad;
  }
});

// Autocompletado por nombre
document.getElementById("producto").addEventListener("input", function () {
  const nombre = this.value.toLowerCase().trim();
  const encontrado = listaProductos.find(p =>
    p.nombre.toLowerCase().includes(nombre)
  );
  if (encontrado) {
    document.getElementById("sku").value = encontrado.sku;
    document.getElementById("unidad").value = encontrado.unidad;
  }
});

// Autocompletado por SKU
document.getElementById("sku").addEventListener("input", function () {
  const sku = this.value.toUpperCase().trim();
  const encontrado = listaProductos.find(p =>
    p.sku.toUpperCase().includes(sku)
  );
  if (encontrado) {
    document.getElementById("producto").value = encontrado.nombre;
    document.getElementById("unidad").value = encontrado.unidad;
  }
});

function agregarProducto() {
  const sku = document.getElementById("sku").value;
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const unidad = document.getElementById("unidad").value;
  const nota = document.getElementById("nota").value;

  if (!producto || !cantidad) {
    alert("Por favor completa al menos producto y cantidad");
    return;
  }

  productos.push({ sku, producto, cantidad, unidad, nota });
  renderizarTabla();
  limpiarFormulario();
}

function renderizarTabla() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";

  productos.forEach((item, index) => {
    const fila = `
      <tr>
        <td>${item.sku}</td>
        <td>${item.producto}</td>
        <td>${item.cantidad}</td>
        <td>${item.unidad}</td>
        <td>${item.nota || ""}</td>
        <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

function eliminarProducto(index) {
  productos.splice(index, 1);
  renderizarTabla();
}

function limpiarFormulario() {
  document.getElementById("sku").value = "";
  document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("unidad").value = "";
  document.getElementById("nota").value = "";
  document.getElementById("buscador").value = "";
}

function mostrarCatalogo() {
  const tbody = document.querySelector("#tabla-catalogo tbody");
  tbody.innerHTML = "";

  listaProductos.forEach(p => {
    const fila = `
      <tr>
        <td>${p.sku}</td>
        <td>${p.nombre}</td>
        <td>${p.unidad}</td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

// Opcional: enviar por correo o a Google Sheets (a definir)
function enviarFormulario() {
  if (productos.length === 0) {
    alert("No hay productos para enviar.");
    return;
  }

  const cuerpo = productos.map(p =>
    `• ${p.cantidad} ${p.unidad} de ${p.producto} (${p.sku}) ${p.nota ? '- ' + p.nota : ''}`
  ).join('\n');

  alert("Formulario preparado para enviar:\n\n" + cuerpo);
  // Aquí puedes agregar el fetch para enviar datos al backend si lo deseas
  productos.length = 0;
  renderizarTabla();
}
